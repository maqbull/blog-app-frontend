import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: FC = () => {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/dashboard';

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithFacebook();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in with Facebook. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue to Blog App</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="social-buttons">
          <button 
            className="social-button google"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <img 
              src="/google-icon.svg" 
              alt="Google"
              className="social-icon"
            />
            Sign in with Google
          </button>

          <button 
            className="social-button facebook"
            onClick={handleFacebookLogin}
            disabled={isLoading}
          >
            <img 
              src="/facebook-icon.svg" 
              alt="Facebook"
              className="social-icon"
            />
            Sign in with Facebook
          </button>
        </div>

        {isLoading && (
          <div className="loading-spinner">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 