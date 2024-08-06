import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import PasswordReset from '../components/PasswordReset';
import ErrorMessage from '../components/ErrorMessage';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { getFirebaseErrorMessage } from '../utils/firebaseErrorHandler';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(Date.now());
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/profile?prompt=complete');
  };

  useEffect(() => {
    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (loginAttempts >= 3 && Date.now() - lastAttemptTime < cooldownPeriod) {
      setError(`Too many login attempts. Please try again in ${Math.ceil((cooldownPeriod - (Date.now() - lastAttemptTime)) / 60000)} minutes.`);
    }
  }, [loginAttempts, lastAttemptTime]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (loginAttempts >= 3 && Date.now() - lastAttemptTime < cooldownPeriod) {
      setError(`Too many login attempts. Please try again in ${Math.ceil((cooldownPeriod - (Date.now() - lastAttemptTime)) / 60000)} minutes.`);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setLoginAttempts(0); // Reset attempts on successful login
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      handleAuthSuccess();
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
      if (isLogin) {
        setLoginAttempts(prev => prev + 1);
        setLastAttemptTime(Date.now());
      }
    }
  };

    return (
    <div className="auth-page">
      {!showPasswordReset ? (
        <>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {!isLogin && password.length > 0 && <PasswordStrengthMeter password={password} />}
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </button>
          {isLogin && (
            <button onClick={() => setShowPasswordReset(true)}>
              Forgot Password?
            </button>
          )}
          {error && <ErrorMessage message={error} />}
        </>
      ) : (
        <>
          <PasswordReset />
          <button onClick={() => setShowPasswordReset(false)}>Back to Login</button>
        </>
      )}
    </div>
  );
};

export default Auth;