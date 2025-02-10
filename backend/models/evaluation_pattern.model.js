import mongoose from "mongoose";

const EvaluationPatternSchema = new mongoose.Schema({
    pattern: [{
        name: {
            type: String,
            required: true
        },
        max_marks: {
            type: Number,
            required: true
        }
    }],
}, {timestamps: true});

export default EvaluationPatternSchema;