import { Sequelize } from 'sequelize';
import * as mysql2 from 'mysql2';
import { env } from './env';


export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
