import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const LoadingScreen = ({ onComplete, duration = 2000 }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Loading Content */}
      <div className="text-center">
        {/* DNA Logo Animation */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-green-400/20 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-green-400 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-4 border-2 border-green-400/40 rounded-full"></div>
            <div 
              className="absolute inset-4 border-2 border-green-400 rounded-full border-b-transparent animate-spin"
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-400 font-mono text-lg font-bold">DNA</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2">
            DNA FORGE HUB
          </h1>
          <p className="text-green-400 font-mono text-sm tracking-widest">
            INITIALIZING.SYSTEM...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-xs font-mono text-green-400 mb-2">
            <span>LOADING</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-100 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-green-400/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="mt-6 h-6">
          <p className="text-xs font-mono text-gray-400 animate-pulse">
            {progress < 20 && "Loading components..."}
            {progress >= 20 && progress < 40 && "Establishing connections..."}
            {progress >= 40 && progress < 60 && "Fetching data..."}
            {progress >= 60 && progress < 80 && "Optimizing performance..."}
            {progress >= 80 && progress < 100 && "Almost ready..."}
            {progress >= 100 && "Welcome to DNA Forge Hub!"}
          </p>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
