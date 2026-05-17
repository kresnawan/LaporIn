import express from "express";
import "dotenv/config";
import query from "../db/query.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "report_images/");
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

const userPath = express.Router();

userPath.get("/", authenticateToken(false), async (req, res) => {
    const { id, p = "1", self = "0" } = req.query;

    if (self) {
        if (!req.userId) return res.status(401).send();

        try {
            const result = await query(`
            SELECT
                user_id,
                email,
                first_name,
                last_name,
                role_id,
                created_at,
                updated_at
            FROM
                user
            WHERE user_id = ?
            `, [req.userId])

            if (result.results.length < 1) return res.status(404).send("Data pengguna tidak ditemukan");

            return res.send(result.results[0]);
        } catch (error) {
            return res.status(500).send();
        }
    } else if (!id) {
        if (req.userRole !== 2) return res.status(403).send();

        try {
            const result = await query(`
                SELECT
                    user_id,
                    email,
                    first_name,
                    last_name,
                    role_id,
                    created_at,
                    updated_at
                FROM
                    user
                LIMIT 8 OFFSET ?
            `, [(parseInt(p) - 1) * 8])

            return res.send(result.results);
        } catch (error) {
            return res.status(500).send();
        }
    }

    try {
        const result = await query(`
            SELECT
            user_id,
                    email,
                    first_name,
                    last_name,
                    role_id,
                    created_at,
                    updated_at
            FROM
                user
            WHERE user_id = ?
        `, [id])

        if (result.results.length < 1) return res.status(404).send();

        return res.send(result.results[0]);
    } catch (error) {
        return res.status(500).send();
    }
});

// Only admin
userPath.patch("/", authenticateToken(true), async (req, res) => {
    const { id } = req.query;
    const { first_name, last_name } = req.body;

    if (req.userId !== parseInt(id)) {
        return res.status(401).send();
    }

    try {
        await query(`
            UPDATE
                user
            SET first_name = ?, last_name = ?
            WHERE user_id = ?    
        `, [first_name, last_name, id])

        return res.status(200).send();
    } catch (error) {
        return res.status(500).send("Terjadi error");
    }
});

// Only author and any admin
userPath.delete("/", authenticateToken(true), async (req, res) => {
    const { id } = req.query;

    try {
        const checkResult = await query(`
            SELECT report_id FROM report 
            WHERE report_id = ? AND author_id = ?
        `, [id, req.userId]);

        if (checkResult.results.length < 1) {
            return res.status(403).send("Anda tidak memiliki akses atau data tidak ditemukan");
        }

        const imageResult = await query(`
            SELECT image_url FROM report_image WHERE report_id = ?   
        `, [id]);
        const imageData = imageResult.results;

        await query(`DELETE FROM report WHERE report_id = ?`, [id]);

        await Promise.all(imageData.map(async (img) => {
            try {
                const filePath = path.join('report_images', img.image_url);
                await fs.unlink(filePath);
            } catch (err) {
                console.error(`Gagal hapus file fisik: ${img.image_url}`, err);
            }
        }));

        return res.send("Aduan dan gambar terkait berhasil dihapus permanen");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Terjadi kesalahan pada server");
    }
});

export default userPath;
