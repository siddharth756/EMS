import express from "express";
import employee from "../controllers/employee.controller.js";
import { permit } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ============ Employee ============
router.get("/", employee.getEmployees);
router.get("/:id", employee.getEmployeeById);

// Admin-only routes
router.post("/", permit("admin"), upload.single("avatar"), employee.addEmployee);
router.put("/:id", permit("admin", "employee"), upload.single("avatar"), employee.updateEmployee);
router.delete("/:id", permit("admin"), employee.deleteEmployee);

export default router;