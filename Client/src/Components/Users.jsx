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
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { FaTimes, FaCheck } from 'react-icons/fa';

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMoreUsers, setshowMoreUsers] = useState(true);
  const [users, setusers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [userId, setuserId] = useState('');
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/v1/auth/getUsers`);
        console.log(res.data.users.length);
        if (res.data.users.length < 9) {
          setshowMoreUsers(false);
        }
        toast.success('Success');
        setusers(res.data.users);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `/api/v1/auth/getUsers?&startIndex=${startIndex}`
      );
      console.log(res.data.users.length);
      if (res.data.users.length < 9) {
        setshowMoreUsers(false);
      }
      toast.success('Success');
      setusers([...users, ...res.data.users]);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      await axios.delete(`/api/v1/auth/delete/${userId}`);
      toast.success('User deleted successfully');
      setusers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="table-auto p-2 overflow-x-scroll scrollbar  scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Data created</TableHeadCell>
                <TableHeadCell>user Image</TableHeadCell>
                <TableHeadCell>username</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>

                <TableHeadCell>
                  <span>Admin</span>
                </TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  className="border dark:border-gray-700 border-gray-200"
                  key={user._id}
                >
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      className="w-10 h-10 object-cover  rounded-full "
                      alt={user.username}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="min-w-[200px] block">{user.username}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setuserId(user._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMoreUsers && (
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
          There Is No User Available
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
              Are you sure you want to delete this user?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button color="red" outline onClick={handleDeleteUser}>
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
export default Users;
