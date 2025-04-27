import mongoose from "mongoose";

const HackathonProfileSchema = new mongoose.Schema({
    participant_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    team_id: {
        type: String,
        ref: 'Team',
        default: null
    },
    is_team_lead: {
        type: Boolean,
        default: false
    },
    waiting_list: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound index to ensure a user can only register once per hackathon
HackathonProfileSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

const HackathonProfile = mongoose.model('HackathonProfile', HackathonProfileSchema);
export default HackathonProfile;