import express from "express";
import "dotenv/config";
import query from "../db/query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authentication.js";

const reportRoute = express.Router();

const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

reportRoute.get("/", (req, res) => {});
reportRoute.post("/", (req, res) => {});

reportRoute.get("/:id", (req, res) => {});
reportRoute.patch("/:id/judge", (req, res) => {});
reportRoute.patch("/:id/vote", (req, res) => {});

export default reportRoute;
