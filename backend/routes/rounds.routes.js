import express from "express"
import { addRound, getRounds } from "../controllers/rounds.controller.js"
import { checkEventId } from "../middleware/checkEventId.js"

const router = express.Router({mergeParams: true})

router.use(checkEventId) // Use the middleware for all routes in this router

router.post("/", addRound)
router.get("/", getRounds)

export default router