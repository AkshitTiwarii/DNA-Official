import { useState } from 'react';
import { useUser } from '@/contexts/user-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, User, Shield } from 'lucide-react';

const AdminSetupHelper = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Please log in to see admin setup instructions.</p>
        </CardContent>
      </Card>
    );
  }

  const sqlCommand = `INSERT INTO admin_users (id, email, role, is_active) 
VALUES ('${user.id}', '${user.email}', 'admin', true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-4">Admin Setup Helper</h1>
          <p className="text-gray-400">Follow these steps to set up your admin access</p>
        </div>

        <div className="grid gap-6">
          {/* Current User Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Current User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">User ID</Label>
                <Input
                  value={user.id}
                  readOnly
                  className="bg-black border-gray-700 text-white mt-1 font-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  value={user.email || ''}
                  readOnly
                  className="bg-black border-gray-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* SQL Command */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Make Yourself an Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-2 block">
                  Copy this SQL command and run it in your Supabase SQL Editor:
                </Label>
                <div className="relative">
                  <pre className="bg-black border border-gray-700 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
                    <code>{sqlCommand}</code>
                  </pre>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>
                  <strong>Run Database Setup:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to the SQL Editor</li>
                    <li>Copy and paste the contents of <code className="bg-gray-800 px-2 py-1 rounded">database-setup.sql</code></li>
                    <li>Execute the SQL to create tables and policies</li>
                  </ul>
                </li>
                <li>
                  <strong>Add Yourself as Admin:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>Copy the SQL command above</li>
                    <li>Paste it in the Supabase SQL Editor</li>
                    <li>Execute the command</li>
                  </ul>
                </li>
                <li>
                  <strong>Access Admin Panel:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>Refresh this page</li>
                    <li>Click on your profile avatar in the navigation</li>
                    <li>Select "Admin Panel" from the dropdown</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-400">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-yellow-200">
                <li>Make sure you have run the database setup SQL first</li>
                <li>You need admin access to Supabase to execute SQL commands</li>
                <li>Once you're an admin, you can invite other team members</li>
                <li>This page is only for initial setup - you won't need it again</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild className="bg-green-500 hover:bg-green-600">
              <a href="/admin">Go to Admin Panel</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupHelper;
