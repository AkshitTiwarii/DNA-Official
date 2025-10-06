import { ArrowLeft, Home, Trophy, Calendar, MapPin, Users, ExternalLink, Code, Award, Zap, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPublishedContent } from '@/lib/admin';
import { ContentItem } from '@/types/admin';

const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const data = await getPublishedContent('hackathon');
        setHackathons(data);
      } catch (error) {
        console.error('Error loading hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHackathons();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-white hover:bg-purple-400/20"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 text-cyan-400 hover:text-white hover:bg-cyan-400/20 rounded-md transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-400">DNA</span>
              <span className="text-xl text-muted-foreground">Hackathons</span>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/DNA-DEVELOPERS-DEV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-purple-400/50 text-purple-400 hover:bg-purple-400/20 rounded-md transition-colors"
              >
                <Trophy className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-400/30">
                <Trophy className="h-10 w-10 text-black" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Hackathon Events
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Competitive coding events, challenges, and innovation marathons for developers
            </p>

            <div className="inline-flex items-center gap-2 bg-purple-400/20 border border-purple-400 px-6 py-3 rounded-full">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold">Events Loading</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Why Join <span className="text-purple-400">DNA Hackathons</span>?
              </h2>
              <p className="text-xl text-muted-foreground">Code, compete, and conquer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Code,
                  title: "Innovation Challenges",
                  description: "Solve real-world problems with cutting-edge technology solutions",
                  color: "text-purple-400",
                  borderColor: "border-purple-400/30"
                },
                {
                  icon: Award,
                  title: "Prizes & Recognition",
                  description: "Win exciting prizes and gain recognition in the developer community",
                  color: "text-pink-400",
                  borderColor: "border-pink-400/30"
                },
                {
                  icon: Zap,
                  title: "Rapid Learning",
                  description: "Learn new technologies and frameworks in intensive coding sessions",
                  color: "text-red-400",
                  borderColor: "border-red-400/30"
                }
              ].map((benefit, index) => (
                <div key={index} className={`glass-card p-6 rounded-2xl border ${benefit.borderColor} hover:scale-105 transition-all duration-300`}>
                  <benefit.icon className={`h-12 w-12 ${benefit.color} mb-4`} />
                  <h3 className={`text-xl font-bold ${benefit.color} mb-3`}>{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Hackathons Section */}
          {hackathons.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Active <span className="text-purple-400">Hackathons</span>
                </h2>
                <p className="text-xl text-muted-foreground">Join these exciting coding competitions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="glass-card p-6 rounded-2xl border border-purple-400/30 hover:border-purple-400 hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">
                          {hackathon.title}
                        </h3>
                      </div>
                      {hackathon.featured && (
                        <div className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                          <span className="text-xs font-semibold text-yellow-400">Featured</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {hackathon.content}
                    </p>

                    {hackathon.prize && (
                      <div className="flex items-center gap-2 mb-3 text-green-400">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">Prize: {hackathon.prize}</span>
                      </div>
                    )}

                    {hackathon.deadline && (
                      <div className="flex items-center gap-2 mb-3 text-red-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Deadline: {new Date(hackathon.deadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    {hackathon.difficulty && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hackathon.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                          hackathon.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {hackathon.difficulty.charAt(0).toUpperCase() + hackathon.difficulty.slice(1)}
                        </div>
                      </div>
                    )}

                    {hackathon.tags && hackathon.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hackathon.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 rounded-full">
                            <Tag className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-gray-300">{tag}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {hackathon.external_url && (
                      <Button
                        className="w-full bg-purple-400 hover:bg-purple-500 text-black font-medium"
                        asChild
                      >
                        <a href={hackathon.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Register Now
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading hackathons...</p>
            </div>
          )}

          {/* Smart India Hackathon 2025 - Featured Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Featured <span className="text-blue-400">National Hackathon</span>
              </h2>
              <p className="text-xl text-muted-foreground">India's Premier Innovation Challenge</p>
            </div>

            {/* SIH 2025 Main Card */}
            <div className="glass-card p-8 rounded-3xl border-2 border-blue-400/50 hover:border-blue-400 bg-gradient-to-br from-blue-400/5 to-purple-400/5 mb-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400 to-transparent rounded-full transform -translate-x-48 translate-y-48"></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-blue-400 mb-1">Smart India Hackathon 2025</h3>
                        <p className="text-gray-400 text-sm">Ministry of Education, Govt. of India</p>
                      </div>
                      <div className="ml-auto">
                        <div className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full">
                          <span className="text-sm font-semibold text-red-400">🔥 LIVE</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      Smart India Hackathon (SIH) is a premier nationwide initiative designed to engage students in 
                      solving some of the most pressing challenges faced in everyday life. Join India's biggest 
                      open innovation movement and compete with the best talents across the country.
                    </p>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-400/10 rounded-xl border border-blue-400/20">
                        <div className="text-2xl font-bold text-blue-400">13,91,884</div>
                        <div className="text-xs text-gray-400">Students Participated</div>
                      </div>
                      <div className="text-center p-4 bg-purple-400/10 rounded-xl border border-purple-400/20">
                        <div className="text-2xl font-bold text-purple-400">6,497</div>
                        <div className="text-xs text-gray-400">Institutes</div>
                      </div>
                      <div className="text-center p-4 bg-green-400/10 rounded-xl border border-green-400/20">
                        <div className="text-2xl font-bold text-green-400">2,877</div>
                        <div className="text-xs text-gray-400">Problem Statements</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                        <div className="text-2xl font-bold text-yellow-400">133</div>
                        <div className="text-xs text-gray-400">Startups Created</div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-gray-300">Cash Prizes & Recognition</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-gray-300">Team-based Competition</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-300">All India Participation</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Code className="h-5 w-5 text-purple-400" />
                        <span className="text-sm text-gray-300">Real-world Problems</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <a href="https://sih.gov.in/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Visit Official Website
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black font-bold px-8 py-3 rounded-xl transition-all duration-300"
                        asChild
                      >
                        <a href="https://sih.gov.in/signin" target="_blank" rel="noopener noreferrer">
                          <Trophy className="h-5 w-5 mr-2" />
                          Register Now
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Right Content - Themes */}
                  <div className="w-full lg:w-80">
                    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-blue-400" />
                        Key Themes
                      </h4>
                      <div className="space-y-3">
                        {[
                          { name: "Fitness & Sports", icon: "🏃‍♂️" },
                          { name: "Space Technology", icon: "🚀" },
                          { name: "Heritage & Culture", icon: "🏛️" },
                          { name: "MedTech / BioTech", icon: "🏥" },
                          { name: "Smart Education", icon: "📚" },
                          { name: "Agriculture & Rural", icon: "🌾" },
                          { name: "Travel & Tourism", icon: "✈️" },
                          { name: "Disaster Management", icon: "🚨" }
                        ].map((theme, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 hover:bg-blue-400/10 rounded-lg transition-colors">
                            <span className="text-lg">{theme.icon}</span>
                            <span className="text-sm text-gray-300">{theme.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Statements Section */}
            <div className="glass-card p-8 rounded-2xl border border-gray-700 bg-gray-900/30">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Code className="h-6 w-6 text-green-400" />
                  SIH 2025 Problem Statements
                </h4>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-400">28</div>
                    <div className="text-xs text-gray-400">Hardware</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">73</div>
                    <div className="text-xs text-gray-400">Software</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-6">
                Explore real-world problem statements from various government ministries and organizations. 
                Choose from Software and Hardware categories across multiple domains.
              </p>

              {/* Sample Problem Statements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    title: "Smart Community Health Monitoring System",
                    org: "Ministry of Development of North Eastern Region",
                    category: "Software",
                    theme: "MedTech / BioTech / HealthTech",
                    psNumber: "SIH25001"
                  },
                  {
                    title: "Image-based Breed Recognition for Cattle",
                    org: "Ministry of Fisheries, Animal Husbandry & Dairying",
                    category: "Software", 
                    theme: "Agriculture, FoodTech & Rural Development",
                    psNumber: "SIH25004"
                  },
                  {
                    title: "Smart Tourist Safety Monitoring System",
                    org: "Ministry of Development of North Eastern Region",
                    category: "Software",
                    theme: "Travel & Tourism",
                    psNumber: "SIH25002"
                  },
                  {
                    title: "Low-Cost Smart Transportation Solution",
                    org: "Ministry of Development of North Eastern Region",
                    category: "Hardware",
                    theme: "Transportation & Logistics",
                    psNumber: "SIH25003"
                  }
                ].map((ps, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 hover:border-gray-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-white text-sm leading-tight">{ps.title}</h5>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ps.category === 'Software' ? 'bg-blue-400/20 text-blue-400' : 'bg-orange-400/20 text-orange-400'
                      }`}>
                        {ps.category}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{ps.org}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400">{ps.theme}</span>
                      <span className="text-xs text-gray-500 font-mono">{ps.psNumber}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-medium px-6 py-3 rounded-xl"
                  asChild
                >
                  <a href="https://www.sih.gov.in/sih2025PS" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Problem Statements
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Unstop Hackathons Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Popular <span className="text-cyan-400">Hackathons</span> on Unstop
              </h2>
              <p className="text-xl text-muted-foreground">Discover amazing coding competitions from top organizations</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-gray-400">Powered by</span>
                <a href="https://unstop.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Unstop.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "TechGig Code Gladiators",
                  organization: "TechGig",
                  description: "India's biggest coding competition with multiple rounds and exciting challenges for developers of all skill levels.",
                  prize: "₹5,00,000",
                  deadline: "2025-10-15",
                  difficulty: "intermediate",
                  tags: ["Java", "Python", "C++", "Web Development"],
                  featured: true,
                  registrationUrl: "https://unstop.com",
                  category: "Programming"
                },
                {
                  title: "Microsoft Imagine Cup",
                  organization: "Microsoft",
                  description: "Global student technology competition bringing together students from around the world to solve real-world problems.",
                  prize: "$100,000",
                  deadline: "2025-09-30",
                  difficulty: "advanced",
                  tags: ["AI/ML", "Cloud", "Mixed Reality", "IoT"],
                  featured: true,
                  registrationUrl: "https://unstop.com",
                  category: "Innovation"
                },
                {
                  title: "HackerEarth Deep Learning Challenge",
                  organization: "HackerEarth",
                  description: "Solve complex machine learning problems and showcase your AI expertise in this comprehensive challenge.",
                  prize: "₹3,00,000",
                  deadline: "2025-11-20",
                  difficulty: "advanced",
                  tags: ["Machine Learning", "Deep Learning", "AI", "Python"],
                  featured: false,
                  registrationUrl: "https://unstop.com",
                  category: "AI/ML"
                },
                {
                  title: "Google Developer Student Clubs Hack",
                  organization: "Google",
                  description: "Build innovative solutions using Google technologies and compete with developer communities worldwide.",
                  prize: "$50,000",
                  deadline: "2025-12-01",
                  difficulty: "intermediate",
                  tags: ["Android", "Firebase", "Google Cloud", "Flutter"],
                  featured: false,
                  registrationUrl: "https://unstop.com",
                  category: "Mobile/Web"
                },
                {
                  title: "Flipkart Grid Challenge",
                  organization: "Flipkart",
                  description: "E-commerce innovation challenge focusing on supply chain, customer experience, and technology solutions.",
                  prize: "₹10,00,000",
                  deadline: "2025-09-25",
                  difficulty: "intermediate",
                  tags: ["E-commerce", "Backend", "System Design", "Analytics"],
                  featured: true,
                  registrationUrl: "https://unstop.com",
                  category: "Industry"
                },
                {
                  title: "AWS DeepRacer Student Challenge", 
                  organization: "Amazon Web Services",
                  description: "Learn machine learning through autonomous racing. Build and train ML models to race virtual cars.",
                  prize: "$20,000",
                  deadline: "2025-10-30",
                  difficulty: "beginner",
                  tags: ["AWS", "Machine Learning", "Python", "Cloud"],
                  featured: false,
                  registrationUrl: "https://unstop.com",
                  category: "Cloud/ML"
                }
              ].map((hackathon, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl border border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background gradient for featured hackathons */}
                  {hackathon.featured && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 pointer-events-none"></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Code className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {hackathon.title}
                          </h3>
                          <p className="text-sm text-cyan-400 font-medium">{hackathon.organization}</p>
                        </div>
                      </div>
                      {hackathon.featured && (
                        <div className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                          <span className="text-xs font-semibold text-yellow-400">⭐ Popular</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {hackathon.description}
                    </p>

                    {/* Prize and Deadline */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-green-400">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">Prize: {hackathon.prize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Due: {new Date(hackathon.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Category and Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/30 rounded-full">
                        <span className="text-xs font-medium text-cyan-400">{hackathon.category}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hackathon.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                        hackathon.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {hackathon.difficulty.charAt(0).toUpperCase() + hackathon.difficulty.slice(1)}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hackathon.tags.slice(0, 3).map((tag, tagIndex) => (
                        <div key={tagIndex} className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 rounded-full">
                          <Tag className="h-3 w-3 text-cyan-400" />
                          <span className="text-xs text-gray-300">{tag}</span>
                        </div>
                      ))}
                      {hackathon.tags.length > 3 && (
                        <div className="px-2 py-1 bg-gray-700/50 rounded-full">
                          <span className="text-xs text-gray-400">+{hackathon.tags.length - 3} more</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
                      asChild
                    >
                      <a href={hackathon.registrationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Unstop
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Unstop CTA */}
            <div className="text-center mt-12">
              <div className="glass-card p-8 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-400/5">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">Discover More on Unstop</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Explore thousands of hackathons, competitions, internships, and job opportunities 
                  from top companies across various domains and skill levels.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-3"
                    asChild
                  >
                    <a href="https://unstop.com/hackathons" target="_blank" rel="noopener noreferrer">
                      <Code className="h-5 w-5 mr-2" />
                      Browse All Hackathons
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-8 py-3"
                    asChild
                  >
                    <a href="https://unstop.com/competitions" target="_blank" rel="noopener noreferrer">
                      <Trophy className="h-5 w-5 mr-2" />
                      View Competitions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center">
            <div className="glass-card p-12 rounded-2xl border border-purple-400/30">
              <h3 className="text-4xl font-bold mb-6 text-purple-400">
                🏆 More Hackathons Coming Soon
              </h3>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Get ready for intense coding competitions, innovative challenges, and the chance to 
                showcase your skills alongside the best developers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-black hover:from-purple-500 hover:to-pink-500 px-10 py-4 text-xl font-bold rounded-full shadow-lg shadow-purple-400/30 hover:shadow-purple-400/50 transition-all duration-300"
                  onClick={() => {
                    window.location.href = '/#contact';
                  }}
                >
                  Get Updates
                </Button>
                
                <Link
                  to="/opportunities"
                  className="inline-flex items-center border-2 border-purple-400/60 bg-black/40 backdrop-blur-sm text-purple-400 hover:bg-purple-400 hover:text-black hover:border-purple-400 px-8 py-4 text-lg font-semibold rounded-full shadow-lg shadow-purple-400/20 hover:shadow-purple-400/40 hover:scale-105 transition-all duration-300 group transform"
                >
                  View All Opportunities
                  <ExternalLink className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonsPage;
