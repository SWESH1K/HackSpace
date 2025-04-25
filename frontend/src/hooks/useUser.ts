import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

export interface User {
  name: string;
  picture: string;
  sub: string;
  // Add other properties as needed
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user', { method: "GET" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => {
        console.error('Error fetching user data:', error);
        }
      );
  }, []);

  return user;
}