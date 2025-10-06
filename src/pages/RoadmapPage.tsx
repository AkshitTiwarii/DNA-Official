import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, BarChart3, Users, BookOpen, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { roadmapData } from '@/data/roadmaps';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  completed?: boolean;
}

interface RoadmapDetails {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  category: string;
  url: string;
  estimatedTime: string;
  prerequisites: string[];
  steps: RoadmapStep[];
}

const RoadmapPage = () => {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState<RoadmapDetails | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roadmapId) {
      loadRoadmapDetails(roadmapId);
    }
  }, [roadmapId]);

  const loadRoadmapDetails = (id: string) => {
    // Find the roadmap in our data
    let foundRoadmap = null;
    
    Object.entries(roadmapData).forEach(([category, roadmaps]) => {
      const roadmapIndex = roadmaps.findIndex((r, index) => `roadmap-${category}-${index}` === id);
      if (roadmapIndex !== -1) {
        const baseRoadmap = roadmaps[roadmapIndex];
        foundRoadmap = {
          ...baseRoadmap,
          estimatedTime: getEstimatedTime(baseRoadmap.difficulty),
          prerequisites: getPrerequisites(baseRoadmap.title),
          steps: generateRoadmapSteps(baseRoadmap)
        };
      }
    });

    if (foundRoadmap) {
      setRoadmap(foundRoadmap);
    }
    setLoading(false);
  };

  const getEstimatedTime = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return '3-6 months';
      case 'intermediate': return '6-12 months';
      case 'advanced': return '12+ months';
      default: return '6-12 months';
    }
  };

  const getPrerequisites = (title: string): string[] => {
    const prereqMap: { [key: string]: string[] } = {
      'Frontend Developer': ['Basic HTML/CSS', 'Programming fundamentals'],
      'Backend Developer': ['Programming fundamentals', 'Basic understanding of web'],
      'DevOps Engineer': ['Linux basics', 'Programming fundamentals', 'Networking'],
      'Full Stack Developer': ['Programming fundamentals', 'Web development basics'],
      'AI Engineer': ['Mathematics', 'Programming (Python)', 'Statistics'],
      'Data Analyst': ['Mathematics', 'Basic programming', 'Statistics'],
      'Mobile Developer': ['Programming fundamentals', 'OOP concepts'],
      'Game Developer': ['Programming fundamentals', 'Mathematics', 'Graphics basics'],
      'Cybersecurity Expert': ['Networking', 'Operating Systems', 'Programming'],
      'Blockchain Developer': ['Programming', 'Cryptography basics', 'Web development']
    };
    
    return prereqMap[title] || ['Programming fundamentals'];
  };

  const generateRoadmapSteps = (roadmap: any): RoadmapStep[] => {
    const stepTemplates: { [key: string]: RoadmapStep[] } = {
      'Frontend Developer': [
        {
          id: 'html-css',
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the building blocks of web development',
          skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
          resources: ['MDN Web Docs', 'CSS Tricks', 'Flexbox Froggy']
        },
        {
          id: 'javascript',
          title: 'JavaScript Mastery',
          description: 'Master modern JavaScript and ES6+ features',
          skills: ['ES6+', 'DOM Manipulation', 'Async/Await', 'Promises', 'Modules'],
          resources: ['JavaScript.info', 'You Don\'t Know JS', 'MDN JavaScript Guide']
        },
        {
          id: 'version-control',
          title: 'Version Control',
          description: 'Learn Git and collaborative development',
          skills: ['Git', 'GitHub', 'Branching', 'Merging', 'Pull Requests'],
          resources: ['Pro Git Book', 'GitHub Learning Lab', 'Atlassian Git Tutorials']
        },
        {
          id: 'frontend-framework',
          title: 'Frontend Framework',
          description: 'Master a modern frontend framework',
          skills: ['React/Vue/Angular', 'Component Architecture', 'State Management', 'Routing'],
          resources: ['Official Documentation', 'Framework Tutorials', 'Community Guides']
        },
        {
          id: 'build-tools',
          title: 'Build Tools & Workflow',
          description: 'Learn modern development tools and workflows',
          skills: ['Webpack/Vite', 'NPM/Yarn', 'Linting', 'Testing', 'CI/CD'],
          resources: ['Webpack Docs', 'Vite Guide', 'Jest Documentation']
        }
      ],
      'Backend Developer': [
        {
          id: 'programming-language',
          title: 'Programming Language',
          description: 'Master a backend programming language',
          skills: ['Node.js/Python/Java', 'OOP', 'Data Structures', 'Algorithms'],
          resources: ['Language Documentation', 'Coding Practice Sites', 'Books']
        },
        {
          id: 'databases',
          title: 'Database Management',
          description: 'Learn database design and management',
          skills: ['SQL', 'PostgreSQL/MySQL', 'NoSQL', 'Database Design', 'Optimization'],
          resources: ['SQL Tutorial', 'Database Design Course', 'PostgreSQL Docs']
        },
        {
          id: 'api-development',
          title: 'API Development',
          description: 'Build robust APIs and web services',
          skills: ['REST APIs', 'GraphQL', 'Authentication', 'Documentation', 'Testing'],
          resources: ['REST API Tutorial', 'GraphQL Guide', 'Postman Learning']
        },
        {
          id: 'server-deployment',
          title: 'Server & Deployment',
          description: 'Deploy and manage applications in production',
          skills: ['Linux', 'Docker', 'Cloud Platforms', 'Monitoring', 'Security'],
          resources: ['AWS/GCP/Azure Docs', 'Docker Tutorial', 'DevOps Guides']
        }
      ]
    };

    return stepTemplates[roadmap.title] || [
      {
        id: 'fundamentals',
        title: 'Fundamentals',
        description: 'Learn the core concepts and basics',
        skills: roadmap.tags.slice(0, 3),
        resources: ['Official Documentation', 'Online Courses', 'Community Resources']
      },
      {
        id: 'intermediate',
        title: 'Intermediate Concepts',
        description: 'Build on the fundamentals with more advanced topics',
        skills: roadmap.tags.slice(3, 6),
        resources: ['Advanced Tutorials', 'Project-based Learning', 'Best Practices']
      },
      {
        id: 'advanced',
        title: 'Advanced Topics',
        description: 'Master advanced concepts and real-world applications',
        skills: roadmap.tags.slice(6),
        resources: ['Expert Resources', 'Open Source Projects', 'Industry Standards']
      }
    ];
  };

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getProgressPercentage = () => {
    if (!roadmap) return 0;
    return (completedSteps.size / roadmap.steps.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Roadmap Not Found</h1>
          <p className="text-gray-400 mb-8">The requested roadmap could not be found.</p>
          <Link to="/content">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/content">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Content
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className={`${getDifficultyColor(roadmap.difficulty)} text-white`}>
                {roadmap.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {roadmap.estimatedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Roadmap Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {roadmap.title}
          </h1>
          <p className="text-xl text-gray-300 mb-6">{roadmap.description}</p>
          
          {/* Progress Bar */}
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Your Progress</span>
                <span className="text-sm text-cyan-400">{completedSteps.size}/{roadmap.steps.length} steps</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-xs text-gray-400 mt-2">{Math.round(getProgressPercentage())}% complete</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {roadmap.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Prerequisites */}
          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {roadmap.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-cyan-400" />
            Learning Path
          </h2>
          
          {roadmap.steps.map((step, index) => (
            <Card key={step.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleStepCompletion(step.id)}
                      className="mt-1 focus:outline-none"
                    >
                      {completedSteps.has(step.id) ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-500 hover:text-gray-300" />
                      )}
                    </button>
                    <div>
                      <CardTitle className={`text-lg ${completedSteps.has(step.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                        Step {index + 1}: {step.title}
                      </CardTitle>
                      <p className="text-gray-300 mt-1">{step.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-cyan-600 text-cyan-400">
                    Step {index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-green-900/50 text-green-300 border-green-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Learning Resources
                    </h4>
                    <ul className="space-y-1">
                      {step.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="text-sm text-gray-300 flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 text-blue-400" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Ready to Start Your Journey?</h3>
              <p className="text-gray-300 mb-6">
                This roadmap provides a structured path to becoming a {roadmap.title.toLowerCase()}. 
                Track your progress and stay motivated!
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => window.open(roadmap.url, '_blank')}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original on Roadmap.sh
                </Button>
                <Link to="/content">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Explore More Roadmaps
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
