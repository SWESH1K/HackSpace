import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user', { method: "GET" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  return user;
}