import { createTestData, clearTestData } from './testData.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testScenarios = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing test data
        await clearTestData();

        // Create fresh test data
        const { event, profiles, teams } = await createTestData();

        // Print test data for API testing
        console.log('\n=== Test Data for API Testing ===\n');
        
        console.log('Event ID:', event._id);
        console.log('\nTeam 1:', {
            team_id: teams[0].team_id,
            name: teams[0].name,
            password: teams[0].password,
            team_lead: teams[0].team_lead
        });
        
        console.log('\nTeam 2:', {
            team_id: teams[1].team_id,
            name: teams[1].name,
            password: teams[1].password,
            team_lead: teams[1].team_lead
        });

        console.log('\nTest Users:');
        profiles.forEach((profile, index) => {
            console.log(`\nUser ${index + 1}:`, {
                user_id: profile.user_id,
                participant_id: profile.participant_id,
                team_id: profile.team_id,
                is_team_lead: profile.is_team_lead,
                waiting_list: profile.waiting_list
            });
        });

        console.log('\n=== API Test Scenarios ===\n');

        console.log('1. Register for hackathon:');
        console.log('POST /api/hackathon-profile/register');
        console.log('Body:', {
            event_id: event._id
        });

        console.log('\n2. Create a new team:');
        console.log('POST /api/team/create');
        console.log('Body:', {
            event_id: event._id,
            name: "New Test Team",
            password: "test789"
        });

        console.log('\n3. Request to join Team 1:');
        console.log('POST /api/team/join');
        console.log('Body:', {
            team_id: teams[0].team_id,
            password: teams[0].password
        });

        console.log('\n4. Handle join request (as Team 1 lead):');
        console.log('POST /api/team/handle-request');
        console.log('Body:', {
            team_id: teams[0].team_id,
            participant_id: profiles[2].participant_id,
            accept: true
        });

        console.log('\n5. Get available teams:');
        console.log('GET /api/team/event/' + event._id + '/available');

        console.log('\n6. Get team details:');
        console.log('GET /api/team/' + teams[0].team_id);

        console.log('\n7. Leave team (as team member):');
        console.log('POST /api/team/' + teams[0].team_id + '/leave');

        console.log('\n8. Toggle team invites (as team lead):');
        console.log('POST /api/team/' + teams[0].team_id + '/toggle-invites');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Run test scenarios
testScenarios();