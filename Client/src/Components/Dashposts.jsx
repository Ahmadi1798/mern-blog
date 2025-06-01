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
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';

const Dashposts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMorePosts, setShowMorePosts] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [postId, setPostId] = useState('');
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `/api/v1/posts/getPosts?userId=${currentUser._id}`
        );
        if (res.data.posts.length < 9) {
          setShowMorePosts(false);
        }
        toast.success('Success');
        setUserPosts(res.data.posts);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(
        `/api/v1/posts/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      if (res.data.posts.length < 9) {
        setShowMorePosts(false);
      }
      toast.success('Success');
      setUserPosts([...userPosts, ...res.data.posts]);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="table-auto p-2 overflow-x-scroll scrollbar  scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Data Updated</TableHeadCell>
                <TableHeadCell>Post Image</TableHeadCell>
                <TableHeadCell>Post Title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>

                <TableHeadCell>
                  <span>Edit</span>
                </TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPosts.map((post) => {
                return (
                  <TableRow
                    key={post._id}
                    className="border dark:border-gray-700 border-gray-200"
                  >
                    <TableCell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          className="w-20 h-14 object-cover rounded-md "
                          alt={post.title}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-gray-900 dark:text-white capitalize font-semibold  "
                      >
                        <span className="min-w-[200px] block">
                          {' '}
                          {post.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Link to={`/upddatepost/${post._id}`}>
                        <span className="text-teal-500 font-medium ">Edit</span>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <span
                        onClick={() => {
                          setShowModel(true);
                          setPostId(post._id);
                        }}
                        className="text-red-500 font-medium hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {showMorePosts && (
            <button
              onClick={handleShowMore}
              className="w-full self-center text-center text-teal-500 font-medium hover:underline cursor-pointer my-10"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <h2 className="text-center font-semibold text-3xl ">
          There Is No Post Available
        </h2>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader />
        <ModalBody className="max-w-2xl">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row items-center space-x-2">
              <MdDelete className="text-red-600 text-3xl" size={50} />
            </div>
            <h2 className="text-sm text-slate-600  tracking-wide font-semibold">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button color="red" outline onClick={handleDeletePost}>
                Yes, Delete
              </Button>
              <Button
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
export default Dashposts;
