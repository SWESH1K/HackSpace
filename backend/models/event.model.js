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
import TeamSchema from "./team.model.js";
import RoundSchema from "./rounds.model.js";
import EventDetailsSchema from "./event_details.model.js";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    banner_url: {
        type: String,
        required: true
    },
    description: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        validate: {
            validator: function(v) {
                return this.participants_teams.length <= this.max_teams;
            },
            message: props => `Number of participant teams exceeds the maximum allowed`
        }
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
    }]
}, {
    timestamps: true
});

const Event = mongoose.model('Event', EventSchema);
export default Event;