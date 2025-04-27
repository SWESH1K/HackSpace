import { useEffect, useState } from 'react';
// import { useUser } from '@/hooks/useUser';
import { useParams } from 'react-router-dom';

interface Team {
  _id: string;
  team_id: string;
  name: string;
  event_id: {
    _id: string;
    title: string;
    max_team_size: number;
  };
  team_lead: string;
  allow_invites: boolean;
  accept_invites: {
    accepted: string[];
    pending: string[];
  };
  members?: any[];
  pending_members?: any[];
}

interface HackathonProfile {
  participant_id: string;
  user_id: string;
  event_id: string;
  team_id?: string;
  is_team_lead?: boolean;
  waiting_list?: boolean;
}

interface UserInfo {
  name: string;
  picture: string;
  sub: string;
  email?: string;
}

// interface TeamMemberData {
//   participant_id: string;
//   user_id: string;
// }

interface TeamMemberInfo extends UserInfo {
  participant_id: string;
}

const AllTeams = () => {
  // const user = useUser();
  const { id: eventId } = useParams<{ id: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [profile, setProfile] = useState<HackathonProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [teamDetails, setTeamDetails] = useState<Team | null>(null);
  const [pendingUsers, setPendingUsers] = useState<Record<string, TeamMemberInfo>>({});
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMemberInfo>>({});

  // Fetch teams and user profile
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/team/event/${eventId}/available`).then(res => res.json()),
      fetch(`/api/hackathon-profile/event/${eventId}`).then(async res => {
        if (res.status === 404) return null;
        const data = await res.json();
        return data.success ? data.data : null;
      })
    ])
      .then(([teamsData, profileData]) => {
        if (teamsData.success) setTeams(teamsData.data);
        else setError(teamsData.message || 'Failed to fetch teams');
        setProfile(profileData);
      })
      .catch(() => setError('Failed to fetch teams or profile'))
      .finally(() => setLoading(false));
  }, [eventId, actionMsg]);

  // Fetch team details if user is in a team
  useEffect(() => {
    if (profile && profile.team_id) {
      console.log("Team ID from profile", profile);
      let teamIdString: string | undefined = undefined;
      if (typeof profile.team_id === 'object' && profile.team_id !== null && 'team_id' in profile.team_id) {
        teamIdString = (profile.team_id as { team_id: string }).team_id;
        console.log("if");
      } else if (typeof profile.team_id === 'string') {
        teamIdString = profile.team_id;
        console.log("else ");
      }

      const fetchTeamData = async (teamId: string) => {
        console.log('Fetching team data for ID:', teamId);
        try {
          // Get team data
          const res = await fetch(`/api/team/${teamId}`);
          const data = await res.json();
          
          if (data.success && data.data) {
            const teamData = data.data;
            setTeamDetails(teamData);
            
            // First, fetch all profiles for the event using the correct event_id
            const profileRes = await fetch(`/api/hackathon-profile/event/${teamData.event_id._id}/profiles`);
            const profileData = await profileRes.json();
            const allProfiles = profileData.success ? profileData.data : [];
            
            // Create maps for both active and pending members
            const userInfoMap: Record<string, TeamMemberInfo> = {};
            const pendingInfoMap: Record<string, TeamMemberInfo> = {};
            
            // Process active members
            await Promise.all((teamData.members || []).map(async (member: any) => {
              try {
                const memberProfile = allProfiles.find((p: any) => p.participant_id === member.participant_id);
                if (memberProfile) {
                  const res = await fetch(`/api/user/${memberProfile.user_id}`);
                  const userData = await res.json();
                  if (userData) {
                    userInfoMap[member.participant_id] = {
                      ...userData,
                      participant_id: member.participant_id
                    };
                  }
                }
              } catch (error) {
                console.error('Error fetching member data:', error);
              }
            }));

            // Process pending members
            await Promise.all((teamData.pending_members || []).map(async (member: any) => {
              try {
                const memberProfile = allProfiles.find((p: any) => p.participant_id === member.participant_id);
                if (memberProfile) {
                  const res = await fetch(`/api/user/${memberProfile.user_id}`);
                  const userData = await res.json();
                  if (userData) {
                    pendingInfoMap[member.participant_id] = {
                      ...userData,
                      participant_id: member.participant_id
                    };
                  }
                }
              } catch (error) {
                console.error('Error fetching pending member data:', error);
              }
            }));
            
            setTeamMembers(userInfoMap);
            setPendingUsers(pendingInfoMap);
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      };

      if (teamIdString) {
        fetchTeamData(teamIdString);
      }
    }
  }, [profile]);

  // Join a team
  const handleJoin = async (team_id: string, event_id: any) => {
    setActionMsg(null);
    setLoading(true);
    // console.log('Joining team:', team);
    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id, event_id })
      });
      const data = await res.json();
      setActionMsg(data.message || (data.success ? 'Join request sent!' : 'Failed to join team'));
    } catch {
      setActionMsg('Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  // Create a team
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, name: teamName }) 
      });
      const data = await res.json();
      setActionMsg(data.message || (data.success ? 'Team created!' : 'Failed to create team'));
      if (data.success) {
        setTeamName('');
      }
    } catch {
      setActionMsg('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  // Accept/Reject join request
  const handleRequest = async (participant_id: string, accept: boolean) => {
    if (!teamDetails) return;
    setActionMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/team/handle-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: teamDetails.team_id, 
          participant_id, 
          accept, 
          event_id: teamDetails.event_id._id // Using _id from the event_id object
        })
      });
      const data = await res.json();
      setActionMsg(data.message || (data.success ? 'Request handled!' : 'Failed to handle request'));
      
      // Refresh team details
      const teamRes = await fetch(`/api/team/${teamDetails.team_id}`);
      const teamData = await teamRes.json();
      if (teamData.success && teamData.data) {
        setTeamDetails(teamData.data);
        
        // Get all profiles for the event to match with pending members
        const profileRes = await fetch(`/api/hackathon-profile/event/${teamData.data.event_id._id}/profiles`);
        const profileData = await profileRes.json();
        const allProfiles = profileData.success ? profileData.data : [];
        
        // Update pending users info
        const pendingInfoMap: Record<string, TeamMemberInfo> = {};
        await Promise.all((teamData.data.pending_members || []).map(async (member: any) => {
          try {
            const memberProfile = allProfiles.find((p: any) => p.participant_id === member.participant_id);
            if (memberProfile) {
              const res = await fetch(`/api/user/${memberProfile.user_id}`);
              const userData = await res.json();
              if (userData) {
                pendingInfoMap[member.participant_id] = {
                  ...userData,
                  participant_id: member.participant_id
                };
              }
            }
          } catch (error) {
            console.error('Error fetching pending member data:', error);
          }
        }));
        setPendingUsers(pendingInfoMap);
      }
    } catch {
      setActionMsg('Failed to handle request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // If user is already in a team
  if (profile && profile.team_id) {
    console.log(`Team Created: ${profile.team_id}`);
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
        {teamDetails && (
          <>
            <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Team Name: {teamDetails.name}</h2>
              {/* <h3 className="text-lg font-semibold mb-2">{teamDetails.name}</h3> */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  <thead className="bg-gray-50 dark:bg-zinc-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        Team Member
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        Participant ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                    {teamDetails.members?.map((member: any) => {
                      const memberInfo = teamMembers[member.participant_id];
                      return (
                        <tr key={member.participant_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              {memberInfo?.picture && (
                                <img 
                                  src={memberInfo.picture} 
                                  alt={memberInfo.name} 
                                  className="w-10 h-10 rounded-full object-cover" 
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {memberInfo?.name || 'Loading...'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-zinc-400">
                                  {memberInfo?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                            {member.participant_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              member.participant_id === teamDetails.team_lead 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {member.participant_id === teamDetails.team_lead ? 'Team Lead' : 'Member'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        <div className="mb-4">You are already a member of a team.</div>
        {actionMsg && <div className="mb-2 text-blue-600">{actionMsg}</div>}
        {/* Pending requests section for team lead */}
        {teamDetails && profile.is_team_lead && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Pending Join Requests</h3>
            {teamDetails.pending_members && teamDetails.pending_members.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
                {teamDetails.pending_members.map((member: any) => (
                  <li key={member.participant_id} className="flex items-center gap-4 py-2">
                    {pendingUsers[member.user_id]?.picture && (
                      <img src={pendingUsers[member.user_id].picture} alt={pendingUsers[member.user_id].name} className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{pendingUsers[member.user_id]?.name || member.user_id}</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">Participant ID: {member.participant_id}</div>
                    </div>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                      onClick={() => handleRequest(member.participant_id, true)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleRequest(member.participant_id, false)}
                    >
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No pending requests.</div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Teams</h2>
      {actionMsg && <div className="mb-2 text-blue-600">{actionMsg}</div>}
      <ul className="divide-y divide-gray-200 dark:divide-zinc-700 mb-8">
        {teams.length === 0 ? (
          <li>No teams available yet.</li>
        ) : (
          teams.map(team => (
            <li key={team.team_id} className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-2">
              <div>
                <span className="font-semibold">{team.name}</span>
                <span className="ml-2 text-xs text-gray-500">({team.allow_invites ? 'Open' : 'Closed'})</span>
                <span className="ml-2 text-xs text-gray-500">Members: {team.accept_invites.accepted.length}</span>
              </div>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => {
                  handleJoin(team.team_id, team.event_id);
                  console.log("The Team: ", team.event_id);
                }}
                disabled={!!profile?.waiting_list || !!profile?.team_id}
              >
                Join Team
              </button>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={handleCreate} className="space-y-4">
        <h3 className="font-semibold">Create a New Team</h3>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded text-black"
          placeholder="Team Name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={!!profile?.waiting_list || !!profile?.team_id || loading}
        >
          Create Team
        </button>
      </form>
    </div>
  );
};

export default AllTeams;