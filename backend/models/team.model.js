import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lead: {
        type: String,
        ref: 'Lead',
        required: true,
    },
    members: [{
        type: String,
        ref: 'Member',
        required: true,
        default: []
    }],
    marks: [{
        type: Number,
        default: 0
    }],
}, {timestamps: true});

export default TeamSchema;