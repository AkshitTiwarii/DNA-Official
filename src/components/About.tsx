import { Terminal, Database, Code, Cpu, Users, Zap, Github, Globe, BookOpen, Trophy, Rocket, Heart, Calendar, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-mono text-sm text-green-400 tracking-widest">SYSTEM.ABOUT</span>
          </div>
          
          <h2 className="text-3xl md:text-6xl font-mono font-black mb-8 tracking-wider">
            <span className="gradient-text">DNA FORGE HUB</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed mb-8">
            We are <strong className="text-green-400">DNA Forge Hub</strong> - a dynamic community of passionate developers, 
            innovators, and tech enthusiasts united by our love for code and cutting-edge technology. 
            Born from the vision of creating exceptional digital experiences, we've grown into a 
            thriving ecosystem where creativity meets functionality.
          </p>

          <p className="text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our collective spans across diverse domains - from full-stack web development and mobile apps 
            to AI/ML, blockchain, and emerging technologies. We don't just build software; 
            we craft digital solutions that make a difference.
          </p>
        </div>

        <div className="mt-8 glass-card p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-mono text-sm text-white">BUILT.WITH.PASSION</span>
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            More than just a development group, we're a family of tech enthusiasts who believe 
            in the power of collaboration, continuous learning, and making technology accessible to everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;