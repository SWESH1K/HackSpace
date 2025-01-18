import express from "express"
import { createEvent, deleteAllEvents, deleteEvent, getEvents, updateEvent } from "../controllers/event.controller.js"
import roundsRouter from "../routes/rounds.routes.js"

const router = express.Router()

router.post("/", createEvent)
router.get("/", getEvents)
router.delete("/", deleteAllEvents)
router.delete("/:id", deleteEvent)
router.put("/:id/updateEvent", updateEvent)

// Forward to the rounds router.
router.use("/:id/rounds/", roundsRouter)

export default router