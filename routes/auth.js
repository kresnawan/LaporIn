import express from "express";
import { authenticateToken } from "../middleware/authentication.js";
import { handleLogin, handleLogout, handleRegister, handleRenewToken } from "../handler/auth.js";

const authRoute = express.Router();

authRoute.post("/login", handleLogin);
authRoute.post("/register", authenticateToken, handleRegister);
authRoute.delete("/logout", handleLogout);
authRoute.get("/token", handleRenewToken);

export default authRoute;
