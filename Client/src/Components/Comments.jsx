import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

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

const Comments = ({ comment, onLike, onEdit, onDelete, index = 0 }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [showEditingComment, setShowEditingComment] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/v1/auth/${comment.userId}`);
        setUser(res.data);
      } catch (error) {
        setUser({
          username: 'anonymous',
          profilePicture: '/default-avatar.png',
        });
      }
    };
    getUser();
  }, [comment]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/v1/comment/editComment/${comment._id}`, {
        comment: editedComment,
      });
      setShowEditingComment(false);
      onEdit(comment, editedComment);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={comment._id}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
        variants={fadeUp}
        custom={index}
        className="flex flex-row space-x-3 w-full mt-4 border-b border-b-gray-200 dark:border-b-zinc-700 pb-4 last:border-b-0 transition-all duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-1 flex-shrink-0"
        >
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 dark:border-zinc-700 shadow-sm"
          />
        </motion.div>
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
              @{user?.username || 'anonymous'}
            </span>
            <span className="text-xs text-zinc-400">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          <AnimatePresence mode="wait">
            {showEditingComment ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="w-full p-2">
                  <Textarea
                    required
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 resize-none rounded-md border border-blue-100 dark:border-zinc-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
                    rows={2}
                    maxLength={200}
                  />
                </div>
                <div className="flex justify-end space-x-2 px-2 pb-2">
                  <Button
                    onClick={handleSave}
                    size="xs"
                    className="text-xs cursor-pointer transition-transform duration-150 hover:scale-105"
                    outline
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setShowEditingComment(false)}
                    size="xs"
                    className="text-xs cursor-pointer transition-transform duration-150 hover:scale-105"
                    color="gray"
                    outline
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-zinc-700 dark:text-zinc-300 text-sm pt-1 pb-2 break-words">
                  {comment.comment}
                </p>
                <div className="flex items-center gap-3 py-1 border-t max-w-fit dark:border-t-zinc-700 border-t-gray-200 mt-2">
                  <motion.button
                    type="button"
                    onClick={() => onLike(comment._id)}
                    className={`flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors duration-150 cursor-pointer ${
                      currentUser &&
                      Array.isArray(comment.likes) &&
                      comment.likes.includes(currentUser._id) &&
                      '!text-blue-500'
                    }`}
                    aria-label="Like comment"
                    whileTap={{ scale: 0.93 }}
                  >
                    <FaThumbsUp className="text-base" />
                    <span className="text-xs">
                      {comment.numberOfLikes > 0 &&
                        comment.numberOfLikes +
                          ' ' +
                          (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                    </span>
                  </motion.button>
                  {currentUser &&
                    (currentUser._id === comment.userId ||
                      currentUser.isAdmin) && (
                      <>
                        <motion.button
                          type="button"
                          onClick={() => {
                            setShowEditingComment(true);
                            setEditedComment(comment.comment);
                          }}
                          className="text-xs text-gray-400 hover:text-blue-500 transition-colors duration-150 cursor-pointer font-medium"
                          whileTap={{ scale: 0.93 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => onDelete(comment._id)}
                          className="text-xs text-red-500 hover:text-red-600 transition-colors duration-150 cursor-pointer font-medium"
                          whileTap={{ scale: 0.93 }}
                        >
                          Delete
                        </motion.button>
                      </>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Comments;
