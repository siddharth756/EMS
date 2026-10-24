import express from "express";
import * as notice from "../controllers/notice.controller.js";
import { permit } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============ Notice Routes ============

router.post("/", permit("admin"), notice.createNotice);
router.get("/", permit("admin","employee"), notice.getNotices);
router.delete("/:id", permit("admin"), notice.deleteNotice);

export default router;
