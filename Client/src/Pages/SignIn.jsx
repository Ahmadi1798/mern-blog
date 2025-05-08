import axios from 'axios';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import signInImage from '../assets/images/log-in.png';
import { Form, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../Redux/user/userSlice';
import GAuth from '../Components/GAuth';
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
      dispatch(loginStart());
      const res = await axios.post('/api/v1/auth/login', formData);
      toast.success('Login Successful');
      const data = await res.data;
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message));
      toast.error(errorMessage || 'Something went wrong');
      console.log(errorMessage);
    }
  };
  return (
    <div className="mx-auto px-4 md:px-14  max-w-screen-2xl ">
      {/* flex Container */}
      <div className="flex flex-col items-center min-h-screen space-y-5 justify-center  md:flex-row md:space-y-0 md:space-x-5 gap-10 ">
        {/* left side */}
        <div className=" hidden md:block">
          <img src={signInImage} alt="signIn image" />
        </div>
        {/* right side */}

        <form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2 w-full md:px-6 md:w-1/2"
        >
          <h1 className="md:text-4xl text-2xl  font-bold text-center mb-4">
            Sign In
          </h1>
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
            disabled={loading}
            className="hover:bg-blue-500 hover:text-white font-bold
         text-blue-500 bg-white  py-2 rounded border-1  border-blue-500 cursor-pointer shadow-sm transition-all duration-300 mt-6 "
          >
            {loading ? (
              <>
                <Spinner size="sm"></Spinner>
                <span className="pl-3">Loading</span>
              </>
            ) : (
              'Log In'
            )}
          </button>
          <GAuth />
          <div className="flex space-x-3 items-center text-sm">
            <span className="">Don't have an account</span>

            <Link
              to="/sign-up"
              color="light"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
