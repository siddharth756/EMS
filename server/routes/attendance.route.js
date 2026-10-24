import express from "express";
import attendance from "../controllers/attendance.controller.js";
import { permit } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============  Attendance ============
router.get("/", attendance.getAttendance);                      
router.get("/:id", attendance.getAttendanceByEmployee);

// Admin-only actions
// router.post("/", permit("admin"), attendance.addAttendance);
router.put("/:id", permit("admin"), attendance.updateAttendance);

export default router;