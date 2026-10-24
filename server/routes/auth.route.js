import express from "express";
import { protectRoute, permit } from "../middleware/auth.middleware.js";
import { login, register, getUserProfile, logout } from "../controllers/auth.controller.js";


const router = express.Router();

// ============  User ============
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", protectRoute, getUserProfile);

export default router;