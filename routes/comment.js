import express from "express";
import "dotenv/config";
import query from "../db/query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authentication.js";

const commentRoute = express.Router();

const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

commentRoute.get("/", (req, res) => {});

commentRoute.get("/:id", (req, res) => {});
commentRoute.post("/", (req, res) => {});
commentRoute.patch("/:id", (req, res) => {});

export default commentRoute;
