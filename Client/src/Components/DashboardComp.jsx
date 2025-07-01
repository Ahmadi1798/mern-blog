import axios from 'axios';
import { FaUsers, FaRegComments, FaRegNewspaper } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Table, Button } from 'flowbite-react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const DashboardComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/getUsers?pageSize=5`);
        setUsers(res.data.users);
        setTotalUsers(res.data.totalUsers);
        setLastMonthUsers(res.data.lastMonthUsers);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/posts/getPosts?pageSize=5`
        );
        setPosts(res.data.posts);
        setTotalPosts(res.data.totalPosts);
        setLastMonthPosts(res.data.lastMonthPosts);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/comment/getComments?pageSize=5`
        );
        setComments(res.data.comments);
        setTotalComments(res.data.totalComments);
        setLastMonthComments(res.data.lastMonthComments);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-6xl mx-auto py-8 px-2"
    >
      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <AnimatePresence>
          {/* Users Card */}
          <motion.div
            variants={fadeUp}
            custom={0}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
            className="group bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-blue-700 rounded-xl shadow-xl p-6 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden"
          >
            <FaUsers className="text-4xl text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-white text-lg font-semibold mb-1">
              Total Users
            </h2>
            <p className="text-3xl font-bold text-white mb-2 animate-pulse">
              {totalUsers}
            </p>
            <span className="absolute bottom-2 right-4 text-xs text-blue-200 opacity-70">
              +{lastMonthUsers} last month
            </span>
          </motion.div>
          {/* Posts Card */}
          <motion.div
            variants={fadeUp}
            custom={1}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
            className="group bg-gradient-to-br from-green-500 to-green-700 dark:from-green-900 dark:to-green-700 rounded-xl shadow-xl p-6 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden"
          >
            <FaRegNewspaper className="text-4xl text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-white text-lg font-semibold mb-1">
              Total Posts
            </h2>
            <p className="text-3xl font-bold text-white mb-2 animate-pulse">
              {totalPosts}
            </p>
            <span className="absolute bottom-2 right-4 text-xs text-green-200 opacity-70">
              +{lastMonthPosts} last month
            </span>
          </motion.div>
          {/* Comments Card */}
          <motion.div
            variants={fadeUp}
            custom={2}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
            className="group bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-900 dark:to-purple-700 rounded-xl shadow-xl p-6 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden"
          >
            <FaRegComments className="text-4xl text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-white text-lg font-semibold mb-1">
              Total Comments
            </h2>
            <p className="text-3xl font-bold text-white mb-2 animate-pulse">
              {totalComments}
            </p>
            <span className="absolute bottom-2 right-4 text-xs text-purple-200 opacity-70">
              +{lastMonthComments} last month
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Responsive Tables Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Users Table */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Recent Users
            </h2>
            <Link to="/dashboard?tab=users">
              <Button
                color="blue"
                pill
                size="sm"
                className="transition-all duration-200 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                View All Users
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="min-w-[350px]">
              <TableHead>
                <TableHeadCell>User</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Admin</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                <AnimatePresence>
                  {users && users.length > 0 ? (
                    users.map((user, idx) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          delay: idx * 0.07,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-white dark:bg-zinc-900 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-zinc-800"
                      >
                        <TableCell>
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-100">
                            @{user.username}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 font-semibold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              User
                            </span>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-400"
                      >
                        No users found.
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Comments Table */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Recent Comments
            </h2>
            <Link to="/dashboard?tab=comments">
              <Button
                color="purple"
                pill
                size="sm"
                className="transition-all duration-200 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                View All Comments
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="min-w-[350px]">
              <TableHead>
                <TableHeadCell>Data updated</TableHeadCell>
                <TableHeadCell>Comment</TableHeadCell>
                <TableHeadCell>Likes</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                <AnimatePresence>
                  {comments && comments.length > 0 ? (
                    comments.map((comment, idx) => (
                      <motion.tr
                        key={comment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          delay: idx * 0.07,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-white dark:bg-zinc-900 transition-all duration-200 hover:bg-purple-50 dark:hover:bg-zinc-800"
                      >
                        <TableCell className="text-zinc-700 dark:text-zinc-100 line-clamp-1">
                          {new Date(comment.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="text-zinc-700 dark:text-zinc-100 line-clamp-1">
                            {comment.comment}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-zinc-700 dark:text-zinc-100 line-clamp-1">
                            {comment.numberOfLikes}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-400"
                      >
                        No comments found.
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
        {/* Posts Table */}
        <motion.div
          variants={fadeUp}
          custom={5}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl md:col-span-2 p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Recent Posts
            </h2>
            <Link to="/dashboard?tab=posts">
              <Button
                color="green"
                pill
                size="sm"
                className="transition-all duration-200 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                View All Posts
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="min-w-[350px]">
              <TableHead>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                <AnimatePresence>
                  {posts && posts.length > 0 ? (
                    posts.map((post, idx) => (
                      <motion.tr
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          delay: idx * 0.07,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-white dark:bg-zinc-900 transition-all duration-200 hover:bg-green-50 dark:hover:bg-zinc-800"
                      >
                        <TableCell>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded object-cover border-2 border-green-500 shadow"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-100 line-clamp-1">
                            {post.title}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                            {post.category}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-400"
                      >
                        No posts found.
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardComp;
