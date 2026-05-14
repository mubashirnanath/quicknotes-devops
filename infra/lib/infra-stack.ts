import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "QuickNotesSecret",
      "quicknotes/prod",
    );

    const vpc = new ec2.Vpc(this, "QuickNotesVpc", {
      maxAzs: 2,

      natGateways: 1,

      subnetConfiguration: [
        {
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });

    const lambdaSg = new ec2.SecurityGroup(this, "LambdaSG", {
      vpc,
      allowAllOutbound: true,
    });

    const mysqlSg = new ec2.SecurityGroup(this, "MysqlSG", {
      vpc,
      allowAllOutbound: true,
    });

    mysqlSg.addIngressRule(
      lambdaSg,
      ec2.Port.tcp(3306),
      "Allow Lambda access to MySQL",
    );

    const ec2Role = new iam.Role(this, "Ec2SsmRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    ec2Role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonSSMManagedInstanceCore",
      ),
    );

    // mysqlSg.addIngressRule(
    //   ec2.Peer.ipv4('<YOUR IP ADDRESS>'),
    //   ec2.Port.tcp(22),
    //   'Allow SSH from my IP'
    // );

    const dbInstance = new ec2.Instance(this, "QuickNotesMysql", {
      vpc,
      role: ec2Role,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),

      machineImage: ec2.MachineImage.fromSsmParameter(
        "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id",
      ),

      securityGroup: mysqlSg,

      keyName: "quicknotes-key-1",
    });

    const backendLambda = new NodejsFunction(this, "QuickNotesBackend", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "../backend/src/lambda.ts",
      handler: "handler",
      depsLockFilePath: "../backend/package-lock.json",
      projectRoot: "../backend",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      vpc,
      securityGroups: [lambdaSg],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: "node20",
        nodeModules: ["sequelize", "mysql2"],
        externalModules: [],
      },
      environment: {
        DATABASE_URL: secret.secretValueFromJson("DATABASE_URL").unsafeUnwrap(),

        JWT_SECRET: secret.secretValueFromJson("JWT_SECRET").unsafeUnwrap(),

        JWT_EXPIRES_IN: secret
          .secretValueFromJson("JWT_EXPIRES_IN")
          .unsafeUnwrap(),

        NODE_ENV: "production",
        FORCE_UPDATE: Date.now().toString(),
      },
    });

    secret.grantRead(backendLambda);

    const api = new apigateway.LambdaRestApi(this, "QuickNotesApi", {
      handler: backendLambda,
      proxy: true,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "MysqlPrivateIp", {
      value: dbInstance.instancePrivateIp,
    });
  }
}
