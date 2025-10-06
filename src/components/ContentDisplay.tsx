import { useEffect, useState } from 'react';
import { getContentByType, getFeaturedContent } from '@/lib/admin';
import type { ContentItem } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Star, 
  ArrowRight,
  Megaphone,
  FileText,
  Code,
  Calendar as CalendarIcon,
  BookOpen
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentDisplayProps {
  type?: 'announcement' | 'note' | 'resource' | 'project' | 'event' | 'featured';
  limit?: number;
  featured?: boolean;
  showTitle?: boolean;
  className?: string;
}

const ContentDisplay = ({ 
  type, 
  limit = 10, 
  featured = false, 
  showTitle = true, 
  className = '' 
}: ContentDisplayProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [type, featured]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let data: ContentItem[];
      
      if (featured || type === 'featured') {
        data = await getFeaturedContent();
      } else if (type) {
        data = await getContentByType(type);
      } else {
        // Get all published content by default
        const { getPublishedContent } = await import('@/lib/admin');
        data = await getPublishedContent();
      }
      
      setContent(data.slice(0, limit));
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'resource':
        return <BookOpen className="h-4 w-4" />;
      case 'project':
        return <Code className="h-4 w-4" />;
      case 'event':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (contentType: string) => {
    const colors = {
      announcement: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      note: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      resource: 'bg-green-500/20 text-green-400 border-green-500/30',
      project: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      event: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    };

    return (
      <Badge className={`${colors[contentType as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'} border`}>
        {getTypeIcon(contentType)}
        <span className="ml-1 capitalize">{contentType}</span>
      </Badge>
    );
  };

  const getTitle = () => {
    if (featured || type === 'featured') return 'Featured Content';
    if (type) return `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    return 'Latest Updates';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">{getTitle()}</h2>
        )}
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-6">{getTitle()}</h2>
        )}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">No content available at the moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          {content.length >= limit && (
            <Button variant="outline" className="text-green-400 border-green-400 hover:bg-green-400/10">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-6">
        {content.map((item) => (
          <Card key={item.id} className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                    {item.featured && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(item.type)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none mb-4">
                <p className="text-gray-300 leading-relaxed">
                  {item.content.length > 200 
                    ? `${item.content.substring(0, 200)}...` 
                    : item.content
                  }
                </p>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {item.author_email && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.author_email}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </div>
                </div>
                
                {item.content.length > 200 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-400 hover:text-green-300 p-0"
                  >
                    Read more
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;
