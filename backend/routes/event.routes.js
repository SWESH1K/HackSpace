import express from "express"
import { createEvent, deleteAllEvents, deleteEvent, getEvent, getEvents, getMyEvents, updateEvent } from "../controllers/event.controller.js"
import roundsRouter from "../routes/rounds.routes.js"

const router = express.Router()

router.post("/", createEvent)
router.get("/", getEvents)
router.get("/my", getMyEvents)
router.get("/:id", getEvent)
router.delete("/", deleteAllEvents)
router.delete("/:id", deleteEvent)
router.put("/updateEvent/:id", updateEvent)

// Forward to the rounds router.
router.use("/:id/rounds/", roundsRouter)

export default router