import express from "express";
import {
  createEvent,
  getEventLogs,
  getEventsForProfile,
  updateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEventsForProfile);
router.put("/:id", updateEvent);
router.get("/:id/logs", getEventLogs);

export default router;
