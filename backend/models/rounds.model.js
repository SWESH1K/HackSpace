import mongoose from "mongoose"
import EvaluationPatternSchema from "./evaluation_pattern.model.js";

const RoundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    evaluation_pattern: {
        type: EvaluationPatternSchema,
        required: true
    },
    max_marks: {
        type: Number,
        required: true,
        default: function() {
            return this.evaluation_pattern.pattern.reduce((sum, item) => sum + item.max_marks, 0);
        }
    },
}, {timestamps: true});

export default RoundSchema