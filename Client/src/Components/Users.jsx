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
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../utils/api';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.13,
    },
  },
};

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

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showMoreUsers, setShowMoreUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/getUsers`, {
          withCredentials: true,
        });
        if (res.data.users.length < 9) {
          setShowMoreUsers(false);
        }
        setUsers(res.data.users);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/auth/getUsers?&startIndex=${startIndex}`
      );
      if (res.data.users.length < 9) {
        setShowMoreUsers(false);
      }
      // Filter duplicates just in case
      setUsers((prev) =>
        [...prev, ...res.data.users].filter(
          (user, idx, arr) => arr.findIndex((u) => u._id === user._id) === idx
        )
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      await axios.delete(`${API_BASE_URL}/auth/delete/${userId}`, {
        withCredentials: true,
      });
      toast.success('User deleted successfully');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-5xl mx-auto p-2 md:p-6"
    >
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <motion.div
            variants={fadeUp}
            custom={0}
            className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-zinc-900"
          >
            <Table hoverable className="min-w-[700px]">
              <TableHead>
                <TableRow className="bg-gradient-to-r from-blue-100 via-purple-50 to-purple-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Date Created
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    User Image
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Username
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Email
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Admin
                  </TableHeadCell>
                  <TableHeadCell className="text-xs md:text-sm font-bold uppercase tracking-wider py-3">
                    Delete
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {users.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        delay: idx * 0.07,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b dark:border-zinc-700 border-zinc-200 transition hover:bg-blue-50 dark:hover:bg-zinc-800 group"
                    >
                      <TableCell className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <img
                          src={user.profilePicture}
                          className="w-10 h-10 object-cover rounded-full border-2 border-blue-200 dark:border-zinc-700 shadow-sm group-hover:scale-105 transition-transform duration-200"
                          alt={user.username}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="min-w-[120px] md:min-w-[200px] block truncate font-semibold text-zinc-800 dark:text-zinc-100">
                          {user.username}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-zinc-700 dark:text-zinc-200">
                        <span className="block truncate">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <FaCheck
                            className="text-green-500 text-lg mx-auto"
                            title="Admin"
                          />
                        ) : (
                          <FaTimes
                            className="text-red-500 text-lg mx-auto"
                            title="Not Admin"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <motion.button
                          onClick={() => {
                            setShowModel(true);
                            setUserId(user._id);
                          }}
                          className="flex items-center gap-1 text-red-500 font-medium hover:underline hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
                          aria-label="Delete user"
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <MdDelete className="text-xl md:text-2xl" />
                          <span className="hidden md:inline">Delete</span>
                        </motion.button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
          {showMoreUsers && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleShowMore}
                className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold shadow-md hover:scale-105 hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Show More
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col items-center justify-center min-h-[200px]"
        >
          <h2 className="text-center font-semibold text-xl md:text-3xl text-zinc-700 dark:text-zinc-200 mb-2">
            There Is No User Available
          </h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            alt="No users"
            className="w-24 h-24 opacity-60"
          />
        </motion.div>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader>
          <span className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <MdDelete className="text-2xl" /> Delete User
          </span>
        </ModalHeader>
        <ModalBody className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-5"
          >
            <h2 className="text-base text-slate-700 dark:text-slate-200 tracking-wide font-semibold text-center">
              Are you sure you want to delete this user?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                className="transition-transform duration-150 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, Delete
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModel(false)}
                className="transition-transform duration-150 hover:scale-105"
                as={motion.button}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                No, Cancel
              </Button>
            </div>
          </motion.div>
        </ModalBody>
      </Modal>
    </motion.div>
  );
};

export default Users;
