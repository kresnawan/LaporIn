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

import fs from 'fs';
import { authenticateToken } from "../middleware/authentication.js";
import { pool } from "../db/connection-pool.js";
import knex from "knex";

const articleRoute = express.Router();

articleRoute.get("/", authenticateToken, (req, res) => {
    const { k = "", p = "1", sort_by = "newest", is_archived = "0" } = req.query;

    if (is_archived === "1" && req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses")
    }

    query(`
        SELECT
            a.article_id,
            a.author_id,
            CONCAT(u.first_name, ' ', u.last_name) AS author_name,
            a.article_title,
            a.article_body,
            a.is_archived,
            a.created_at
        FROM
            article a
        INNER JOIN
            user u ON u.user_id = a.author_id
        WHERE 
            LOWER(a.article_title) LIKE ? AND is_archived = ?
        ORDER BY a.created_at ${sort_by === "oldest" ? `ASC` : `DESC`}
        LIMIT 8 OFFSET ?
    `, [`%${k.toLowerCase()}%`, is_archived, (parseInt(p) - 1) * 8]).then(results => {
        return res.send(results.results);
    }).catch(err => {
        return res.status(500).send(err)
    })
});

articleRoute.post("/", authenticateToken, upload.array('images', 5), async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const files = req.files;
    const { article_title, article_body } = req.body;

    if (!files || files.length === 0 || !article_title || !article_body) {
        return res.status(400).send('Body tidak lengkap');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(`
            INSERT INTO
                article (author_id, article_title, article_body)
            VALUES
                (?, ?, ?)`,
            [req.userId, article_title, article_body]);

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

articleRoute.patch("/", authenticateToken, async (req, res) => {
    console.log(req.userRole);
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;
    const { title, body, archive } = req.body;

    if (archive) {
        try {
            await query(`UPDATE article SET is_archived = 1 WHERE article_id = ?`, [id])

            return res.send("Artikel berhasil diarsipkan")
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

articleRoute.delete("/", authenticateToken, async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;

    try {
        const result = await query(`
            SELECT image_url FROM article_image WHERE article_id = ?   
        `, [id]);

        const imageData = result.results;

        await Promise.all(imageData.map((img) => {
            const filePath = path.join('article_images', img.image_url);
            fs.unlink(filePath, (err) => {
                console.error("Gagal hapus file: " + img.image_url + " " + err)
            });
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
