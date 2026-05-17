import express from "express";
import "dotenv/config";
import { authenticateToken } from "../middleware/authentication.js";
import { handleDeleteComment, handleGetComment, handlePostComment } from "../handler/comment.js";

const commentRoute = express.Router();

commentRoute.get("/", handleGetComment);
commentRoute.post("/", authenticateToken(true), handlePostComment);
commentRoute.delete("/", authenticateToken(true), handleDeleteComment);

export default commentRoute;
