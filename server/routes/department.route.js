import express from "express";
import department from "../controllers/department.controller.js";
import { protectRoute, permit } from "../middleware/auth.middleware.js";

const router = express.Router();


// ============ Department ============
router.get("/", department.getDepartments);

// Admin-only routes
router.post("/", protectRoute, permit("admin"), department.addDepartment);
router.put("/:id", protectRoute, permit("admin"), department.updateDepartment);
router.delete("/:id", protectRoute, permit("admin"), department.deleteDepartment);

export default router;