import { useEffect, useState } from 'react';

export interface User {
  name: string;
  picture: string;
  // Add other properties as needed
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user', { method: "GET" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  return user;
}