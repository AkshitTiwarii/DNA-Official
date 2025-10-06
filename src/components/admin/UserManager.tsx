import { useEffect, useState } from 'react';
import { getAllAdminUsers, addAdminUser, updateAdminUser, removeAdminUser } from '@/lib/admin';
import type { AdminUser } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const UserManager = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUserData, setNewUserData] = useState({
    email: '',
    role: 'editor' as 'admin' | 'moderator' | 'editor'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAdminUser(newUserData.email, newUserData.role);
      setNewUserData({ email: '', role: 'editor' });
      setShowAddDialog(false);
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleUpdateUser = async (user: AdminUser, updates: Partial<AdminUser>) => {
    try {
      await updateAdminUser(user.id, updates);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (confirm('Are you sure you want to remove this user from admin access?')) {
      try {
        await removeAdminUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Error removing user:', error);
        alert('Failed to remove user. Please try again.');
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500/20 text-red-400">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-500/20 text-blue-400">Moderator</Badge>;
      case 'editor':
        return <Badge className="bg-green-500/20 text-green-400">Editor</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
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
      {/* Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Users
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Admin User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="bg-black border-gray-700 text-white mt-1"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-gray-300">Role</Label>
                    <Select 
                      value={newUserData.role} 
                      onValueChange={(value: any) => setNewUserData({ ...newUserData, role: value })}
                    >
                      <SelectTrigger className="bg-black border-gray-700 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      Add User
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.email}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {getRoleBadge(user.role)}
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Added {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select 
                    value={user.role} 
                    onValueChange={(value: any) => handleUpdateUser(user, { role: value })}
                  >
                    <SelectTrigger className="bg-black border-gray-700 text-white w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveUser(user.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No admin users found.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Role Permissions Info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500/20 text-red-400">Admin</Badge>
              <span className="text-gray-300">Full access - can manage users, create, edit, and delete all content</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/20 text-blue-400">Moderator</Badge>
              <span className="text-gray-300">Can create, edit, and delete content but cannot manage users</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400">Editor</Badge>
              <span className="text-gray-300">Can create and edit content but cannot delete or manage users</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
