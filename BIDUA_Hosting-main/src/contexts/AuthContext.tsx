import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, User, getUserProfile } from '../lib/auth';
import api from '../lib/api';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
  referral_code?: string;
  referred_by?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Use current user data as profile - /auth/me returns full user info
          setProfile(currentUser as any);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authSignIn(email, password);
    if (error) throw error;
    
    if (data && data.user) {
      setUser(data.user as User);
      setProfile(data.user as any);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    const username = email.split('@')[0]; // Generate username from email
    const { data, error } = await authSignUp(email, password, username, fullName, referralCode);
    if (error) throw error;

    // Set user data after successful registration
    if (data && data.user) {
      setUser(data.user as User);
      setProfile(data.user as any);

      // Store the access token
      if (data.access_token) {
        api.setToken(data.access_token);
      }
    }

    return data;
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, isAdmin, isSuperAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

