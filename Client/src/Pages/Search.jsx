import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TextInput, Button, Select, Spinner } from 'flowbite-react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { value: 'uncategorized', label: 'Uncategorized' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'reactjs', label: 'React.js' },
  { value: 'nodejs', label: 'Node.js' },
];

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

const Search = () => {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'asc',
    category: 'uncategorized',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch posts when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get('searchTerm') || '';
    const sortFromURL = urlParams.get('sort') || '';
    const categoryFromURL = urlParams.get('category') || '';

    setSidebarData({
      searchTerm: searchTermFromURL,
      sort: sortFromURL || 'desc',
      category: categoryFromURL || 'uncategorized',
    });

    fetchPosts(searchTermFromURL, sortFromURL, categoryFromURL, 1, true);
    // eslint-disable-next-line
  }, [location.search]);

  // Fetch posts function
  const fetchPosts = async (
    searchTerm,
    sort,
    category,
    pageNum = 1,
    reset = false
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (sort) params.append('sort', sort);
      if (category) params.append('category', category);
      params.append('page', pageNum);

      const res = await axios.get(
        `${API_BASE_URL}/posts/getposts?${params.toString()}`
      );
      const data = Array.isArray(res.data.posts) ? res.data.posts : [];
      setPosts(reset ? data : [...posts, ...data]);
      setShowMore(data.length === 10);
      setPage(pageNum);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch posts');
      setPosts([]);
      setShowMore(false);
    }
    setLoading(false);
  };

  // Handle sidebar form submit
  const handleSidebarSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sidebarData.searchTerm)
      params.append('searchTerm', sidebarData.searchTerm);
    if (sidebarData.sort) params.append('sort', sidebarData.sort);
    if (sidebarData.category) params.append('category', sidebarData.category);
    window.history.replaceState(
      {},
      '',
      `${location.pathname}?${params.toString()}`
    );
    fetchPosts(
      sidebarData.searchTerm,
      sidebarData.sort,
      sidebarData.category,
      1,
      true
    );
  };

  // Handle show more
  const handleShowMore = () => {
    fetchPosts(
      sidebarData.searchTerm,
      sidebarData.sort,
      sidebarData.category,
      page + 1,
      false
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col md:flex-row gap-8 min-h-[80vh] px-4 py-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
    >
      {/* Sidebar */}
      <motion.aside
        variants={fadeUp}
        custom={0}
        className="w-full md:w-80 bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl p-6 mb-8 md:mb-0 flex-shrink-0"
      >
        <motion.form
          onSubmit={handleSidebarSubmit}
          className="flex flex-col gap-5"
          variants={containerVariants}
        >
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100"
          >
            Search Filters
          </motion.h2>
          <motion.div variants={fadeUp} custom={2}>
            <TextInput
              placeholder="Search posts..."
              value={sidebarData.searchTerm}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, searchTerm: e.target.value })
              }
              className="focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={3}>
            <Select
              value={sidebarData.sort}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, sort: e.target.value })
              }
              className="focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              as={motion.select}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </motion.div>
          <motion.div variants={fadeUp} custom={4}>
            <Select
              value={sidebarData.category}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, category: e.target.value })
              }
              className="focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              as={motion.select}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </motion.div>
          <motion.div variants={fadeUp} custom={5}>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-all duration-200"
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </Button>
          </motion.div>
        </motion.form>
      </motion.aside>
      {/* Search Results */}
      <motion.main
        variants={fadeUp}
        custom={6}
        className="flex-1 flex flex-col"
      >
        <motion.h2
          variants={fadeUp}
          custom={7}
          className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100"
        >
          Search Results
        </motion.h2>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center flex-1"
          >
            <Spinner size="xl" />
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center flex-1 text-zinc-500 dark:text-zinc-400"
          >
            No posts found.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {posts.map((post, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx + 8}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
                  }}
                  className="group bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  <Link
                    to={`/post/${post.slug}`}
                    className="overflow-hidden block"
                  >
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </Link>
                  <div className="flex-1 flex flex-col p-6">
                    {/* Category Badge */}
                    <span
                      className={`
                        self-start mb-2 px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          post.category === 'nextjs'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : post.category === 'reactjs'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : post.category === 'nodejs'
                            ? 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-200'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                        }
                        shadow transition-all duration-200 group-hover:scale-105
                      `}
                    >
                      {post.category?.charAt(0).toUpperCase() +
                        post.category?.slice(1)}
                    </span>
                    <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4 flex-1 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 transition-all duration-200 group-hover:bg-blue-200 group-hover:text-blue-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/post/${post.slug}`}
                      className="inline-block mt-auto px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-center"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {showMore && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={handleShowMore}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-all duration-200"
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Show More
            </Button>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default Search;
