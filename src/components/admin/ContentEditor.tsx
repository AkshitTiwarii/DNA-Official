import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { createContent, updateContent } from '@/lib/admin';
import type { ContentItem, CreateContentItem } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Save, Eye, FileText } from 'lucide-react';

interface ContentEditorProps {
  content?: ContentItem | null;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
}

const ContentEditor = ({ content, onClose, onSave }: ContentEditorProps) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<CreateContentItem>({
    title: '',
    content: '',
    type: 'announcement',
    status: 'draft',
    tags: [],
    featured: false,
    external_url: '',
    difficulty: '',
    deadline: '',
    prize: '',
    company: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        content: content.content,
        type: content.type,
        status: content.status,
        tags: content.tags || [],
        featured: content.featured,
        external_url: content.external_url || '',
        difficulty: content.difficulty || '',
        deadline: content.deadline || '',
        prize: content.prize || '',
        company: content.company || '',
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let result: ContentItem;
      
      if (content) {
        // Update existing content
        result = await updateContent({ id: content.id, ...formData });
      } else {
        // Create new content
        result = await createContent(formData, user.id);
      }
      
      onSave(result);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-400" />
            <h1 className="text-2xl font-bold text-white">
              {content ? 'Edit Content' : 'Create New Content'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="border-gray-600 text-gray-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        {preview ? (
          // Preview Mode
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{formData.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="capitalize">{formData.type}</span>
                <span>•</span>
                <span className="capitalize">{formData.status}</span>
                {formData.featured && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-400">Featured</span>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300">
                  {formData.content}
                </div>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Content Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-black border-gray-700 text-white mt-1"
                        placeholder="Enter content title..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-gray-300">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="bg-black border-gray-700 text-white mt-1 min-h-[300px]"
                        placeholder="Enter your content here..."
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-black border-gray-700 text-white"
                        placeholder="Add tags..."
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-md flex items-center gap-2"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="type" className="text-gray-300">Content Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="bg-black border-gray-700 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger className="bg-black border-gray-700 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional fields based on content type */}
                    {(formData.type === 'pdf' || formData.type === 'video' || formData.type === 'roadmap' || formData.type === 'hackathon' || formData.type === 'opportunity') && (
                      <div>
                        <Label htmlFor="external_url" className="text-gray-300">
                          {formData.type === 'pdf' && 'PDF URL'}
                          {formData.type === 'video' && 'Video URL'}
                          {formData.type === 'roadmap' && 'Roadmap URL'}
                          {(formData.type === 'hackathon' || formData.type === 'opportunity') && 'Registration/Application URL'}
                        </Label>
                        <Input
                          id="external_url"
                          placeholder={`Enter ${formData.type} URL...`}
                          value={formData.external_url}
                          onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                          className="bg-black border-gray-700 text-white mt-1"
                        />
                      </div>
                    )}

                    {(formData.type === 'hackathon' || formData.type === 'opportunity') && (
                      <>
                        <div>
                          <Label htmlFor="difficulty" className="text-gray-300">Difficulty Level</Label>
                          <Select 
                            value={formData.difficulty} 
                            onValueChange={(value: string) => setFormData({ ...formData, difficulty: value })}
                          >
                            <SelectTrigger className="bg-black border-gray-700 text-white mt-1">
                              <SelectValue placeholder="Select difficulty..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="deadline" className="text-gray-300">
                            {formData.type === 'hackathon' ? 'Submission Deadline' : 'Application Deadline'}
                          </Label>
                          <Input
                            id="deadline"
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="bg-black border-gray-700 text-white mt-1"
                          />
                        </div>
                      </>
                    )}

                    {formData.type === 'hackathon' && (
                      <div>
                        <Label htmlFor="prize" className="text-gray-300">Prize Information</Label>
                        <Input
                          id="prize"
                          placeholder="e.g., $5000 First Prize, $2000 Second Prize"
                          value={formData.prize}
                          onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                          className="bg-black border-gray-700 text-white mt-1"
                        />
                      </div>
                    )}

                    {formData.type === 'opportunity' && (
                      <div>
                        <Label htmlFor="company" className="text-gray-300">Company Name</Label>
                        <Input
                          id="company"
                          placeholder="Enter company name..."
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="bg-black border-gray-700 text-white mt-1"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured" className="text-gray-300">Featured Content</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : content ? 'Update Content' : 'Create Content'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
