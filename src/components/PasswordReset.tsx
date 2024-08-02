import { useState } from 'react';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import ErrorMessage from './ErrorMessage';
import { getFirebaseErrorMessage } from '../utils/firebaseErrorHandler';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
      setError('');
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
      setMessage('');
    }
  };

  return (
    <div className="password-reset">
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default PasswordReset;