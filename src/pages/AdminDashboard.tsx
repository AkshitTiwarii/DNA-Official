import { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/admin-context';
import { useUser } from '@/contexts/user-context';
import { getAdminStats } from '@/lib/admin';
import type { AdminStats } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Activity, 
  Plus, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import ContentManager from '@/components/admin/ContentManager';
import UserManager from '@/components/admin/UserManager';
import ContentEditor from '@/components/admin/ContentEditor';
import RoadmapImporter from '@/components/admin/RoadmapImporter';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading, hasPermission } = useAdmin();
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  const handleCreateContent = () => {
    setEditingContent(null);
    setShowContentEditor(true);
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setShowContentEditor(true);
  };

  const handleCloseEditor = () => {
    setShowContentEditor(false);
    setEditingContent(null);
  };

  if (userLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <Button asChild>
            <a href="/">Go Back Home</a>
          </Button>
        </div>
      </div>
    );
  }

  if (showContentEditor) {
    return (
      <ContentEditor
        content={editingContent}
        onClose={handleCloseEditor}
        onSave={(content) => {
          handleCloseEditor();
          // Refresh content list
          loadStats();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage content and users for DNA Forge Hub</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-400 text-green-400">
              {user.email}
            </Badge>
            <Button onClick={handleCreateContent} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
            {hasPermission('manage_users') && (
              <TabsTrigger value="users">Users</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Total Content
                    </CardTitle>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalContent}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Published
                    </CardTitle>
                    <Eye className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{stats.publishedContent}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Admin Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{stats.totalAdmins}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Recent Activity
                    </CardTitle>
                    <Activity className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">{stats.recentActivity}</div>
                    <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={handleCreateContent}
                    className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('content')}
                    className="bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Content
                  </Button>
                  {hasPermission('manage_users') && (
                    <Button 
                      onClick={() => setActiveTab('users')}
                      className="bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentManager onEdit={handleEditContent} />
          </TabsContent>

          <TabsContent value="roadmaps">
            <RoadmapImporter />
          </TabsContent>

          {hasPermission('manage_users') && (
            <TabsContent value="users">
              <UserManager />
            </TabsContent>
          )}

          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
