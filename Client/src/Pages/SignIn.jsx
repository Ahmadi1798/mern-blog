import axios from 'axios';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../Redux/user/userSlice';
import GAuth from '../Components/GAuth';
// Firebase imports
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../utils/api';

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

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // 1. Sign in with Firebase to check email verification
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email before logging in.');
        dispatch(loginFailure('Email not verified'));
        return;
      }
      // 2. If verified, proceed with backend login
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
      });
      toast.success('Login Successful');
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message));
      let msg = errorMessage || error.message || 'Something went wrong';
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      }
      if (error.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      }
      if (error.code === 'auth/too-many-requests') {
        msg =
          'Too many failed attempts. Please try again later or reset your password.';
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
              fill="#6366f1"
            />
            <rect x="260" y="370" width="280" height="40" rx="12" fill="#fff" />
            <rect x="260" y="430" width="180" height="40" rx="12" fill="#fff" />
            <rect
              x="260"
              y="490"
              width="120"
              height="30"
              rx="10"
              fill="#a5b4fc"
            />
            <circle cx="400" cy="260" r="60" fill="#6366f1" />
            <circle cx="400" cy="260" r="45" fill="#fff" />
            <ellipse cx="400" cy="260" rx="20" ry="25" fill="#6366f1" />
          </svg>
        </motion.div>
        {/* Sign In Form */}
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
            Sign In
          </motion.h1>
          <motion.div variants={fadeUp} custom={3}>
            <Label>Email</Label>
            <TextInput
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="mt-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              autoComplete="email"
              required
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={4}>
            <Label>Password</Label>
            <TextInput
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              className="mt-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              autoComplete="current-password"
              required
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={5} className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} custom={6}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-bold rounded-lg py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow hover:scale-105"
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading</span>
                </>
              ) : (
                'Log In'
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
            <span>Don't have an account?</span>
            <Link
              to="/sign-up"
              className="text-blue-600 font-semibold hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;
