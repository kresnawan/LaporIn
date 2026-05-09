import { pool } from "./connection-pool.js";

const query = (queryString, args) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection();
      const [rows, fields] = await connection.execute(queryString, args);
      connection.release();

      resolve({ results: rows, fields: fields });

    } catch (error) {
      reject(error);
    }
  })
}

export default query;