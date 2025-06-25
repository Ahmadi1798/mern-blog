import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const PostCard = ({ post, custom = 0 }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      custom={custom}
      whileHover={{
        scale: 1.04,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 max-w-2xl w-full"
    >
      <Link to={`/post/${post.slug}`} className="block overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-block px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 transition-colors duration-300 group-hover:bg-blue-200 group-hover:text-blue-900"
          >
            {post.category}
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
          >
            {post.title}
          </motion.h3>
        </div>
        <div className="mt-4">
          <Link to={`/post/${post.slug}`}>
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <Button
                color="blue"
                pill
                className="w-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer"
              >
                Read More
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
      {/* Overlay effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></motion.div>
    </motion.div>
  );
};

export default PostCard;
