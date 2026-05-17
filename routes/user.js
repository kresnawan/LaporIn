import express from "express";
import "dotenv/config";
import { authenticateToken } from "../middleware/authentication.js";
import { handleDeleteUser, handleGetUser, handlePatchUser } from "../handler/user.js";

const userPath = express.Router();

userPath.get("/", authenticateToken(false), handleGetUser);
userPath.patch("/", authenticateToken(true), handlePatchUser);
userPath.delete("/", authenticateToken(true), handleDeleteUser);

export default userPath;
