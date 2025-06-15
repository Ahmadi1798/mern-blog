import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';

const Comments = ({ comment }) => {
  const [user, setUser] = useState({});
  console.log(user);
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
    <div className="flex flex-row space-x-2 items-start mt-4 border-b border-b-gray-200 ">
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
      </div>
    </div>
  );
};
export default Comments;
