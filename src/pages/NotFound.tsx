import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { use_theme } from "../context/ThemeContext";

interface Bird {
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  gap: number;
  passed: boolean;
}

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = use_theme();
  
  // Flappy Bird Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bird, setBird] = useState<Bird>({ y: 200, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // Nerdy jokes
  const nerdy_jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "404: Humor not found... just kidding! 😄",
    "There are only 10 types of people: those who understand binary and those who don't.",
    "Why did the developer go broke? Because they used up all their cache! 💰",
    "HTTP 404: This page has gone to /dev/null 🕳️",
    "I would tell you a UDP joke, but you might not get it.",
    "A SQL query goes into a bar, walks up to two tables and says 'Can I join you?'",
    "Why do Java developers wear glasses? Because they can't C# 👓"
  ];
  
  const [current_joke, setCurrentJoke] = useState(nerdy_jokes[0]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Rotate jokes every 5 seconds
    const joke_interval = setInterval(() => {
      setCurrentJoke(nerdy_jokes[Math.floor(Math.random() * nerdy_jokes.length)]);
    }, 5000);
    
    return () => clearInterval(joke_interval);
  }, [location.pathname]);

  // Flappy Bird Game Logic
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setBird({ y: 200, velocity: 0 });
    setPipes([{ x: 400, gap: 150, passed: false }]);
  };

  const jump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    if (gameOver) {
      startGame();
      return;
    }
    setBird(prev => ({ ...prev, velocity: -8 }));
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setBird({ y: 200, velocity: 0 });
    setPipes([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      setBird(prev => {
        const newY = prev.y + prev.velocity;
        const newVelocity = prev.velocity + 0.5; // gravity
        
        // Check bounds
        if (newY < 0 || newY > 360) {
          setGameOver(true);
          return prev;
        }
        
        return { y: newY, velocity: newVelocity };
      });

      setPipes(prev => {
        const newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - 3 }))
          .filter(pipe => pipe.x > -50);
        
        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 200) {
          newPipes.push({ x: 400, gap: 100 + Math.random() * 100, passed: false });
        }
        
        // Check collisions and scoring
        newPipes.forEach(pipe => {
          if (pipe.x < 50 && pipe.x > 0 && !pipe.passed) {
            // Check collision
            if (bird.y < pipe.gap - 50 || bird.y > pipe.gap + 50) {
              setGameOver(true);
            } else if (pipe.x < 25) {
              pipe.passed = true;
              setScore(s => s + 1);
            }
          }
        });
        
        return newPipes;
      });

      if (!gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, bird.y]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    }`}>
      <div className="text-center max-w-2xl px-4">
        {/* Animated 404 */}
        <h1 className="text-8xl font-bold mb-4 text-red-500 drop-shadow-lg animate-pulse">
          404
        </h1>
        
        {/* Error Message */}
        <div className="mb-8">
          <p className={`text-2xl mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Oops! This page took a detour to /dev/null
          </p>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            The page you're looking for doesn't exist, but hey, enjoy this mini game!
          </p>
        </div>

        {/* Nerdy Joke */}
        <div className={`mb-8 p-4 rounded-lg ${
          theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-800 border border-gray-700'
        }`}>
          <p className={`text-sm italic ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
            💡 {current_joke}
          </p>
        </div>

        {/* Flappy Bird Game */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            🎮 Mini Flappy Bird Game
          </h3>
          
          <div 
            ref={gameRef}
            className={`relative w-96 h-96 mx-auto border-2 rounded-lg cursor-pointer overflow-hidden ${
              theme === 'light' ? 'bg-sky-200 border-gray-300' : 'bg-gray-800 border-gray-600'
            }`}
            onClick={jump}
          >
            {/* Bird */}
            <div
              className="absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 transition-all duration-75"
              style={{
                left: '50px',
                top: `${bird.y}px`,
                transform: `rotate(${Math.min(bird.velocity * 3, 45)}deg)`
              }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
            </div>

            {/* Pipes */}
            {pipes.map((pipe, index) => (
              <div key={index}>
                {/* Top pipe */}
                <div
                  className="absolute bg-green-500 border-2 border-green-700"
                  style={{
                    left: `${pipe.x}px`,
                    top: '0px',
                    width: '50px',
                    height: `${pipe.gap - 50}px`
                  }}
                />
                {/* Bottom pipe */}
                <div
                  className="absolute bg-green-500 border-2 border-green-700"
                  style={{
                    left: `${pipe.x}px`,
                    top: `${pipe.gap + 50}px`,
                    width: '50px',
                    height: `${350 - pipe.gap}px`
                  }}
                />
              </div>
            ))}

            {/* Game UI */}
            <div className="absolute top-4 left-4">
              <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Score: {score}
              </div>
            </div>

            {/* Game Over / Start Screen */}
            {(!gameStarted || gameOver) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <div className="text-white text-center">
                  {gameOver ? (
                    <>
                      <h4 className="text-2xl font-bold mb-2">Game Over!</h4>
                      <p className="mb-4">Final Score: {score}</p>
                    </>
                  ) : (
                    <h4 className="text-2xl font-bold mb-4">Click or Press Space to Start!</h4>
                  )}
                  <button
                    onClick={jump}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    {gameOver ? 'Play Again' : 'Start Game'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Click the game area or press Space to jump!
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            🏠 Navigate Home
          </button>
          
          <button
            onClick={() => window.history.back()}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              theme === 'light'
                ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
