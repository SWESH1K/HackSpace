import mongoose from "mongoose";

const EventDetailsSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        unique: true // Ensures only one EventDetails document per event
    },
    problem_statements: {
        type: String, // Markdown content
        default: ""
    },
    rules_and_regulations: {
        type: String, // Markdown content
        default: ""
    }
}, {
    timestamps: true
});

const EventDetails = mongoose.model('EventDetails', EventDetailsSchema);
export default EventDetails;
