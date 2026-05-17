import express from "express";
import "dotenv/config";
import query from "../db/query.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "article_images/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const knexInstance = knex({ client: 'mysql' });

const upload = multer({ storage: storage })

import fs from 'fs/promises';
import { authenticateToken } from "../middleware/authentication.js";
import { pool } from "../db/connection-pool.js";
import knex from "knex";

const categoryRoute = express.Router();

categoryRoute.get("/", (req, res) => {
    const { name = "", id = "" } = req.query;

    query(`
        SELECT
            category_id,
            category_name
        FROM
            category
        WHERE 
            LOWER(category_name) LIKE ? AND category_id LIKE ?
    `, [`%${name.toLowerCase()}%`, `%${id}%`]).then(results => {
        return res.send(results.results);
    }).catch(err => {
        return res.status(500).send(err)
    })
});

categoryRoute.post("/", authenticateToken(true), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send();
    }
    const { category_name } = req.body;

    try {
        await query(`
            INSERT INTO
                category (category_name)
            VALUES (?)    
        `, [category_name])
    } catch (error) {
        return res.status(500).send();
    }
});

categoryRoute.patch("/", authenticateToken(true), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;
    const { category_name } = req.body;

    try {
        await query(`
            UPDATE 
                category
            SET 
                category_name = ?
            WHERE 
                category_id = ?    
        `, [category_name, id]);

        return res.send("Kategori berhasil diubah");
    } catch (error) {
        return res.status(500).send();
    }
});

categoryRoute.delete("/", authenticateToken(true), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;

    try {
        await query(`
            DELETE FROM
                category
            WHERE
                category_id = ?
        `, [id]);

        return res.send("Kategori berhasil diubah");
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default categoryRoute;
