import { pool } from "./connection-pool.js";

const query = (queryString, args) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await pool.execute(queryString, args);
      resolve({ results: rows, fields: fields });

    } catch (error) {
      reject(error);
    }
  });
}

export default query;