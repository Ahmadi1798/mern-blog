import { Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Comments from './Comments';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';

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
          `/api/v1/comment/getPostComments/${postId}`
        );
        setComments(res.data);
      } catch (error) {
        toast.err(error?.response?.data?.message || 'Something went wrong');
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
      const res = await axios.put(`/api/v1/comment/likeComment/${commentId}`);
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
      const res = await axios.post('/api/v1/comment/createComment', {
        comment,
        postId,
        userId: currentUser._id,
      });
      toast.success('Comment created successfully');
      console.log(res);
      setComment('');
      setComments([res.data, ...comments]);
    } catch (error) {
      toast.err(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteComment = async () => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      await axios.delete(`/api/v1/comment/deleteComment/${commentToDelete}`);
      setShowModel(false);
      setComments(
        comments.filter((comment) => comment._id !== commentToDelete)
      );
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.err(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl px-2 py-4 w-full mx-auto">
      <div className="flex items-start">
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <p className="text-xs text-slate-800 dark:text-slate-500 ">
              Signed In As:{' '}
            </p>
            <div className="flex items-center space-x-1 ">
              <img
                className="w-8 h-8 rounded-full"
                src={currentUser.profilePicture}
                alt="user Profile Piture"
              />
              <Link
                className="text-xs text-teal-500 hover:underline "
                to={'/dashboard?tab=profile'}
              >
                @{currentUser.username}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <p className="capitalize text-sm text-teal-500">
              you need to sign in to comment
            </p>
            <Link
              to={'/sign-in'}
              className="text-sm text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 w-full p-4 mx-auto rounded-md ring ring-blue-500"
        >
          <Textarea
            maxLength="200"
            rows={3}
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex items-center justify-between mt-5 w-full">
            <p className="text-xs text-slate-800 dark:text-slate-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <div>
          <p className="text-sm text-slate-500 mt-5">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 p-2 mt-2 ">
            <p className="text-sm">Comments</p>
            <div className="border border-gray-400 h-6 w-6 text-center">
              {comments.length}
            </div>
          </div>
          {comments.map((comment) => (
            <Comments
              comment={comment}
              key={comment._id}
              onLike={handleLikeComment}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setCommentToDelete(commentId);
                setShowModel(true);
              }}
            />
          ))}
        </>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader />
        <ModalBody className="max-w-2xl">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row items-center space-x-2">
              <MdDelete className="text-red-600 text-3xl" size={50} />
            </div>
            <h2 className="text-sm text-slate-600  tracking-wide font-semibold">
              Are you sure you want to delete this Comment?
            </h2>
            <div className="flex flex-row space-x-4 mt-3 ">
              <Button
                color="red"
                outline
                onClick={handleDeleteComment}
                size="sm"
              >
                Yes, Delete
              </Button>
              <Button
                size="sm"
                color="gray"
                outline
                onClick={() => {
                  setShowModel(false);
                }}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default CommentSection;
