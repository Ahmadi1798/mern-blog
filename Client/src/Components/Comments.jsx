import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import { toast } from 'react-toastify';

const Comments = ({ comment, onLike, onEdit, onDelete }) => {
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
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  console.log(comment);

  const handleSave = async () => {
    try {
      await axios.put(`/api/v1/comment/editComment/${comment._id}`, {
        comment: editedComment,
      });
      setShowEditingComment(false);
      onEdit(comment, editedComment);
    } catch (error) {
      toast.err(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-row space-x-2  w-full mt-4 border-b border-b-gray-200 dark:border-b-gray-500 ">
      <div className="p-2 flex-shrink-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="w-full">
        <div className="flex flex-1 items-center space-x-2">
          <span className="text-xs font-semibold ">
            @{user ? user.username : 'anonymous user'}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {showEditingComment ? (
          <>
            <div className="w-full p-2">
              <Textarea
                required
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="w-full p-2 resize-none rounded-md  "
              />
            </div>
            <div className="flex justify-end space-x-2 px-2 pb-2">
              <Button
                onClick={handleSave}
                size="xs"
                className="text-xs cursor-pointer"
                outline
              >
                Submit
              </Button>
              <Button
                onClick={() => setShowEditingComment(false)}
                size="xs"
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-sm pt-1 pb-3 ">
              {comment.comment}
            </p>
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
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        // Handle edit comment logic here
                        setShowEditingComment(true);
                        setEditedComment(comment.comment);
                      }}
                      className=" text-xs
                text-gray-400 hover:text-blue-500 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(comment._id);
                      }}
                      className=" text-xs
                text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Comments;
