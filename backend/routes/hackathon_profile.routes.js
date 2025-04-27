import express from "express";
import { register, getProfile, getEventProfiles, getAvailableParticipants } from "../controllers/hackathon_profile.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/event/:event_id", getProfile);
router.get("/event/:event_id/profiles", getEventProfiles);
router.get("/event/:event_id/available", getAvailableParticipants);

export default router;