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
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
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

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMorecomments, setShowMorecomments] = useState(true);
  const [comments, setComments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentId, setCommentId] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/comment/getcomments`, {
          withCredentials: true,
        });
        if (res.data.comments.length < 9) {
          setShowMorecomments(false);
        }
        setComments(res.data.comments);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/comment/getcomments?&startIndex=${startIndex}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.comments.length < 9) {
        setShowMorecomments(false);
      }
      setComments([...comments, ...res.data.comments]);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteComment = async () => {
    setShowModel(false);
    try {
      await axios.delete(`${API_BASE_URL}/comment/deleteComment/${commentId}`, {
        withCredentials: true,
      });
      toast.success('Comment deleted successfully');
      setComments(comments.filter((comment) => comment._id !== commentId));
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
      {currentUser.isAdmin && comments.length > 0 ? (
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
                    Comment
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Likes
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Post ID
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    User ID
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Delete
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {comments.map((comment, idx) => (
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
                      className="border-b dark:border-zinc-700 border-zinc-200 transition hover:bg-blue-50 dark:hover:bg-zinc-800 group"
                    >
                      <TableCell className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-[200px] md:max-w-xs truncate text-zinc-800 dark:text-zinc-100">
                          {comment.comment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {comment.numberOfLikes}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-[120px] truncate text-blue-700 dark:text-blue-300">
                          {comment.postId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-[120px] truncate text-zinc-700 dark:text-zinc-200">
                          {comment.userId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <motion.button
                          onClick={() => {
                            setShowModel(true);
                            setCommentId(comment._id);
                          }}
                          className="flex items-center gap-1 text-red-500 font-medium hover:underline hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
                          aria-label="Delete comment"
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
          {showMorecomments && (
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
            There Is No Comment Available
          </h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5948/5948565.png"
            alt="No comments"
            className="w-24 h-24 opacity-60"
          />
        </motion.div>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader>
          <span className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <MdDelete className="text-2xl" /> Delete Comment
          </span>
        </ModalHeader>
        <ModalBody className="max-w-2xl">
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-base text-slate-700 dark:text-slate-200 tracking-wide font-semibold text-center">
              Are you sure you want to delete this comment?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button
                color="failure"
                onClick={handleDeleteComment}
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

export default DashComments;
