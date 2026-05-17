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
import { handleDeleteReport, handleGetReport, handleGetReportLength, handleGetReportSelf, handlePatchReport, handlePostReport } from "../handler/report.js";

const reportRoute = express.Router();

reportRoute.get("/", authenticateToken(false), handleGetReport);

reportRoute.get("/self", authenticateToken(true), handleGetReportSelf);

reportRoute.get("/length", authenticateToken(false), handleGetReportLength);

reportRoute.post("/", authenticateToken(true), upload.array('images', 5), handlePostReport);

reportRoute.patch("/", authenticateToken(true), handlePatchReport);

reportRoute.delete("/", authenticateToken(true), handleDeleteReport);

export default reportRoute;
