import express from "express";
import "dotenv/config";
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

const upload = multer({ storage: storage })
import { authenticateToken } from "../middleware/authentication.js";;
import { 
    handleDeleteArticle, 
    handleGetArticle, 
    handleGetArticleLength, 
    handlePatchArticle, 
    handlePostArticle 
} from "../handler/article.js";

const articleRoute = express.Router();

articleRoute.get("/", authenticateToken(false), handleGetArticle);
articleRoute.get("/length", authenticateToken(false), handleGetArticleLength);
articleRoute.post("/", authenticateToken(true), upload.array('images', 5), handlePostArticle);
articleRoute.patch("/", authenticateToken(true), handlePatchArticle);
articleRoute.delete("/", authenticateToken(true), handleDeleteArticle);

export default articleRoute;
