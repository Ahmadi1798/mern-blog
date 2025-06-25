import { useState, useEffect } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase';
import { Button, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      setTimer(20); // 20 seconds timer
    } catch (error) {
      toast.error(error.message);
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <TextInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4"
        />
        <Button type="submit" className="w-full mb-3" disabled={sending}>
          {sending ? 'Sending...' : 'Send Reset Email'}
        </Button>
        <Button
          type="button"
          color="light"
          className="w-full"
          onClick={() => navigate('/sign-in')}
          disabled={timer > 0}
        >
          {timer > 0 ? `Go to Sign In (${timer})` : 'Go to Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
