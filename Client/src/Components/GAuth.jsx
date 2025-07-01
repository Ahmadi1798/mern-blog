import { Button } from 'flowbite-react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/api';
const GAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post(
        `${API_BASE_URL}/auth/google`,
        {
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          image: resultFromGoogle.user.photoURL,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      if (res.status === 200) {
        const data = await res.data;
        dispatch(loginSuccess(data));
        navigate('/');
      }
    } catch (error) {
      let msg = error?.message || 'Google sign-in failed. Please try again.';
      toast.error(msg);
    }
  };
  return (
    <Button
      outline
      className="cursor-pointer w-full"
      type="button"
      color="gray"
      onClick={handleGoogleClick}
    >
      <FaGoogle className="mr-2" />
      Continue with Google
    </Button>
  );
};
export default GAuth;
