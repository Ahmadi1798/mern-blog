import { Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Comment = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
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
    } catch (error) {
      toast.err(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl px-2 py-4 w-full">
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
                n
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
    </div>
  );
};
export default Comment;
