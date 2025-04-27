import { useEffect, useState } from 'react';
// import { useUser } from '@/hooks/useUser';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [open, setOpen] = useState(false);

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
      .then(async ([teamsData, profileData]) => {
        if (teamsData.success) {
          setTeams(teamsData.data);
          
          // Fetch user info for team leaders
          const userInfoMap: Record<string, UserInfo> = {};
          await Promise.all(teamsData.data.map(async (team: Team) => {
            try {
              // First get the hackathon profile to get the user_id
              const profileRes = await fetch(`/api/hackathon-profile/event/${eventId}/profiles`);
              const profileData = await profileRes.json();
              if (profileData.success) {
                const leaderProfile = profileData.data.find((p: any) => p.participant_id === team.team_lead);
                if (leaderProfile) {
                  const res = await fetch(`/api/user/${leaderProfile.user_id}`);
                  const userData = await res.json();
                  if (userData) {
                    userInfoMap[team.team_lead] = userData;
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching team leader data:', error);
            }
          }));
          setUsers(userInfoMap);
        } else {
          setError(teamsData.message || 'Failed to fetch teams');
        }
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
        {actionMsg && <div className="mb-2 text-blue-600">{actionMsg}</div>}
        {/* Pending requests section for team lead */}
        {teamDetails && profile.is_team_lead && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Pending Join Requests</h3>
            {teamDetails.pending_members && teamDetails.pending_members.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
                {teamDetails.pending_members.map((member: any) => {
                  const pendingUser = pendingUsers[member.participant_id];
                  return (
                    <li key={member.participant_id} className="flex items-center gap-4 py-2">
                      {pendingUser?.picture && (
                        <img src={pendingUser.picture} alt={pendingUser.name} className="w-8 h-8 rounded-full object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{pendingUser?.name || 'Loading...'}</div>
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
                  );
                })}
              </ul>
            ) : (
              <div className="text-gray-500">No pending requests.</div>
            )}
          </div>
        )}
      </div>
    );
  }
  console.log("All teams: ", teams);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Create Team Button with Dialog */}
      <div className="flex justify-center mb-12">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={!!profile?.team_id || !!profile?.waiting_list}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Team
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  className="w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Team'
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Message Display */}
      {actionMsg && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            {actionMsg}
          </div>
        </div>
      )}

      {/* Two Sections Layout */}
      <div className="space-y-12">
        {/* Current Team Section */}
        {profile?.team_id && teamDetails && (
          <section className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Team</h2>
            </div>
            <div className="p-6">
              {/* Existing team details table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  // ...existing team details table code...
                </table>
              </div>
            </div>
          </section>
        )}

        {/* All Teams Section */}
        <section className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Teams</h2>
          </div>
          <div className="p-6">
            {teams.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 dark:text-zinc-400">No teams available yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                  <thead className="bg-gray-50 dark:bg-zinc-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Team Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Members</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Team Lead</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                    {teams.map(team => {
                      const teamLeader = users[team.team_lead];
                      return (
                        <tr key={team.team_id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-zinc-400">
                              {team.accept_invites.accepted.length} / 4
                              <span className="ml-1 text-xs text-gray-400">members</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {teamLeader?.picture && (
                                <img src={teamLeader.picture} alt="" className="h-6 w-6 rounded-full mr-2" />
                              )}
                              <div className="text-sm text-gray-900 dark:text-white">{teamLeader?.name || 'Loading...'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              team.allow_invites 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {team.allow_invites ? 'Open' : 'Closed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleJoin(team.team_id, team.event_id)}
                              disabled={!!profile?.waiting_list || !!profile?.team_id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Join Team
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllTeams;