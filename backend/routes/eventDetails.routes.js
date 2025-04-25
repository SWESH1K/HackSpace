import express from "express";
import { createEventDetails, getEventDetails, updateEventDetails, updateProblemStatement, updateRulesRegulations } from "../controllers/eventDetails.controller.js";

const eventDetailsRouter = express.Router();

eventDetailsRouter.post("/:id", createEventDetails); // Changed route
eventDetailsRouter.get("/:id", getEventDetails);
eventDetailsRouter.put("/:id", updateEventDetails);
eventDetailsRouter.patch("/:id/problem-statement", updateProblemStatement); // New route for updating problem statement
eventDetailsRouter.patch("/:id/rules-regulations", updateRulesRegulations); // New route for updating rules and regulations

export default eventDetailsRouter;