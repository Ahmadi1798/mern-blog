import { FileInput, Select, TextInput, Button } from 'flowbite-react';
import TextEditor from '../Components/TextEditor';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../utils/api';

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

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [postFormData, setPostFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/posts/getPosts?postId=${postId}`
        );
        setPostFormData(res.data.posts[0]);
        setImageUrl(res.data.posts[0].image);
        toast.success('Success');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    };
    fetchPost();
  }, [postId]);

  const handleImageUpload = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'post_images');
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(res.data.url);
      setPostFormData({ ...postFormData, image: res.data.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error uploading image');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/posts/updatePost/${postFormData._id}/${currentUser._id}`,
        postFormData
      );
      toast.success('Post Updated successfully');
      navigate(`/post/${res.data.slug}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
    setUpdating(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-10 flex items-center flex-col w-full bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 transition-all duration-300"
    >
      <motion.h1
        variants={fadeUp}
        custom={0}
        className="text-2xl md:text-4xl mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300"
      >
        Update Post
      </motion.h1>
      <motion.form
        variants={containerVariants}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden"
      >
        {/* Animated accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-full blur-3xl pointer-events-none animate-pulse"
        />
        <motion.div variants={fadeUp} custom={1}>
          <TextInput
            placeholder="Title"
            value={postFormData.title || ''}
            required
            type="text"
            onChange={(e) =>
              setPostFormData({ ...postFormData, title: e.target.value })
            }
            className="focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600 transition-all"
          />
        </motion.div>
        <motion.div variants={fadeUp} custom={2}>
          <Select
            value={postFormData.category || 'uncategorized'}
            onChange={(e) =>
              setPostFormData({ ...postFormData, category: e.target.value })
            }
            className="focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600 transition-all"
          >
            <option value="uncategorized">Select a Category</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
          </Select>
        </motion.div>
        <motion.div
          variants={fadeUp}
          custom={3}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <FileInput
            accept="image/*"
            type="file"
            className="w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            className="text-sm w-full md:w-auto cursor-pointer transition-transform duration-150 hover:scale-105"
            type="button"
            onClick={handleImageUpload}
            color="light"
            disabled={uploading}
            as={motion.button}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </motion.div>
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className="object-cover w-full max-h-64 rounded-xl shadow-md border border-blue-100 dark:border-zinc-800 transition-all duration-200"
            />
          </motion.div>
        )}
        <motion.div variants={fadeUp} custom={4}>
          <TextEditor
            value={postFormData.content || ''}
            onChange={(content) =>
              setPostFormData({ ...postFormData, content: content })
            }
          />
        </motion.div>
        <motion.div variants={fadeUp} custom={5}>
          <Button
            type="submit"
            color="blue"
            className="cursor-pointer font-semibold rounded-lg py-2 transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
            disabled={updating}
            as={motion.button}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default UpdatePost;
