import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const Comments = ({ comment, onLike }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/v1/auth/${comment.userId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex flex-row space-x-2 items-start mt-4 border-b border-b-gray-200 dark:border-b-gray-500 ">
      <div className="p-2 flex-shrink-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold ">
            @{user ? user.username : 'anonymous user'}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 text-sm pt-1 pb-3 ">{comment.comment}</p>
        <div className="flex items-start space-x-2 py-2 border-t max-w-fit dark:border-t-gray-500 border-t-gray-200 ">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 cursor-pointer ${
              currentUser &&
              Array.isArray(comment.likes) &&
              comment.likes.includes(currentUser._id) &&
              '!text-blue-500'
            }`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-xs">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                ' ' +
                (comment.numberOfLikes === 1 ? 'like' : 'likes')}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Comments;
