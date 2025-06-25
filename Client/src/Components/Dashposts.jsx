import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
      staggerChildren: 0.13,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Dashposts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMorePosts, setShowMorePosts] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [postId, setPostId] = useState('');
  const PAGE_SIZE = 9; // match your backend default

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `/api/v1/posts/getPosts?userId=${currentUser._id}&page=1&pageSize=${PAGE_SIZE}`
        );
        if (res.data.posts.length < PAGE_SIZE) {
          setShowMorePosts(false);
        }
        setUserPosts(res.data.posts);
        setPage(2); // next page to fetch
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    try {
      const res = await axios.get(
        `/api/v1/posts/getPosts?userId=${currentUser._id}&page=${page}&pageSize=${PAGE_SIZE}`
      );
      if (res.data.posts.length < PAGE_SIZE) {
        setShowMorePosts(false);
      }
      // Filter out duplicates just in case
      setUserPosts((prev) =>
        [...prev, ...res.data.posts].filter(
          (post, idx, arr) => arr.findIndex((p) => p._id === post._id) === idx
        )
      );
      setPage((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      await axios.delete(
        `/api/v1/posts/deletePost/${postId}/${currentUser._id}`
      );
      toast.success('Post deleted successfully');
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-5xl mx-auto p-2 md:p-6"
    >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <motion.div
            variants={fadeUp}
            custom={0}
            className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-zinc-900"
          >
            <Table hoverable className="min-w-[700px]">
              <TableHead>
                <TableRow className="bg-gradient-to-r from-blue-100 via-purple-50 to-purple-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Date Updated
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Image
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Title
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Category
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Edit
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Delete
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {userPosts.map((post, idx) => (
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
                      className="border-b dark:border-zinc-700 border-zinc-200 transition hover:bg-blue-50 dark:hover:bg-zinc-800 group"
                    >
                      <TableCell className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 transition-transform duration-200 group-hover:scale-105"
                            alt={post.title}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/post/${post.slug}`}
                          className="text-zinc-900 dark:text-white capitalize font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <span className="min-w-[120px] md:min-w-[200px] block truncate">
                            {post.title}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-purple-700 dark:text-purple-300 font-medium">
                        {post.category}
                      </TableCell>
                      <TableCell>
                        <Link to={`/upddatepost/${post._id}`}>
                          <span className="text-teal-600 dark:text-teal-400 font-medium hover:underline hover:text-teal-800 dark:hover:text-teal-200 transition-colors duration-200 cursor-pointer">
                            Edit
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <motion.button
                          onClick={() => {
                            setShowModel(true);
                            setPostId(post._id);
                          }}
                          className="flex items-center gap-1 text-red-500 font-medium hover:underline hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
                          aria-label="Delete post"
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <MdDelete className="text-xl md:text-2xl" />
                          <span className="hidden md:inline">Delete</span>
                        </motion.button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
          {showMorePosts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleShowMore}
                className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold shadow-md hover:scale-105 hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Show More
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col items-center justify-center min-h-[200px]"
        >
          <h2 className="text-center font-semibold text-xl md:text-3xl text-zinc-700 dark:text-zinc-200 mb-2">
            There Is No Post Available
          </h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No posts"
            className="w-24 h-24 opacity-60"
          />
        </motion.div>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader>
          <span className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <MdDelete className="text-2xl" /> Delete Post
          </span>
        </ModalHeader>
        <ModalBody className="max-w-2xl">
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-base text-slate-700 dark:text-slate-200 tracking-wide font-semibold text-center">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button
                color="failure"
                onClick={handleDeletePost}
                className="transition-transform duration-150 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, Delete
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModel(false)}
                className="transition-transform duration-150 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </motion.div>
  );
};

export default Dashposts;
