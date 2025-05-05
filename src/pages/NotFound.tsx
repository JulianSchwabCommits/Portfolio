import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { use_theme } from "../context/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = use_theme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'light'
        ? 'bg-gradient-to-b from-gray-50 to-white'
        : 'bg-black text-white'
    }`}
    style={{
      backgroundColor: theme === 'light' ? '' : '#000'
    }}>
      <div className={`max-w-md w-full ${
        theme === 'light'
          ? 'bg-white shadow-none'
          : 'bg-black'
      } rounded-lg p-8 text-center`}
      style={{
        backgroundColor: theme === 'light' ? '' : '#000',
        boxShadow: 'none'
      }}>
        <div className={`w-32 h-32 flex items-center justify-center mx-auto mb-6 ${
          theme === 'light'
            ? 'bg-red-50'
            : 'bg-red-900/20'
        } rounded-full`}>
          <span className={`text-7xl font-bold ${
            theme === 'light'
              ? 'text-red-500'
              : 'text-red-300'
          }`}>404</span>
        </div>
        <h1 className={`text-3xl font-bold mb-3 ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>Page Not Found</h1>
        <p className={`${
          theme === 'light'
            ? 'text-gray-600'
            : 'text-gray-300'
        } mb-8 text-lg`}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          to="/" 
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${
            theme === 'light'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 hover:bg-blue-500'
          } text-white font-medium rounded-lg transition-colors shadow-md`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
