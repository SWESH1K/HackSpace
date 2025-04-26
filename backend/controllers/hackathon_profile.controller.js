import HackathonProfile from "../models/hackathon_profile.model.js";
import { generateParticipantId, formatParticipantId } from "../utils/teamUtils.js";
import Team from "../models/team.model.js";
import axios from 'axios';
import getAuth0ManagementApiToken from '../utils/getAuth0ManagementApiToken.js';

// Register for a hackathon
export const register = async (req, res) => {
    try {
        const { event_id, user_id } = req.body;
        // Use user_id from request body or from auth session
        const userId = user_id || req.oidc.user.sub;

        // Check if user is already registered for this hackathon
        const existingProfile = await HackathonProfile.findOne({ user_id: userId, event_id });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "You are already registered for this hackathon"
            });
        }

        // Create new hackathon profile with formatted participant ID
        const profile = new HackathonProfile({
            participant_id: formatParticipantId(generateParticipantId()),
            user_id: userId,
            event_id
        });

        await profile.save();

        res.status(201).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Get user's hackathon profile with team information
export const getProfile = async (req, res) => {
    try {
        const { event_id } = req.params;
        const user_id = req.oidc.user.sub;

        const profile = await HackathonProfile.findOne({ user_id, event_id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Get team information if user is in a team
        let teamInfo = null;
        if (profile.team_id) {
            teamInfo = await Team.findById(profile.team_id)
                .select('-password') // Exclude sensitive information
                .lean(); // Convert to plain object
        }

        // Check if user has any pending team requests
        const pendingTeams = await Team.find({
            event_id,
            'accept_invites.pending': profile.participant_id
        }).select('team_id name team_lead').lean();

        res.status(200).json({
            success: true,
            data: {
                ...profile.toObject(),
                team: teamInfo,
                pendingRequests: pendingTeams
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Get all profiles for a hackathon
export const getEventProfiles = async (req, res) => {
    try {
        const { event_id } = req.params;

        const profiles = await HackathonProfile.find({ event_id })
            .populate({
                path: 'team_id',
                select: '-password' // Exclude sensitive information
            });

        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Get all registered participants for an event
export const getAvailableParticipants = async (req, res) => {
    try {
        const { event_id } = req.params;

        // Find all profiles for this event that are not in a team yet
        const availableProfiles = await HackathonProfile.find({
            // All hackathon profiles who are either not in a team or in a team
            // event_id,
            // team_id: null,  // Not in any team
            // waiting_list: false  // Not waiting to join any team
        });

        res.status(200).json({
            success: true,
            data: availableProfiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};