import Event from "../models/event.model.js"

export const checkEventId = async (req, res, next) => {
    const { id } = req.params

    try {
        const currEvent = await Event.findById(id)
        if (!currEvent) {
            return res.status(404).json({ success: false, message: "Event not found" })
        }
        req.event = currEvent
        next()
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error}` })
    }
}