import axios from 'axios';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import GAuth from '../Components/GAuth';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../../utils/api';
import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { app } from '../firebase';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const SignUp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [verificationSent, setVerificationSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationSent(false);

    try {
      // 1. Register user in your backend
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);

      // 2. Register user in Firebase for email verification
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: formData.username,
      });

      // 3. Send verification email
      await sendEmailVerification(userCredential.user);

      // 4. Show success and info to user
      toast.success(
        'Registration successful! Please check your email to verify your account.'
      );
      setVerificationSent(true);

      setIsLoading(false);

      // 5. Route to verify email notice page, passing email as state
      navigate('/verify-email-notice', { state: { email: formData.email } });
    } catch (error) {
      setIsLoading(false);
      let msg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      if (error.code === 'auth/email-already-in-use') {
        msg =
          'This email is already registered. Please sign in or use another email.';
      }
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-all duration-300"
    >
      <motion.div
        variants={fadeUp}
        custom={0}
        className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-6 md:p-10 gap-10"
      >
        {/* SVG Illustration */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="hidden md:flex items-center justify-center w-1/2"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            width="320"
            height="320"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-72 h-72"
          >
            <ellipse cx="400" cy="400" rx="400" ry="400" fill="#e0e7ff" />
            <rect
              x="220"
              y="320"
              width="360"
              height="220"
              rx="32"
              fill="#38bdf8"
            />
            <rect x="260" y="370" width="280" height="40" rx="12" fill="#fff" />
            <rect x="260" y="430" width="180" height="40" rx="12" fill="#fff" />
            <rect
              x="260"
              y="490"
              width="120"
              height="30"
              rx="10"
              fill="#7dd3fc"
            />
            <circle cx="400" cy="260" r="60" fill="#38bdf8" />
            <circle cx="400" cy="260" r="45" fill="#fff" />
            <ellipse cx="400" cy="260" rx="20" ry="25" fill="#38bdf8" />
          </svg>
        </motion.div>
        {/* Sign Up Form */}
        <motion.form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 w-full md:w-1/2 bg-white dark:bg-zinc-900 rounded-xl shadow p-6"
          variants={containerVariants}
        >
          <motion.h1
            variants={fadeUp}
            custom={2}
            className="md:text-4xl text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300"
          >
            Sign Up
          </motion.h1>
          <motion.div variants={fadeUp} custom={3}>
            <Label>Name</Label>
            <TextInput
              type="text"
              name="username"
              placeholder="Enter your name"
              onChange={handleChange}
              className="mt-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              required
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={4}>
            <Label>Email</Label>
            <TextInput
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="mt-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              required
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={5}>
            <Label>Password</Label>
            <TextInput
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              className="mt-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              required
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={6}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 font-bold rounded-lg py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow hover:scale-105"
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading</span>
                </>
              ) : (
                'Register'
              )}
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} custom={7}>
            <GAuth />
          </motion.div>
          <motion.div
            variants={fadeUp}
            custom={8}
            className="flex space-x-3 items-center text-sm justify-center mt-2"
          >
            <span>Have an account?</span>
            <Link
              to="/sign-in"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
