import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import blogPost from '../assets/images/blog-post.jpg';

const CTA = ({
  title = 'Ready to share your story?',
  description = 'Join our community and start blogging today!',
  buttonText = 'Get Started',
  path,
  onClick,
  className = '',
}) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <section
      className={`w-full rounded-lg px-10 py-10 shadow-md transition-colors duration-300 ${
        theme === 'dark'
          ? ' bg-gradient-to-b from-neutral-950 to-neutral-800 text-zinc-100'
          : ' bg-gradient-to-b from-neutral-50 to-neutral-400 text-zinc-900'
      } ${className}`}
    >
      <div className="flex flex-col space-y-10 items-center  md:flex-row md:space-y-0 justify-center space-x-10">
        <div className="flex flex-col items-center md:items-start ">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
            {title}
          </h2>
          <p className="text-md md:text-xl mb-6 text-center">{description}</p>
          {path ? (
            <Link to={path}>
              <button
                className={`px-6 py-2 rounded-md cursor-pointer font-semibold transition-colors duration-200 shadow ${
                  theme === 'dark'
                    ? 'bg-blue-700 hover:bg-blue-800 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {buttonText}
              </button>
            </Link>
          ) : (
            <button
              onClick={onClick}
              className={`px-6 py-2 rounded-md cursor-pointer font-semibold transition-colors duration-200 shadow ${
                theme === 'dark'
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {buttonText}
            </button>
          )}
        </div>
        <img
          src={blogPost}
          className="w-96  object-cover rounded-2xl shadow-2xl"
          alt=""
        />
      </div>
    </section>
  );
};

export default CTA;
