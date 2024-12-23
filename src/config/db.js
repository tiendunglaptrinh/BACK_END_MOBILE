import { Sequelize } from '@sequelize/core';

const sequelize = new Sequelize({
  dialect: 'postgres', 
  database: 'roomly',
  user: 'postgres',
  password: '13102003',
  host: 'localhost',
  port: 8080,
  ssl: false,
  clientMinMessages: 'notice',
});

export default sequelize;
