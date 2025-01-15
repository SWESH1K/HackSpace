import Event from "../models/event.model.js"

export const createEvent = async (req, res) => {
    const event = req.body

    const newEvent = new Event(event)

    try {
        await newEvent.save()
        res.status(201).json({success: true, data: newEvent})
    } catch(error) {

        if(error.name == "ValidationError") {
            res.status(400).json({success: false, message: error.message})
        }

        res.status(500).json({success: false, message: `Server Error: ${error}`})
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

export const deleteAllEvents = async(req, res) => {
    try {
        await Event.deleteMany()
        res.status(200).json({success: true, message: "All Events Deleted"})
    } catch(error) {
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}