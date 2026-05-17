import express from "express";
import "dotenv/config";
import { authenticateToken } from "../middleware/authentication.js";
import { handleDeleteCategories, handleGetCategories, handlePatchCategories, handlePostCategories } from "../handler/category.js";

const categoryRoute = express.Router();

categoryRoute.get("/", handleGetCategories);

categoryRoute.post("/", authenticateToken(true), handlePostCategories);

categoryRoute.patch("/", authenticateToken(true), handlePatchCategories);

categoryRoute.delete("/", authenticateToken(true), handleDeleteCategories);

export default categoryRoute;
