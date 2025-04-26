import express from "express";
import { 
    createTeam, 
    requestToJoinTeam, 
    handleJoinRequest,
    leaveTeam,
    getTeamDetails,
    getAvailableTeams,
    toggleTeamInvites
} from "../controllers/team.controller.js";
import { checkHackathonRegistration } from "../middleware/checkHackathonRegistration.js";

const router = express.Router();

// Team creation and joining (requires hackathon registration)
router.post("/create", checkHackathonRegistration, createTeam);
router.post("/join", checkHackathonRegistration, requestToJoinTeam);

// Team management (some operations require registration check)
router.post("/handle-request", checkHackathonRegistration, handleJoinRequest);
router.get("/event/:event_id/available", getAvailableTeams);
router.get("/:team_id", getTeamDetails);
router.post("/:team_id/leave", checkHackathonRegistration, leaveTeam);
router.post("/:team_id/toggle-invites", checkHackathonRegistration, toggleTeamInvites);

export default router;