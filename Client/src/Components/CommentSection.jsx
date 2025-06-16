import { Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Comments from './Comments';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
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
            />
          ))}
        </>
      )}
    </div>
  );
};
export default CommentSection;
