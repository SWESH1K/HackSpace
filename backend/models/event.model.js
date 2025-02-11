/*
    Event model:
    1, Hackathon Title - String
    2, Hackathon Banner Image URL - String
    3, Hackathon Start Time --> End Time - Date & Time Field
    4, Problem Statements - Array of Strings
    5, Number of Rounds - Number
    6, All Rounds - [Round Object] of length = Number of Rounds
    7, Max Team Size - Number 
    8, Max Teams - Number 
    9, Participants Teams - Array of Teams Model Objects
    10, Admin - Auto Field
    11, Judges - List of Users - default: Empty
    12, Last Updated - Auto Field

    Rounds Model:
    1, Round Name - String
    2, Round Time - Date & Time Field
    3, Evaluation Pattern - Object of Evaluation Pattern Model
    4, MaxMarks - Auto Field (Sum of all marks in Evaluation Pattern)
    5, Last Updated - Auto Field

    Evaluation Pattern Model:
    1, Pattern - [{Name: MaxMarks}]
    2, Last Updated - Auto Field

    Team Model:
    1, Team Name - String
    2, Team Password - String
    4, Team Lead - Auto Field
    5, Team Members - Array of Users
    6, Team Marks - Array of length=Num of Rounds
    7, Last Updated - Auto Field
*/

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

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    banner_url: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    price_money: {
        type: Number,
        required: true
    },
    num_rounds: {
        type: Number,
        required: true
    },
    rounds: {
        type: [RoundSchema],
        validate: {
            validator: function(v) {
                return v.length === this.num_rounds;
            },
            message: props => `Number of rounds (${props.value.length}) does not match num_rounds (${this.num_rounds})`
        }
    },
    max_team_size: {
        type: Number,
        required: true
    },
    max_teams: {
        type: Number,
        required: true
    },
    participants_teams: [{
        type: TeamSchema,
        ref: 'Teams',
        required: true,
        validate: {
            validator: function(v) {
                return v.length <= this.maxTeams;
            },
            message: props => `Number of participant teams (${props.value.length}) exceeds the maximum allowed (${this.maxTeams})`
        },
        default: []
    }],
    admin: {
        type: String,
        ref: 'Admin',
        required: true
    },
    judges: [{
        type: String,
        ref: 'Judges',
        default: []
    }],
    overview: {
        type: String, // Markdown content
        default: ""
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

export default Event = new mongoose.model('Event', EventSchema)