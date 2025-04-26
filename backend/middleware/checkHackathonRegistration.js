import HackathonProfile from "../models/hackathon_profile.model.js";

export const checkHackathonRegistration = async (req, res, next) => {
    try {
        // Get event_id from body or params
        const event_id = req.body.event_id || req.params.event_id;
        const user_id = req.oidc.user.sub;

        if (!event_id) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        // Check if user is registered for this hackathon
        const profile = await HackathonProfile.findOne({ user_id, event_id });
        
        if (!profile) {
            return res.status(403).json({
                success: false,
                message: "You must register for the hackathon first",
                requiresRegistration: true
            });
        }

        // Add profile to request object for use in next middleware/controller
        req.hackathonProfile = profile;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};