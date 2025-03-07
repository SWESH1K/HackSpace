import Event from "../models/event.model.js"
import EventDetails from "../models/event_details.model.js"

export const createEvent = async (req, res) => {

    // Ensure the user is authenticated and has a valid user ID
    // if (!req.oidc || !req.oidc.user || !req.oidc.user.sub) {
    //     return res.status(401).json({ success: false, message: "User not authenticated" });
    // }

    // console.log(`User: ${req.oidc.user.sub}`)

    const event = new Event({
        ...req.body,
        admin: req.body.admin || req.oidc.user.sub // Assuming the user ID is available in req.oidc.user.sub
    });

    // const event = new Event(req.body)

    try {
        const existingEvent = await Event.findOne({ title: event.title })
        if (existingEvent) {
            return res.status(400).json({ success: false, message: `Event with title "${event.title}" already exists` })
        }

        const newEvent = new Event(event)
        await newEvent.save()

        const eventDetails = new EventDetails({
            event: newEvent._id,
            problem_statements: "No problem statements available.",
            rules_and_regulations: "No rules and instructions available."
        });
        await eventDetails.save();

        res.status(201).json({success: true, data: newEvent})
    } catch(error) {

        if(error.name == "ValidationError") res.status(400).json({success: false, message: error.message})
        else res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}

export const getEvents = async(req, res) => {

    try {
        const allEvents = await Event.find({})
        res.status(200).json({success: true, data: allEvents})
    } catch(error) {
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}

export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: `Event with id ${id} not found` });
        }

        // Fetch event details
        const eventDetails = await EventDetails.findOne({ event: id });

        // Combine event and event details data
        const eventData = {
            ...event.toObject(),
            problem_statements: eventDetails.problem_statements,
            rules_and_regulations: eventDetails.rules_and_regulations
        };

        res.status(200).json({ success: true, data: [eventData] }); // Wrap in array to match existing structure
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
};

export const getMyEvents = async(req, res) => {
    try {
        const userId = req.oidc.user.sub;
        const events = await Event.find({ admin: userId });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
}

export const updateEvent = async(req, res) => {
    const { id } = req.params
    const event = req.body

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, event, {new: true, runValidators: true})
        if (!updatedEvent) {
            res.status(404).json({success: false, message: `Event with id ${id} not found`})
        }

        res.status(200).json({success: true, data: updatedEvent})
    } catch(error) {
        if(error.name == "ValidationError") {
            res.status(400).json({success: false, message: error.message})
        }
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}

export const deleteEvent = async(req, res) => {
    const { id } = req.params
    
    try {
        await Event.findByIdAndDelete(id)
        res.status(200).json({success: true, message: "Event deleted successfully!"})
    } catch(error) {
        if(error.name == "ValidationError") {
            res.status(400).json({success: false, message: error.message})
        }
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}

export const deleteAllEvents = async(req, res) => {
    try {
        await Event.deleteMany()
        res.status(200).json({success: true, message: "All Events Deleted"})
    } catch(error) {
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}