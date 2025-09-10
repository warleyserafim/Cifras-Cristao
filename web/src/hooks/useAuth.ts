
import { useState, useEffect } from 'react';

interface User {
  id: string;
  role: string;
}

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setToken(null);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
    }
  }, []);

  return { isLoggedIn, user, token };
};

export default useAuth;
