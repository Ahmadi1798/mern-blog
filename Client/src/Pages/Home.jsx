import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import PostCard from '../Components/PostCard';
import { Typewriter } from 'react-simple-typewriter';
import CTA from '../Components/CTA';
import { useSelector } from 'react-redux';
import projects from '../../utils/projects';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../utils/api';

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/posts/getPosts?pageSize=6`
        );
        setPosts(res.data.posts);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    fetchPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-all duration-300"
    >
      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden"
      >
        {/* Soft gradient background shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-100 rounded-full blur-3xl pointer-events-none z-0"
        />
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 drop-shadow-lg min-h-[90px]"
          >
            <Typewriter
              words={['Welcome to MERN Blog']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={60}
              delaySpeed={1500}
            />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-xl tracking-wide md:text-2xl text-zinc-700 dark:text-zinc-200 max-w-2xl mx-auto font-medium"
          >
            A modern, minimal platform for sharing ideas, learning, and building
            together.
            <br />
            Read, write, and get inspired.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-4 mt-10 justify-center"
          >
            <Link
              to={
                currentUser && currentUser.isAdmin
                  ? '/create-post'
                  : currentUser
                  ? '/search'
                  : '/sign-up'
              }
            >
              <Button className="px-8 py-3 rounded-lg font-semibold text-lg shadow transition-transform duration-150 hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                Get Started
              </Button>
            </Link>
            <Link to="/search">
              <Button
                color="light"
                className="px-8 py-3 rounded-lg font-semibold text-lg shadow transition-transform duration-150 hover:scale-105 border-0"
              >
                Explore Posts
              </Button>
            </Link>
          </motion.div>
          {/* Minimal icon or accent - larger size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 flex justify-center"
          >
            <span className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 shadow-lg">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                {/* Paper */}
                <rect
                  x="22"
                  y="28"
                  width="52"
                  height="40"
                  rx="6"
                  fill="#fff"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                {/* Pen body */}
                <rect
                  x="60"
                  y="18"
                  width="8"
                  height="32"
                  rx="3"
                  transform="rotate(20 60 18)"
                  fill="#6366f1"
                />
                {/* Pen tip */}
                <polygon points="68,50 72,60 64,58" fill="#f59e42" />
                {/* Lines on paper */}
                <rect
                  x="30"
                  y="36"
                  width="36"
                  height="3"
                  rx="1.5"
                  fill="#e0e7ff"
                />
                <rect
                  x="30"
                  y="44"
                  width="28"
                  height="3"
                  rx="1.5"
                  fill="#e0e7ff"
                />
                <rect
                  x="30"
                  y="52"
                  width="24"
                  height="3"
                  rx="1.5"
                  fill="#e0e7ff"
                />
              </svg>
            </span>
          </motion.div>
        </div>
      </motion.section>
      {/* Features Section */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: '📝',
            title: 'Write Effortlessly',
            desc: 'Create and share posts with a beautiful, distraction-free editor.',
          },
          {
            icon: '🚀',
            title: 'Discover Content',
            desc: 'Explore trending topics and recent posts from the community.',
          },
          {
            icon: '🤝',
            title: 'Connect & Grow',
            desc: 'Join a network of passionate writers, developers, and creators.',
          },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={sectionVariants}
            custom={i + 1}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200"
          >
            <span className="text-4xl mb-4">{feature.icon}</span>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>
      {/* Recent Posts */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
        className="max-w-5xl mx-auto px-4 py-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100"
        >
          Recent Posts
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {posts.map((post, i) => (
            <motion.div
              key={post._id}
              variants={sectionVariants}
              custom={i + 1}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center mt-8">
          <Link to="/search">
            <Button
              gradientDuoTone="purpleToPink"
              className="px-8 py-3 rounded-full font-semibold text-lg shadow transition-transform duration-150 hover:scale-105"
            >
              View All Posts
            </Button>
          </Link>
        </div>
      </motion.section>
      {/* Projects Preview Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={3}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl  font-bold mb-6 text-zinc-800 dark:text-zinc-100 text-start"
        >
          Featured Projects
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={sectionVariants}
              custom={index + 1}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col group"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden"
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="h-40 w-full object-cover transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                />
              </a>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 transition-all duration-200 group-hover:bg-blue-200 group-hover:text-blue-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center mt-10">
          <Link to="/projects">
            <Button
              gradientDuoTone="purpleToPink"
              className="px-8 py-3 rounded-full font-semibold text-lg shadow transition-transform duration-150 hover:scale-105"
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </motion.section>
      {/* CTA Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={4}
        className="text-center max-w-5xl mx-auto py-10 px-4"
      >
        <CTA
          path={
            currentUser && currentUser.isAdmin
              ? '/create-post'
              : currentUser
              ? '/search'
              : '/sign-up'
          }
        />
      </motion.section>
    </motion.div>
  );
};

export default Home;
