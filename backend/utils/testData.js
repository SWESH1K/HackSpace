import mongoose from 'mongoose';
import Event from '../models/event.model.js';
import HackathonProfile from '../models/hackathon_profile.model.js';
import Team from '../models/team.model.js';
import { formatParticipantId, formatTeamId, generateParticipantId, generateTeamId } from './teamUtils.js';

// Sample user IDs (Auth0 format)
const sampleUsers = [
    'auth0|user1',
    'auth0|user2',
    'auth0|user3',
    'auth0|user4',
    'auth0|user5',
    'auth0|user6',
    'auth0|user7',
    'auth0|user8'
];

// Sample event data
const sampleEvent = {
    title: "Test Hackathon 2025",
    banner_url: "https://example.com/banner.jpg",
    description: "A test hackathon for API testing",
    start_time: new Date("2025-05-01"),
    end_time: new Date("2025-05-03"),
    price_money: 10000,
    num_rounds: 3,
    max_team_size: 4,
    max_teams: 50,
    admin: 'auth0|admin1',
    judges: ['auth0|judge1', 'auth0|judge2']
};

// Function to create test data
export const createTestData = async () => {
    try {
        // Create test event
        const event = new Event(sampleEvent);
        await event.save();
        console.log('Created test event:', event._id);

        // Create hackathon profiles for users
        const profiles = [];
        for (const userId of sampleUsers) {
            const profile = new HackathonProfile({
                participant_id: formatParticipantId(generateParticipantId()),
                user_id: userId,
                event_id: event._id
            });
            await profile.save();
            profiles.push(profile);
            console.log('Created profile for user:', userId);
        }

        // Create two teams
        const team1 = new Team({
            team_id: formatTeamId(generateTeamId()),
            name: "Test Team Alpha",
            password: "test123",
            event_id: event._id,
            team_lead: profiles[0].participant_id,
            allow_invites: true,
            accept_invites: {
                accepted: [profiles[0].participant_id, profiles[1].participant_id],
                pending: [profiles[2].participant_id]
            }
        });
        await team1.save();

        // Update profiles for team 1 members
        profiles[0].team_id = team1._id;
        profiles[0].is_team_lead = true;
        await profiles[0].save();

        profiles[1].team_id = team1._id;
        await profiles[1].save();

        profiles[2].waiting_list = true;
        await profiles[2].save();

        const team2 = new Team({
            team_id: formatTeamId(generateTeamId()),
            name: "Test Team Beta",
            password: "test456",
            event_id: event._id,
            team_lead: profiles[3].participant_id,
            allow_invites: true,
            accept_invites: {
                accepted: [profiles[3].participant_id, profiles[4].participant_id],
                pending: []
            }
        });
        await team2.save();

        // Update profiles for team 2 members
        profiles[3].team_id = team2._id;
        profiles[3].is_team_lead = true;
        await profiles[3].save();

        profiles[4].team_id = team2._id;
        await profiles[4].save();

        console.log('Created test teams');
        
        return {
            event,
            profiles,
            teams: [team1, team2]
        };
    } catch (error) {
        console.error('Error creating test data:', error);
        throw error;
    }
};

// Function to clear test data
export const clearTestData = async () => {
    try {
        await Event.deleteMany({});
        await HackathonProfile.deleteMany({});
        await Team.deleteMany({});
        console.log('Cleared all test data');
    } catch (error) {
        console.error('Error clearing test data:', error);
        throw error;
    }
};