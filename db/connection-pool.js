import mysql2 from 'mysql2/promise'
import 'dotenv/config';

export const pool = mysql2.createPool({
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DB,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  maxIdle: 0,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});