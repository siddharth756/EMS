import express from "express";
import leave from "../controllers/leave.controller.js";
import { permit } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============  Leave ============
router.post("/", leave.applyLeave);
router.get("/:id", leave.getLeavesByEmployee);

// Admin-only actions
router.get("/", permit("admin"), leave.getLeaves);           
router.put("/:id", permit("admin"), leave.updateLeave);      

export default router;