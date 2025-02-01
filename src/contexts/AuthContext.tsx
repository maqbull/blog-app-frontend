import { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.validateToken();
        setUser(response.user);
      } catch (error) {
        // If token validation fails, clear the stored data
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const handleAuthResponse = (response: { access_token: string; user: User }) => {
    localStorage.setItem('jwt_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const signInWithGoogle = async () => {
    try {
      await loadGoogleScript();
      const auth2 = await window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.access_token) {
            const authResponse = await authService.loginWithGoogle(response.access_token);
            handleAuthResponse(authResponse);
          }
        },
      });
      
      auth2.requestAccessToken();
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      await loadFacebookScript();
      window.FB.login(async (response: any) => {
        if (response.authResponse) {
          const authResponse = await authService.loginWithFacebook(response.authResponse.accessToken);
          handleAuthResponse(authResponse);
        }
      }, { scope: 'email,public_profile' });
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.querySelector('script#google-sdk')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

const loadFacebookScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.querySelector('script#facebook-sdk')) {
      resolve();
      return;
    }
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v16.0'
      });
    };
    const script = document.createElement('script');
    script.id = 'facebook-sdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export default AuthProvider; 