import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Grid Dots Background */}
      <div className="absolute inset-0">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Grid dots pattern - more subtle */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px'
          }}
        />
        
        {/* Additional smaller dots for depth - very subtle */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(34, 197, 94, 0.15) 0.5px, transparent 0.5px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '30px 30px'
          }}
        />
        
        {/* Strong central content area - dark overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, transparent 0%, transparent 10%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.95) 70%, rgba(0, 0, 0, 1) 100%)`
          }}
        />
        
        {/* Enhanced top and bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90"></div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Content Background Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-2xl"></div>
        
        <div className="relative z-10 py-12">
          {/* Badge */}
          <div className={`inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-8 text-sm transition-all duration-1000 backdrop-blur-sm ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-400 font-medium">SYSTEM.ONLINE</span>
          </div>
          
          {/* Main Heading */}
          <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight relative">
                <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-flow relative drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(34, 197, 94, 0.3)' }}>
                  DNA FORGE HUB
                  {/* Sparkling effects */}
                  <span className="absolute -top-2 left-10 w-1 h-1 bg-white rounded-full animate-ping opacity-75"></span>
                  <span className="absolute -top-4 right-20 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-300"></span>
                  <span className="absolute top-8 left-32 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-500"></span>
                  <span className="absolute -top-1 right-10 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse delay-700"></span>
                  <span className="absolute top-6 left-56 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></span>
                  <span className="absolute -top-3 left-80 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-1200"></span>
                  
                  {/* Larger sparkle effects */}
                  <span className="absolute -top-6 left-40 w-2 h-2 bg-white rounded-full animate-bounce delay-200 opacity-60"></span>
                  <span className="absolute top-10 right-32 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-800 opacity-60"></span>
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-green-400 mb-6 tracking-wide font-medium" style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
              WHERE ELITE DEVELOPERS FORGE THE FUTURE
            </p>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              A minimalist development collective focused on building efficient, scalable, and 
              aesthetically clean digital solutions. We specialize in systems-level programming, 
              modern web architecture, and innovative user interfaces.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-black font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                asChild
              >
                <a href="https://chat.whatsapp.com/LOC5LAO9iDAD8S9OtygofA?mode=ac_t" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  Join Community
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-gray-500 bg-black/40 backdrop-blur-sm text-gray-200 hover:text-green-400 hover:border-green-400 hover:bg-green-500/10 text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg"
                asChild
              >
                <a href="/projects" className="flex items-center gap-3">
                  View Projects
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-black/70 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm font-medium">DNA FORGE AI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="/projects" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Projects</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


