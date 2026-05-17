import express from "express";
import { authenticateToken } from "../middleware/authentication.js";
import query from "../db/query.js";

const statRoute = express.Router();

statRoute.get("/", async (req, res) => {
    try {
        const reportCountRow = await query(`
            SELECT COUNT(report_id) AS count FROM report WHERE status_id = 2 OR status_id = 4
        `)

        const doneReportCountRow = await query(`
            SELECT COUNT(report_id) AS count FROM report WHERE status_id = 4 
        `)

        const articleCountRow = await query(`
            SELECT COUNT(article_id) AS count FROM article WHERE is_archived = 0 
        `)

        return res.send({ report: reportCountRow.results[0].count, doneReport: doneReportCountRow.results[0].count, article: articleCountRow.results[0].count })
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default statRoute;
