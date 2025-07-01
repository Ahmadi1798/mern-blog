import {
  Button,
  FileInput,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logout,
} from '../Redux/user/userSlice';
import { toast } from 'react-toastify';
import { GoAlert } from 'react-icons/go';
import { FaRegUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [ImageURL, setImageURL] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const imageRef = useRef();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error('Please fill in the fields');
      return;
    }
    try {
      dispatch(updateStart());
      const { data } = await axios.put(
        `${API_BASE_URL}/users/${currentUser._id}`,
        formData
      );
      dispatch(updateSuccess(data.user));
      toast.success('Profile updated successfully');
    } catch (error) {
      dispatch(updateFailure());
      toast.error(error?.response?.data?.message || 'Error updating profile');
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const imageData = new FormData();
    imageData.append('image', file);
    imageData.append('folder', 'post_images');
    try {
      const { data } = await axios.post(`${API_BASE_URL}/upload`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await axios.put(`${API_BASE_URL}/users/${currentUser._id}`, {
        profilePicture: data.url,
      });
      dispatch(updateSuccess({ ...currentUser, profilePicture: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error uploading image');
    }
  };

  const handleDeleteAccount = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      await axios.delete(`${API_BASE_URL}/auth/delete/${currentUser._id}`, {
        withCredentials: true,
      });
      dispatch(deleteUserSuccess());
      toast.success('Successfully Deleted');
    } catch (error) {
      dispatch(deleteUserFailure());
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLogoutUser = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success('User logged out Successfully');
      dispatch(logout());
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full flex flex-col items-center py-10 px-2 min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-all duration-300"
    >
      <motion.h2
        variants={fadeUp}
        custom={0}
        className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300"
      >
        Profile
      </motion.h2>
      <FileInput
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        ref={imageRef}
      />
      <motion.form
        variants={fadeUp}
        custom={1}
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-8 max-w-lg w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8"
      >
        {/* Profile Image */}
        <motion.div
          variants={fadeUp}
          custom={2}
          className="w-32 h-32 rounded-full shadow-lg ring-4 ring-blue-500 cursor-pointer relative group transition-all duration-300 hover:ring-purple-500"
          onClick={() => {
            imageRef.current.click();
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          }}
        >
          <AnimatePresence>
            {ImageURL || currentUser.profilePicture ? (
              <motion.img
                key="profile-img"
                src={ImageURL || currentUser.profilePicture}
                className="rounded-full object-cover w-full h-full absolute bg-black group-hover:opacity-60 transition-all duration-300"
                alt="Profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                key="profile-icon"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                <FaRegUserCircle className="w-full h-full text-blue-400 dark:text-blue-700 p-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          >
            Change
          </motion.div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          custom={3}
          className="flex flex-col space-y-4 w-full"
        >
          <TextInput
            type="text"
            id="username"
            defaultValue={currentUser.username}
            className="w-full"
            onChange={handleInputChange}
            color="info"
            shadow
            autoComplete="off"
          />
          <TextInput
            type="email"
            id="email"
            defaultValue={currentUser.email}
            className="w-full"
            onChange={handleInputChange}
            color="info"
            shadow
            autoComplete="off"
          />
          <TextInput
            type="password"
            id="password"
            placeholder="********"
            className="w-full"
            onChange={handleInputChange}
            color="info"
            shadow
            autoComplete="off"
          />
          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex flex-col gap-2"
          >
            <Button
              type="submit"
              outline
              gradientDuoTone="purpleToBlue"
              className="cursor-pointer w-full text-sm font-semibold transition-all duration-200"
              disabled={loading}
              as={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
            {currentUser.isAdmin && (
              <Link to={'/create-post'}>
                <Button
                  className="cursor-pointer w-full text-sm font-semibold transition-all duration-200"
                  gradientDuoTone="purpleToPink"
                  type="button"
                  as={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Create Post
                </Button>
              </Link>
            )}
          </motion.div>
          <motion.div
            variants={fadeUp}
            custom={5}
            className="flex flex-row justify-between mt-2"
          >
            <button
              type="button"
              onClick={() => setShowModel(true)}
              className="text-xs capitalize text-red-600 cursor-pointer hover:underline hover:text-red-700 transition-all duration-200"
            >
              Delete Account
            </button>
            <button
              type="button"
              onClick={handleLogoutUser}
              className="text-xs capitalize text-red-600 cursor-pointer hover:underline hover:text-red-700 transition-all duration-200"
            >
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </motion.form>
      <AnimatePresence>
        {showModel && (
          <Modal show={showModel} onClose={() => setShowModel(false)}>
            <ModalHeader />
            <ModalBody>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex flex-row items-center space-x-2">
                  <GoAlert className="text-red-600 text-3xl" size={70} />
                </div>
                <h2 className="text-sm text-slate-600 tracking-wide font-semibold">
                  Are you sure you want to delete your account?
                </h2>
                <div className="flex flex-row space-x-4 mt-3">
                  <Button
                    color="red"
                    outline
                    onClick={handleDeleteAccount}
                    className="w-32"
                    as={motion.button}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    color="gray"
                    outline
                    onClick={() => {
                      setShowModel(false);
                    }}
                    className="w-32"
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
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
