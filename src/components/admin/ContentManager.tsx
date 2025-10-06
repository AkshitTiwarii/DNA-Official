import { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/admin-context';
import { getAllContent, deleteContent } from '@/lib/admin';
import type { ContentItem } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentManagerProps {
  onEdit: (content: ContentItem) => void;
}

const ContentManager = ({ onEdit }: ContentManagerProps) => {
  const { hasPermission } = useAdmin();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, typeFilter, statusFilter]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getAllContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...content];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredContent(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!hasPermission('delete')) {
      alert('You don\'t have permission to delete content.');
      return;
    }

    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
        loadContent();
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/20 text-green-400">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-500/20 text-gray-400">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      announcement: 'bg-blue-500/20 text-blue-400',
      note: 'bg-purple-500/20 text-purple-400',
      resource: 'bg-green-500/20 text-green-400',
      project: 'bg-orange-500/20 text-orange-400',
      event: 'bg-pink-500/20 text-pink-400',
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gray-700 text-white"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-black border-gray-700 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="roadmap">Roadmap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-black border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="grid gap-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    {item.featured && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {getTypeBadge(item.type)}
                    {getStatusBadge(item.status)}
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {item.content.substring(0, 150)}...
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {item.author_email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </div>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {item.status === 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {hasPermission('write') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item)}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {hasPermission('delete') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContent.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No content found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentManager;
