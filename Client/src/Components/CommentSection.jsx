import { Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import Comments from './Comments';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
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

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/comment/getPostComments/${postId}`,
          {
            withCredentials: true,
          }
        );
        setComments(res.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    getComments();
  }, [postId]);

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    try {
      const res = await axios.put(
        `${API_BASE_URL}/comment/likeComment/${commentId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: Array.isArray(res.data.likes) ? res.data.likes : [],
                numberOfLikes: Array.isArray(res.data.likes)
                  ? res.data.likes.length
                  : 0,
              }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, comment: editedComment } : c
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/comment/createComment`,
        {
          comment,
          postId,
          userId: currentUser._id,
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Comment created successfully');
      setComment('');
      setComments([res.data, ...comments]);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteComment = async () => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      await axios.delete(
        `${API_BASE_URL}/comment/deleteComment/${commentToDelete}`,
        {
          withCredentials: true,
        }
      );
      setShowModel(false);
      setComments(
        comments.filter((comment) => comment._id !== commentToDelete)
      );
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-2xl w-full mx-auto px-2 py-6 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-md transition-all duration-300"
    >
      <motion.div variants={fadeUp} custom={0} className="flex items-start">
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-800 dark:text-slate-400 font-medium">
              Signed in as
            </span>
            <div className="flex items-center space-x-1">
              <img
                className="w-8 h-8 rounded-full border-2 border-blue-200 dark:border-zinc-700 shadow-sm"
                src={currentUser.profilePicture}
                alt="user profile"
              />
              <Link
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                to={'/dashboard?tab=profile'}
              >
                @{currentUser.username}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <p className="capitalize text-sm text-teal-600 dark:text-teal-400 font-medium">
              You need to sign in to comment
            </p>
            <Link
              to={'/sign-in'}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
      {currentUser && (
        <motion.form
          onSubmit={handleSubmit}
          className="mt-5 w-full p-4 mx-auto rounded-lg border border-blue-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-sm transition-all duration-200"
          variants={containerVariants}
        >
          <motion.div variants={fadeUp} custom={1}>
            <Textarea
              maxLength="200"
              rows={3}
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="resize-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
              as={motion.textarea}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="flex items-center justify-between mt-4 w-full"
          >
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {200 - comment.length} characters remaining
            </span>
            <Button
              outline
              type="submit"
              disabled={!comment.trim()}
              className="transition-transform duration-150 hover:scale-105"
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit
            </Button>
          </motion.div>
        </motion.form>
      )}
      <AnimatePresence>
        {comments.length === 0 ? (
          <motion.div
            key="no-comments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-slate-500 mt-6 text-center"
          >
            No comments yet. Be the first to comment!
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex items-center gap-2 p-2 mt-4"
            >
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Comments
              </p>
              <span className="flex items-center justify-center border border-gray-300 dark:border-zinc-700 rounded-full h-6 w-6 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                {comments.length}
              </span>
            </motion.div>
            <motion.div variants={containerVariants} className="space-y-4 mt-2">
              <AnimatePresence>
                {comments.map((comment, idx) => (
                  <Comments
                    comment={comment}
                    key={comment._id}
                    onLike={handleLikeComment}
                    onEdit={handleEdit}
                    onDelete={(commentId) => {
                      setCommentToDelete(commentId);
                      setShowModel(true);
                    }}
                    index={idx + 4}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
                size="sm"
                as={motion.button}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, Delete
              </Button>
              <Button
                size="sm"
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

export default CommentSection;
