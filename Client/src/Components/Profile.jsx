import { Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/user/userSlice';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [ImageURL, setImageURL] = useState(null);
  const imageRef = useRef();
  console.log('Current User:', currentUser);
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
      uploadImage(file);
    }
  };
  // useEffect(() => {
  //   if (ImageURL) {
  //     uploadImage();
  //   }
  // }, [ImageURL]);
  console.log('Current User ID:', currentUser._id);
  const uploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    console.log('Form Data:', formData);
    try {
      const { data } = await axios.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image Data:', data);
      await axios.put(
        `/api/v1/users/${currentUser._id}`,
        {
          profilePicture: data.url,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      dispatch(loginSuccess({ ...currentUser, profilePicture: data.url }));
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };
  return (
    <div className="container flex flex-col space-y-10 items-center mx-auto mt-36">
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
      <form className="flex flex-col items-center space-y-10 max-w-lg w-full px-10  ">
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
            defaultValue={currentUser.username}
            className="w-full"
          />
          <TextInput
            type="email"
            defaultValue={currentUser.email}
            className="w-full"
          />
          <TextInput
            type="password"
            placeholder="********"
            className="w-full"
          />
          <button
            className="hover:bg-blue-500 hover:text-white font-bold
         text-blue-500 bg-white  py-2 rounded border-1  border-blue-500 cursor-pointer shadow-sm transition-all duration-300 w-full mt-4 tracking-wide capitalize"
          >
            Update
          </button>
          <div className="flex flex-row justify-between">
            <button className="text-xs capitalize text-red-600 cursor-pointer  hover:underline hover:text-red-700">
              delete Account
            </button>
            <button className="text-xs capitalize text-red-600 cursor-pointer  hover:underline hover:text-red-700">
              sign out
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Profile;
