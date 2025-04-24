import mongoose from "mongoose";

const EventDetailsSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        unique: true // Ensures only one EventDetails document per event
    },
    problem_statements: {
        type: Object, // JSON structure for rich text content
        required: true,
        default: {
            type: "doc",
            content: []
        }
    },
    rules_and_regulations: {
        type: Object, // JSON structure for rich text content
        required: true,
        default: {
            type: "doc",
            content: []
        }
    }
}, {
    timestamps: true
});

const EventDetails = mongoose.model('EventDetails', EventDetailsSchema);
export default EventDetails;