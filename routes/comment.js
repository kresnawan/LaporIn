import express from "express";
import "dotenv/config";
import query from "../db/query.js";
import { authenticateToken } from "../middleware/authentication.js";

const commentRoute = express.Router();

commentRoute.get("/", (req, res) => {
    const { content, id, p = "1" } = req.query;

    query(`
        SELECT
            c.comment_id,
            c.author_id,
            CONCAT(u.first_name, ' ', u.last_name) AS author_name,
            c.${content}_id,
            c.comment_body,
            c.created_at
        FROM
            ${content}_comment c
        INNER JOIN
            user u ON u.user_id = c.author_id
        WHERE 
            ${content}_id = ?

        ORDER BY c.created_at DESC
        LIMIT 8 OFFSET ?
    `, [id, (parseInt(p) - 1) * 8]).then(results => {
        return res.send(results.results);
    }).catch(err => {
        return res.status(500).send(err)
    })
});

commentRoute.post("/", authenticateToken(true), async (req, res) => {
    const { content, id, comment_body } = req.body;
    console.log(req.userId);

    try {
        await query(`
            INSERT INTO
                ${content}_comment (
                    author_id, 
                    ${content}_id,
                    comment_body
                )
            VALUES
                (?, ?, ?)`,
            [req.userId, id, comment_body]);

        return res.send("Komentar berhasil diposting")
    } catch (error) {

        return res.status(500).send(error);
    }
});

commentRoute.delete("/", authenticateToken(true), async (req, res) => {
    const { content, comment_id } = req.query;

    try {
        await query(`
            DELETE FROM ${content}_comment WHERE comment_id = ? AND author_id = ?
        `, [comment_id, req.userId]);

        return res.send("Komentar berhasil dihapus permanen")
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default commentRoute;
