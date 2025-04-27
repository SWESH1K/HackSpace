import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useParams } from 'react-router-dom';

interface HackathonProfile {
  participant_id: string;
  user_id: string;
  event_id: string;
  team_id?: string;
  is_team_lead?: boolean;
  waiting_list?: boolean;
}

const Registrations = () => {
  const user = useUser();
  const { id: eventId } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<HackathonProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch the current user's hackathon profile for this event
  const fetchProfile = async () => {
    if (!user?.sub || !eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hackathon-profile/event/${eventId}`);
      if (res.status === 404) {
        setProfile(null); // Not registered, show form
      } else if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
        setError('Failed to fetch registration status');
      }
    } catch (e) {
      setProfile(null);
      setError('Failed to fetch registration status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sub, eventId, success]);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/hackathon-profile/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }) // Do NOT send user_id
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Immediately re-fetch profile to update UI
        fetchProfile();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (e) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-zinc-400">Loading user information...</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-zinc-400">Checking registration status...</p>
      </div>
    </div>
  );

  if (profile) return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">You have Registered</h2>
        {/* <p className="text-green-600 dark:text-green-400 font-medium"></p> */}
        <p className="text-sm text-gray-500 dark:text-zinc-400">Participant ID: {profile.participant_id}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Register for Hackathon</h2>
          <p className="text-gray-600 dark:text-zinc-400">Join the event and start your journey!</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Registering...</span>
            </div>
          ) : (
            'Register Now'
          )}
        </button>

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">Registration successful!</p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-500">You can now join or create a team.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;