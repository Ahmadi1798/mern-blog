import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'flowbite-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import CTA from '../Components/CTA';
import CommentSection from '../Components/CommentSection';
import PostCard from '../Components/PostCard';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const PostPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/posts/getPosts?slug=${slug}`);
        setPost(res.data.posts[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await axios.get(`/api/v1/posts/getPosts?pageSize=3`);
        setRecentPosts(res.data.posts);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    fetchRecentPosts();
  }, []);

  useEffect(() => {
    if (post?.content) {
      Prism.highlightAll();
    }
  }, [post]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
      >
        <Spinner size="xl" className="animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col max-w-4xl w-full items-center mx-auto min-h-screen p-2 md:p-6
        bg-gradient-to-b from-blue-50 via-white to-purple-50
        dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900
        transition-all duration-300"
    >
      <motion.h1
        variants={fadeUp}
        custom={0}
        className="text-3xl md:text-5xl font-bold text-center mt-10 mb-2 p-2 max-w-2xl leading-tight tracking-tight text-zinc-900 dark:text-white transition-colors duration-200"
      >
        {post && post.title}
      </motion.h1>
      <motion.div
        variants={fadeUp}
        custom={1}
        className="flex flex-wrap gap-2 items-center justify-center mt-2"
      >
        <Link to={`/search?category=${post?.category}`}>
          <Button
            color="gray"
            pill
            outline
            size="xs"
            className="text-teal-600 border-teal-400 dark:border-teal-600 font-semibold cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-teal-50 dark:hover:bg-zinc-800"
          >
            {post?.category}
          </Button>
        </Link>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {post?.updatedAt && new Date(post?.updatedAt).toLocaleDateString()}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          • {((post?.content || '').length / 1000).toFixed(0)} min read
        </span>
      </motion.div>
      <AnimatePresence>
        {post?.image && (
          <motion.img
            key={post?.image}
            src={post?.image}
            alt={post?.title}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-8 mb-4 object-cover max-h-[400px] rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
        )}
      </AnimatePresence>
      <motion.div
        variants={fadeUp}
        custom={2}
        className="prose prose-zinc dark:prose-invert w-full max-w-none p-2 md:p-4 mt-4 mb-8 post-content transition-colors duration-200 bg-white/70 dark:bg-zinc-900/85 rounded-2xl"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></motion.div>
      <motion.div variants={fadeUp} custom={3} className="w-full">
        <CTA path={currentUser ? '/create-post' : '/sign-up'} />
        <motion.div variants={fadeUp} custom={4} className="my-8">
          <CommentSection postId={post?._id} />
        </motion.div>
        <motion.div
          variants={fadeUp}
          custom={5}
          className="flex flex-col items-center justify-center space-y-5 mt-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-800 dark:text-white mb-5">
            Recent Articles
          </h2>
          <div className="flex flex-col space-y-5 md:flex-row items-center md:space-y-0 md:space-x-5 w-full">
            <AnimatePresence>
              {recentPosts &&
                recentPosts.map((recentPost, i) => (
                  <motion.div
                    key={recentPost._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full md:w-72 transition-transform duration-200 hover:scale-[1.03]"
                  >
                    <PostCard post={recentPost} key={post._id} custom={i} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default PostPage;
