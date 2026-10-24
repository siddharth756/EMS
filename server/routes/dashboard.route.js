import express from "express";
import dashboard from "../controllers/dashboard.controller.js";
import { permit } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin dashboard
router.get("/admin", permit("admin"), dashboard.adminDashboard);        

// Employee dashboard
router.get("/employee", permit("employee"), dashboard.employeeDashboard);   

export default router;