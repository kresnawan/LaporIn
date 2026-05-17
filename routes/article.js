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

const articleRoute = express.Router();

articleRoute.get("/", authenticateToken(false), async (req, res) => {
    const {
        k = "",
        p = "1",
        category = "",
        sort_by = "newest",
        article_id,
        is_archived = "0"
    } = req.query;

    if (is_archived !== "0" && req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses")
    }

    try {
        if (article_id) {
            const articleRows = await query(`
				SELECT 
					a.*,
					CONCAT(u.first_name, ' ', u.last_name) as author_name 
				FROM 
					article a 
				INNER JOIN 
					user u ON u.user_id = a.author_id
				WHERE 
				a.article_id = ?
			`, [article_id]);
            const imageRows = await query(`SELECT image_url FROM article_image WHERE article_id = ?`, [article_id]);
            let obj;

            if (articleRows.results.length < 1) {
                return res.status(404).send();
            } else {
                obj = { ...articleRows.results[0], images: imageRows.results };
            }

            return res.send(obj);
        }

        let sql = `
            SELECT 
				a.*,
				CONCAT(u.first_name, ' ', u.last_name) AS author_name,
            	img.image_url
            FROM article a
            INNER JOIN user u ON u.user_id = a.author_id
            INNER JOIN (
                SELECT article_id, image_url, ROW_NUMBER() OVER (PARTITION BY article_id) as an
                FROM article_image
            ) img ON a.article_id = img.article_id
            WHERE img.an = 1 AND LOWER(a.article_title) LIKE ?
        `;

        let queryArgs = [`%${k.toLowerCase()}%`];

        if (category !== "all") {
            sql += ` AND a.category_id = ?`;
            queryArgs.push(category);
        }

        if (is_archived !== "all") {
            sql += ` AND a.is_archived = ?`
            queryArgs.push(is_archived);
        }

        const orderBy = () => {
            if (sort_by === "newest") {
                return "a.created_at DESC"
            } else if (sort_by === "oldest") {
                return "a.created_at ASC"
            }
        }

        sql += ` ORDER BY ${orderBy()} LIMIT 8 OFFSET ?`;

        const offset = (Math.max(1, parseInt(p)) - 1) * 8;
        queryArgs.push(offset);

        const results = await query(sql, queryArgs);
        return res.send(results.results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

articleRoute.get("/length", authenticateToken(false), async (req, res) => {
    const {
        k = "",
        category = "",
        is_archived = "0"
    } = req.query;

    if (is_archived !== "0" && req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses")
    }

    try {
        let sql = `
            SELECT 
				COUNT(article_id) AS count
            FROM 
                article a
            WHERE 
                LOWER(a.article_title) LIKE ?
        `;

        let queryArgs = [`%${k.toLowerCase()}%`];

        if (category !== "all") {
            sql += ` AND a.category_id = ?`;
            queryArgs.push(category);
        }

        if (is_archived !== "all") {
            sql += ` AND a.is_archived = ?`
            queryArgs.push(is_archived);
        }

        const results = await query(sql, queryArgs);
        return res.send(results.results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

articleRoute.post("/", authenticateToken(true), upload.array('images', 5), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const files = req.files;
    const { article_title, article_body, category_id } = req.body;

    if (!files || files.length === 0 || !article_title || !article_body) {
        return res.status(400).send('Body tidak lengkap');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(`
            INSERT INTO
                article (author_id, article_title, article_body, category_id)
            VALUES
                (?, ?, ?, ?)`,
            [req.userId, article_title, article_body, category_id]);

        const { sql, bindings } = knexInstance('article_image')
            .insert(files.map(file => ({ article_id: result.insertId, image_url: file.filename })))
            .toSQL().toNative();

        await connection.execute(sql, bindings);

        await connection.commit();

        return res.send("Artikel berhasil ditambahkan")
    } catch (error) {
        await connection.rollback();
        files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Gagal hapus:", file.path);
            });
        });

        return res.status(500).send(error);
    } finally {
        connection.release();
    }
});

articleRoute.patch("/", authenticateToken(true), async (req, res) => {
    console.log(req.userRole);
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;
    const { title, body, delete_article, archive } = req.body;

    if (archive !== undefined && archive !== null) {
        try {
            let result;
            if (archive === 1) {
                result = await query(`UPDATE article SET is_archived = 1 WHERE article_id = ? AND is_archived = 0`, [id])
                return res.send("Artikel berhasil diarsipkan")
            } else if (archive === 0) {
                result = await query(`UPDATE article SET is_archived = 0 WHERE article_id = ? AND is_archived = 1`, [id])
                return res.send("Artikel berhasil dikeluarkan dari arsip")
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    try {
        await query(`
        UPDATE
            article
        SET
            article_title = ?, article_body = ?
        WHERE
            article_id = ?
    `, [title, body, id]);
    } catch (error) {
        return res.send(error);
    }

    return res.send("Artikel berhasil diubah");
});

articleRoute.delete("/", authenticateToken(true), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;

    try {
        const result = await query(`
            SELECT image_url FROM article_image WHERE article_id = ?   
        `, [id]);

        const imageData = result.results;

        await Promise.all(imageData.map(async (img) => {
            try {
                const filePath = path.join('article_images', img.image_url);
                await fs.unlink(filePath);
            } catch (err) {
                console.error(`Gagal hapus file fisik: ${img.image_url}`, err);
            }
        }));

        await query(`
            DELETE FROM article WHERE article_id = ?
        `, [id]);

        return res.send("Artikel berhasil dihapus permanen")
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default articleRoute;
