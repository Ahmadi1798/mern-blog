import axios from 'axios';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import signUpImage from '../assets/images/register.png';
import { Form, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import GAuth from '../Components/GAuth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/user/userSlice';
const SignUp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post('/api/v1/auth/register', formData);
      toast.success('Registration successful');
      setIsLoading(false);
      dispatch(loginSuccess(res.data));
      navigate('/sign-in');
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || 'Something went wrong');
      console.log(error);
    }
  };
  return (
    <div className="mx-auto px-4 md:px-14  max-w-screen-2xl ">
      {/* flex Container */}
      <div className="flex flex-col items-center min-h-screen space-y-5 justify-center  md:flex-row md:space-y-0 md:space-x-5 gap-10 ">
        {/* left side */}
        <div className=" hidden md:block">
          <img src={signUpImage} alt="signup image" />
        </div>
        {/* right side */}

        <form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2 w-full md:px-6 md:w-1/2"
        >
          <h1 className="md:text-4xl text-2xl  font-bold text-center mb-4">
            Sign Up
          </h1>
          <div>
            <Label>Name</Label>
            <TextInput
              type="text"
              name="username"
              placeholder="Enter your name"
              onChange={handleChange}
            ></TextInput>
          </div>
          <div>
            <Label>Email</Label>
            <TextInput
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            ></TextInput>
          </div>
          <div>
            <Label>Password</Label>
            <TextInput
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
            ></TextInput>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="hover:bg-blue-500 hover:text-white font-bold
         text-blue-500 bg-white  py-2 rounded border-1  border-blue-500 cursor-pointer shadow-sm transition-all duration-300 mt-6 "
          >
            {isLoading ? (
              <>
                <Spinner size="sm"></Spinner>
                <span className="pl-3">Loading</span>
              </>
            ) : (
              'Register'
            )}
          </button>
          <GAuth />
          <div className="flex space-x-3 items-center text-sm">
            <span className="">Have an account</span>

            <Link
              to="/sign-in"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
