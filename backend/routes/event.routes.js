import express from "express"
import { createEvent, deleteAllEvents, getEvents, updateEvent } from "../controllers/event.controller.js"
import roundsRouter from "../routes/rounds.routes.js"

const router = express.Router()

router.post("/", createEvent)
router.get("/", getEvents)
router.delete("/all", deleteAllEvents)
router.put("/:id/updateEvent", updateEvent)
router.use("/:id/rounds/", roundsRouter)

export default router