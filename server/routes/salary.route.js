import express from "express";
import salary from "../controllers/salary.controller.js";
import { permit } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============  Salary ============
router.post("/", permit("admin"), salary.addSalary);
router.get("/", permit("admin"), salary.getSalaries);

// Admin-only actions
router.get("/:id", permit("admin","employee"), salary.getSalaryByEmployee);
router.put("/:id", permit("admin"), salary.updateSalary);
router.delete("/:id", permit("admin"), salary.deleteSalary);

export default router;