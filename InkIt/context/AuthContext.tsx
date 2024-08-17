import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  fetchSession: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  fetchSession: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const response = await fetch('http://192.168.1.51:5000/check_session', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch current user');
        router.push('/SignIn');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);