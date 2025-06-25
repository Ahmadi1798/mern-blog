import { Button } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmailNotice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <svg width="80" height="80" fill="none" className="mb-4">
          <circle cx="40" cy="40" r="40" fill="#a5b4fc" />
          <path
            d="M20 35l20 15 20-15"
            stroke="#fff"
            strokeWidth="3"
            fill="none"
          />
          <rect x="20" y="30" width="40" height="20" rx="4" fill="#fff" />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-center">
          Verify Your Email
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 text-center mb-6">
          We’ve sent a verification link to{' '}
          <span className="font-semibold">{email}</span>.<br />
          Please check your inbox and verify your email to continue.
        </p>
        <Button className="w-full" onClick={() => navigate('/sign-in')}>
          Go to Sign In
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
