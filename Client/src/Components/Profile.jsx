import { Button, Label, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="container flex flex-col space-y-10 items-center mx-auto mt-36">
      <h2 className="text-2xl md:text-4xl tracking-wide font-semibold">
        Profile
      </h2>
      <form className="flex flex-col items-center space-y-10 max-w-lg w-full px-10 md:px-0">
        <div className="w-32 h-32 rounded-full shadow-md ring-4 ring-blue-500">
          <img
            src={currentUser.profilePicture}
            className="rounded-full object-cover w-full"
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
