import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const CTA = ({
  title = 'Ready to share your story?',
  description = 'Join our community and start blogging today!',
  buttonText = 'Get Started',
  path,
  onClick,
  className = '',
}) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`w-full rounded-2xl px-6 py-10 md:px-12 md:py-16 shadow-2xl transition-colors duration-300 relative overflow-hidden
        ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100'
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-zinc-900'
        } flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 ${className}`}
    >
      {/* Animated gradient accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-full blur-3xl pointer-events-none animate-pulse"
      />
      <motion.div
        variants={fadeUp}
        custom={0}
        className="flex flex-col items-center md:items-start flex-1 z-10"
      >
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-3xl md:text-4xl font-extrabold mb-3 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-base md:text-lg mb-8 text-center md:text-left text-zinc-600 dark:text-zinc-300"
        >
          {description}
        </motion.p>
        {path ? (
          <Link to={path}>
            <motion.button
              variants={fadeUp}
              custom={3}
              className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200
                ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white'
                } hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-pink-700`}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              {buttonText}
            </motion.button>
          </Link>
        ) : (
          <motion.button
            variants={fadeUp}
            custom={3}
            onClick={onClick}
            className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200
              ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white'
              } hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-pink-700`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            {buttonText}
          </motion.button>
        )}
      </motion.div>
      {/* Animated SVG illustration */}
      <motion.div
        variants={fadeUp}
        custom={4}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex justify-center z-10"
      >
        <svg
          width="220"
          height="180"
          viewBox="0 0 220 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 md:w-60"
        >
          <ellipse
            cx="110"
            cy="160"
            rx="90"
            ry="18"
            fill="#e0e7ff"
            opacity="0.4"
          />
          <rect
            x="40"
            y="40"
            width="140"
            height="80"
            rx="16"
            fill="#fff"
            stroke="#a5b4fc"
            strokeWidth="3"
          />
          <rect x="60" y="60" width="100" height="12" rx="6" fill="#c7d2fe" />
          <rect x="60" y="80" width="60" height="12" rx="6" fill="#c7d2fe" />
          <circle cx="170" cy="52" r="8" fill="#6366f1" />
          <path
            d="M170 52l6 6M170 52l-6 6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="110" y="100" width="40" height="10" rx="5" fill="#f9a8d4" />
          <rect x="60" y="100" width="40" height="10" rx="5" fill="#a7f3d0" />
          <rect x="60" y="120" width="90" height="6" rx="3" fill="#e0e7ff" />
        </svg>
      </motion.div>
    </motion.section>
  );
};

export default CTA;
