import express from "express";
import { createEventDetails, getEventDetails, updateEventDetails } from "../controllers/eventDetails.controller.js";

const eventDetailsRouter = express.Router();

eventDetailsRouter.post("/:id", createEventDetails); // Changed route
eventDetailsRouter.get("/:id", getEventDetails);
eventDetailsRouter.put("/:id", updateEventDetails);

export default eventDetailsRouter;