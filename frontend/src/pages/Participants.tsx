import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
}

const Participants = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [profiles, setProfiles] = useState<HackathonProfile[]>([]);
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/hackathon-profile/event/${eventId}/profiles`)
      .then(res => res.json())
      .then(async data => {
        if (data.success) {
          setProfiles(data.data);
          // Optionally fetch user info for each profile
          const userIds = data.data.map((p: HackathonProfile) => p.user_id);
          const userInfoMap: Record<string, UserInfo> = {};
          await Promise.all(userIds.map(async (uid: string) => {
            try {
              const res = await fetch(`/api/user/${uid}`);
              const userData = await res.json();
              userInfoMap[uid] = userData;
            } catch {}
          }));
          setUsers(userInfoMap);
        } else {
          setError(data.message || 'Failed to fetch participants');
        }
      })
      .catch(() => setError('Failed to fetch participants'))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registered Participants</h2>
      {profiles.length === 0 ? (
        <div>No participants registered yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
          {profiles.map(profile => (
            <li key={profile.participant_id} className="flex items-center gap-4 py-3">
              {users[profile.user_id]?.picture && (
                <img src={users[profile.user_id].picture} alt={users[profile.user_id].name} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                <div className="font-medium">{users[profile.user_id]?.name || profile.user_id}</div>
                <div className="text-xs text-gray-500 dark:text-zinc-400">Participant ID: {profile.participant_id}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Participants;