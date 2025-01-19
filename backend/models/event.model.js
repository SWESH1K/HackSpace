/*
    Event model:
    1, Hackathon Title - String
    2, Hackathon Banner Image URL - String
    3, Hackathon Start Time --> End Time - Date & Time Field
    4, Problem Statements - Array of Strings
    5, Number of Rounds - Number
    6, Max Team Size - Number 
    7, Max Teams - Number 
    8, Participants Teams - Array of Teams Model Objects
    9, Organiser - Auto Field
    10, Last Updated - Auto Field

    Rounds Model:
    1, Round Name - String
    2, Round Time - Date & Time Field
    3, Max Marks - Number

    Team Model:
    1, Team Name - String
    2, Team Members - Array of Users
    3, Team Marks - Array of length=Num of Rounds
*/

import mongoose from "mongoose";

const RoundSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: false
    },
    name: {
        type: String,
        required: true
    },
    max_marks: {
        type: Number,
        required: true
    }
})

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price_money: {
        type: Number,
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
    num_rounds: {
        type: Number,
        required: true
    },
    rounds: {
        type: [RoundSchema],
        default: [],
        validate: [
            {
                validator: function (rounds) {
                    const roundNumbers = rounds.map(round => round.number);
                    return new Set(roundNumbers).size === roundNumbers.length;
                },
                message: 'Round numbers must be unique within an event'
            },
            {
                validator: function (rounds) {
                    return rounds.length <= this.num_rounds;
                },
                message: 'Number of rounds exceeds the specified num_rounds'
            }
        ],
        unique: false
    },
    organiser: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default Event = new mongoose.model('Event', EventSchema)