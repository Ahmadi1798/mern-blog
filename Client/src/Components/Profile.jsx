import {
  Button,
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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

import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
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
  // useEffect(() => {
  //   if (ImageURL) {
  //     uploadImage();
  //   }
  // }, [ImageURL]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };
  console.log('Current User ID:', currentUser._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error('Please fill in the fields');
      return;
    }
    try {
      dispatch(updateStart());
      const { data } = await axios.put(
        `/api/v1/users/${currentUser._id}`,
        formData
      );
      dispatch(updateSuccess(data.user));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch(updateFailure());
      toast.error(error?.response?.data?.message || 'Error updating profile');
    }
    if (error) {
      toast.error(error);
    }
  };
  const uploadImage = async (file) => {
    if (!file) return;
    const imageData = new FormData();
    imageData.append('image', file);
    try {
      const { data } = await axios.post('/api/v1/upload', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image Data:', data);
      await axios.put(`/api/v1/users/${currentUser._id}`, {
        profilePicture: data.url,
      });
      dispatch(updateSuccess({ ...currentUser, profilePicture: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error?.response?.data?.message || 'Error uploading image');
    }
  };
  const handleDeleteAccount = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/v1/auth/delete/${currentUser._id}`);
      dispatch(deleteUserSuccess());
      toast.success('Successfully Deleted');
    } catch (error) {
      dispatch(deleteUserFailure());
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLogoutUser = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      toast.success('User logged out Successfully');
      dispatch(logout());
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-10 items-center mt-30 pb-10">
      <h2 className="text-2xl md:text-4xl tracking-wide font-semibold">
        Profile
      </h2>
      <FileInput
        typeof="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden w-60"
        ref={imageRef}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-10 max-w-lg w-full px-10  "
      >
        {/* Overlay */}

        {/* Profile Image */}
        <div
          className="w-32 h-32 rounded-full shadow-md ring-4 ring-blue-500 cursor-pointer relative   "
          onClick={() => {
            imageRef.current.click();
          }}
        >
          <img
            src={ImageURL || currentUser.profilePicture}
            className="rounded-full object-cover w-full h-full absolute bg-black hover:opacity-60"
            alt=""
          />
        </div>
        <div className="flex flex-col space-y-4 w-full">
          <TextInput
            type="text"
            id="username"
            defaultValue={currentUser.username}
            className="w-full"
            onChange={handleInputChange}
          />
          <TextInput
            type="email"
            id="email"
            defaultValue={currentUser.email}
            className="w-full"
            onChange={handleInputChange}
          />
          <TextInput
            type="password"
            id="password"
            placeholder="********"
            className="w-full"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            outline
            className="cursor-pointer w-full text-sm"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          {currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button className="cursor-pointer w-full text-sm" type="button">
                Create Post
              </Button>
            </Link>
          )}
          <div className="flex flex-row justify-between">
            <button
              type="button"
              onClick={() => setShowModel(true)}
              className="text-xs capitalize text-red-600 cursor-pointer  hover:underline hover:text-red-700"
            >
              delete Account
            </button>
            <button
              type="button"
              onClick={handleLogoutUser}
              className="text-xs capitalize text-red-600 cursor-pointer  hover:underline hover:text-red-700"
            >
              sign out
            </button>
          </div>
        </div>
      </form>
      <Modal show={showModel} onClose={() => setShowModel(false)}>
        <ModalHeader />
        <ModalBody>
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row items-center space-x-2">
              <GoAlert className="text-red-600 text-3xl" size={70} />
            </div>
            <h2 className="text-sm text-slate-600  tracking-wide font-semibold">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex flex-row space-x-4 mt-3">
              <Button
                color="red"
                outline
                onClick={handleDeleteAccount}
                className="w-32"
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
export default Profile;
