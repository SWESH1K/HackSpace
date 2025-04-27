import Team from "../models/team.model.js";
import HackathonProfile from "../models/hackathon_profile.model.js";
import Event from "../models/event.model.js";
import { generateTeamId, formatTeamId } from "../utils/teamUtils.js";

// Create a new team
export const createTeam = async (req, res) => {
    try {
        const { event_id, name, user_id } = req.body;
        // Use user_id from request body or from auth session
        const userId = user_id || req.oidc.user.sub;

        // Get user's hackathon profile
        const profile = await HackathonProfile.findOne({ user_id: userId, event_id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "You must register for the hackathon first",
                requiresRegistration: true
            });
        }

        // Check if user is already in a team
        if (profile.team_id) {
            return res.status(400).json({
                success: false,
                message: "You are already part of a team"
            });
        }

        // Check if team name is already taken in this event
        const existingTeam = await Team.findOne({ name, event_id });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: "Team name is already taken"
            });
        }

        // Create new team
        const team = new Team({
            team_id: formatTeamId(generateTeamId()),
            name,
            event_id,
            team_lead: profile.participant_id,
            accept_invites: {
                accepted: [profile.participant_id],
                pending: []
            }
        });

        await team.save();

        // Update user's profile
        profile.team_id = team.team_id;
        profile.is_team_lead = true;
        await profile.save();

        res.status(201).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Request to join a team
export const requestToJoinTeam = async (req, res) => {
    try {
        const { team_id } = req.body;
        const user_id = req.oidc.user.sub;

        // Get the team
        const team = await Team.findOne({ "team_id": team_id });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        } else {
            console.log("Team found:", team);
        }

        // Check if team is accepting invites
        if (!team.allow_invites) {
            return res.status(400).json({
                success: false,
                message: "This team is not accepting new members"
            });
        }

        // Get user's hackathon profile
        const profile = await HackathonProfile.findOne({ 
            user_id, 
            event_id: team.event_id 
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "You must register for the hackathon first"
            });
        }

        // Check if user is already in a team
        if (profile.team_id) {
            return res.status(400).json({
                success: false,
                message: "You are already part of a team"
            });
        }

        // Check if user has any pending requests
        if (profile.waiting_list) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending team request"
            });
        }

        // Check if team has room for more members
        const event = await Event.findById(team.event_id);
        if (team.accept_invites.accepted.length >= event.max_team_size) {
            return res.status(400).json({
                success: false,
                message: "Team is at maximum capacity"
            });
        }

        // Add user to team's pending list
        if (!team.accept_invites.pending.includes(profile.participant_id)) {
            team.accept_invites.pending.push(profile.participant_id);
            await team.save();
        }

        // Update user's profile
        profile.waiting_list = true;
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Join request sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Accept/reject team join request
export const handleJoinRequest = async (req, res) => {
    try {
        const { team_id, participant_id, accept } = req.body;
        const user_id = req.oidc.user.sub;

        // Get the team
        const team = await Team.findOne({ team_id });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Verify user is team lead
        const teamLead = await HackathonProfile.findOne({ 
            user_id, 
            participant_id: team.team_lead 
        });
        if (!teamLead) {
            return res.status(403).json({
                success: false,
                message: "Only team lead can handle join requests"
            });
        }

        // Get the requesting user's profile
        const requestingProfile = await HackathonProfile.findOne({ participant_id });
        if (!requestingProfile) {
            return res.status(404).json({
                success: false,
                message: "Requesting user not found"
            });
        }

        // Check team size limit
        const event = await Event.findById(team.event_id);
        if (accept && team.accept_invites.accepted.length >= event.max_team_size) {
            return res.status(400).json({
                success: false,
                message: "Team is already at maximum capacity"
            });
        }

        // Remove from pending list
        team.accept_invites.pending = team.accept_invites.pending.filter(
            id => id !== participant_id
        );

        if (accept) {
            // Add to accepted list
            team.accept_invites.accepted.push(participant_id);
            
            // Update requesting user's profile
            requestingProfile.team_id = team._id;
            requestingProfile.waiting_list = false;
            await requestingProfile.save();
        } else {
            // Just remove the waiting status
            requestingProfile.waiting_list = false;
            await requestingProfile.save();
        }

        await team.save();

        res.status(200).json({
            success: true,
            message: accept ? "User added to team" : "Request rejected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Leave team
export const leaveTeam = async (req, res) => {
    try {
        const { team_id } = req.params;
        const user_id = req.oidc.user.sub;

        // Get the team
        const team = await Team.findOne({ team_id });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Get user's profile
        const profile = await HackathonProfile.findOne({ 
            user_id, 
            event_id: team.event_id 
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Check if user is in the team
        if (!team.accept_invites.accepted.includes(profile.participant_id)) {
            return res.status(400).json({
                success: false,
                message: "You are not a member of this team"
            });
        }

        // Check if user is team lead
        if (team.team_lead === profile.participant_id) {
            return res.status(400).json({
                success: false,
                message: "Team lead cannot leave the team. Transfer leadership or delete the team instead."
            });
        }

        // Remove user from team
        team.accept_invites.accepted = team.accept_invites.accepted.filter(
            id => id !== profile.participant_id
        );
        await team.save();

        // Update user's profile
        profile.team_id = null;
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Successfully left the team"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Get team details
export const getTeamDetails = async (req, res) => {
    try {
        const { team_id } = req.params;

        const team = await Team.findOne({ team_id })
            .populate('event_id', 'title max_team_size');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Get member details
        const memberProfiles = await HackathonProfile.find({
            participant_id: { $in: team.accept_invites.accepted }
        });

        const pendingProfiles = await HackathonProfile.find({
            participant_id: { $in: team.accept_invites.pending }
        });

        res.status(200).json({
            success: true,
            data: {
                ...team.toObject(),
                members: memberProfiles,
                pending_members: pendingProfiles
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Get available teams for an event
export const getAvailableTeams = async (req, res) => {
    try {
        const { event_id } = req.params;
        
        const teams = await Team.find({ 
            event_id,
            allow_invites: true
        });

        res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};

// Toggle team invite status
export const toggleTeamInvites = async (req, res) => {
    try {
        const { team_id } = req.params;
        const user_id = req.oidc.user.sub;

        const team = await Team.findOne({ team_id });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Verify user is team lead
        const teamLead = await HackathonProfile.findOne({ 
            user_id, 
            participant_id: team.team_lead 
        });
        if (!teamLead) {
            return res.status(403).json({
                success: false,
                message: "Only team lead can modify team settings"
            });
        }

        team.allow_invites = !team.allow_invites;
        await team.save();

        res.status(200).json({
            success: true,
            data: team,
            message: `Team is now ${team.allow_invites ? 'accepting' : 'not accepting'} new members`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
};