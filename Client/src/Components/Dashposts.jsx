import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashposts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `/api/v1/posts/getPosts?userId=${currentUser._id}`
        );
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
  return (
    <div className="table-auto p-2 overflow-x-scroll scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Data Updated</TableHeadCell>
              <TableHeadCell>Post Image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>

              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {userPosts.map((post) => {
              return (
                <TableBody className="divide-y divide-amber-500">
                  <TableRow className="border dark:border-gray-700 border-gray-200">
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
                        className="text-gray-900 dark:text-white capitalize font-semibold "
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Link to={`/upddatepost/${post._id}`}>
                        <span className="text-teal-500 font-medium ">Edit</span>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <span className="text-red-500 font-medium hover:underline cursor-pointer">
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </>
      ) : (
        <h2 className="text-center font-semibold text-3xl ">
          There Is No Post Available
        </h2>
      )}
    </div>
  );
};
export default Dashposts;
