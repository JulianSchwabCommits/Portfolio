import { useNavigate } from "react-router-dom";
import { use_theme } from "../context/ThemeContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = use_theme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-black'
    }`}>      <div className="text-center">
        {/* Animated 404 with red color */}
        <h1 className="text-8xl font-bold mb-8 text-red-500 drop-shadow-lg animate-pulse">
          404
        </h1>
          {/* Navigate Home Button - Styled like navigation bar in image */}        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-full bg-black text-white font-medium transition-all duration-300 hover:bg-[#e5e7eb] hover:text-black border border-gray-700 shadow-lg"
        >
          Navigate Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
