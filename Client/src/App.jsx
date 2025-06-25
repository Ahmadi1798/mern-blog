import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import Projects from './Pages/Projects';
import FooterComponent from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';
import AdminPrivateRoute from './Components/AdminPrivateRoute';
import CreatePost from './Pages/CreatePost';
import UpdatePost from './Pages/UpdatePost';
import PostPage from './Pages/PostPage';
import ScrollToTop from './Components/ScrollToTop';
import BackToTop from './Components/BackToTop';
import Contact from './Pages/Contact';
import ForgotPassword from './Components/ForgotPassword';
import VerifyEmailNotice from './Components/verifyEmailNotice';
import Search from './Pages/Search';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <BackToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/upddatepost/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:slug" element={<PostPage />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
};
export default App;
