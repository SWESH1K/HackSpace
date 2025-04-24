import EventDetails from "../models/event_details.model.js";
import Event from "../models/event.model.js";

export const createEventDetails = async (req, res) => {
    try {
        const { id: eventId } = req.params; // Get eventId from URL params
        const { problem_statements, rules_and_regulations } = req.body; // Get other fields from body

        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: `Event with id ${eventId} not found` });
        }

        // Check if event details already exist for this event
        const existingEventDetails = await EventDetails.findOne({ event: eventId });
        if (existingEventDetails) {
            return res.status(400).json({ success: false, message: `Event details already exist for event with id ${eventId}` });
        }

        const eventDetails = new EventDetails({
            event: eventId,
            problem_statements: problem_statements,
            rules_and_regulations: rules_and_regulations
        });

        const newEventDetails = await eventDetails.save();
        res.status(201).json({ success: true, data: newEventDetails });

    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
};

export const getEventDetails = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        if (!eventId) { // Changed validation here
            return res.status(404).json({ success: false, message: `Event ID is required` });
        }
        
        const eventDetails = await EventDetails.findOne({ event: eventId });

        if (!eventDetails) {
            return res.status(404).json({ success: false, message: `Event details not found for event with id ${eventId}` });
        }

        res.status(200).json({ success: true, data: eventDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
};

export const updateEventDetails = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const eventDetails = await EventDetails.findOneAndUpdate({ event: eventId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!eventDetails) {
            return res.status(404).json({ success: false, message: `Event details not found for event with id ${eventId}` });
        }

        res.status(200).json({ success: true, data: eventDetails });
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
};

export const updateProblemStatement = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { problem_statements } = req.body;

        if (!problem_statements) {
            return res.status(400).json({ success: false, message: "Problem statement is required" });
        }

        const updatedEventDetails = await EventDetails.findOneAndUpdate(
            { event: eventId },
            { problem_statements },
            { new: true, runValidators: true }
        );

        if (!updatedEventDetails) {
            return res.status(404).json({ success: false, message: `Event details not found for event with id ${eventId}` });
        }

        res.status(200).json({ success: true, data: updatedEventDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
};