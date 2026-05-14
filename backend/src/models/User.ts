import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    updatedAt: false,
    createdAt: 'createdAt',
  },
);
