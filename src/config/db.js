import { Sequelize } from '@sequelize/core';
import "dotenv/config"

const sequelize = new Sequelize({
  dialect: 'postgres', 
  database: process.env.DB_NAME,  // Sử dụng biến môi trường DB_NAME
  user: process.env.DB_USER,  // Sử dụng biến môi trường DB_USER
  password: process.env.DB_PASSWORD,  // Sử dụng biến môi trường DB_PASSWORD
  host: process.env.DB_HOST,  // Sử dụng biến môi trường DB_HOST
  port: process.env.DB_PORT,  // Sử dụng biến môi trường DB_PORT
  ssl: false,  // Nếu cần SSL (tuỳ vào yêu cầu của Railway, có thể cần cấu hình này)
  clientMinMessages: 'notice',
});

export default sequelize;
