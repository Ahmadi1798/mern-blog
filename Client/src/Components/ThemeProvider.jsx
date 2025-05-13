import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-neutral-200 min-h-screen">
        {children}
      </div>
    </div>
  );
};
export default ThemeProvider;
