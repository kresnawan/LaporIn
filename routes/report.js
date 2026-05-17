import express from "express";
import "dotenv/config";
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

const upload = multer({ storage: storage })

import { authenticateToken } from "../middleware/authentication.js";
import { handleDeleteReport, handleGetReport, handleGetReportLength, handleGetReportSelf, handleGetReportSelfLength, handlePatchReport, handlePostReport } from "../handler/report.js";

const reportRoute = express.Router();

reportRoute.get("/", authenticateToken(false), handleGetReport);

reportRoute.get("/length", authenticateToken(false), handleGetReportLength);

reportRoute.get("/self", authenticateToken(true), handleGetReportSelf);

reportRoute.get("/self/length", authenticateToken(true), handleGetReportSelfLength);

reportRoute.post("/", authenticateToken(true), upload.array('images', 5), handlePostReport);

reportRoute.patch("/", authenticateToken(true), handlePatchReport);

reportRoute.delete("/", authenticateToken(true), handleDeleteReport);

export default reportRoute;
