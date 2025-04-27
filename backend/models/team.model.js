import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    team_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    team_lead: {
        type: String, // participant_id of the team lead
        required: true,
        ref: 'HackathonProfile'
    },
    allow_invites: {
        type: Boolean,
        default: true
    },
    accept_invites: {
        accepted: [{
            type: String, // participant_ids of accepted members
            ref: 'HackathonProfile'
        }],
        pending: [{
            type: String, // participant_ids of pending members
            ref: 'HackathonProfile'
        }]
    },
    marks: [{
        type: Number,
        default: 0
    }]
}, { timestamps: true });

// Compound index to ensure unique team names within an event
TeamSchema.index({ name: 1, event_id: 1 }, { unique: true });

const Team = mongoose.model('Team', TeamSchema);
export default Team;