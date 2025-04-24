import express from "express";
import { createEventDetails, getEventDetails, updateEventDetails, updateProblemStatement } from "../controllers/eventDetails.controller.js";

const eventDetailsRouter = express.Router();

eventDetailsRouter.post("/:id", createEventDetails); // Changed route
eventDetailsRouter.get("/:id", getEventDetails);
eventDetailsRouter.put("/:id", updateEventDetails);
eventDetailsRouter.patch("/:id/problem-statement", updateProblemStatement); // New route for updating problem statement

export default eventDetailsRouter;