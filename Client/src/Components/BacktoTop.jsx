import { useEffect, useState } from 'react';

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400 text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.15" />
        <path
          d="M14 20V8M14 8L8 14M14 8L20 14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
