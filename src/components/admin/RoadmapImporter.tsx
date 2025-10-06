import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { useAdmin } from '@/contexts/admin-context';
import { 
  importRoadmapsToAdmin, 
  importRoadmapsByCategory, 
  getRoadmapImportStats 
} from '@/lib/roadmap-importer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Map, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Loader2,
  ExternalLink,
  Globe
} from 'lucide-react';

const RoadmapImporter = () => {
  const { user } = useUser();
  const { hasPermission } = useAdmin();
  const { toast } = useToast();
  
  const [importing, setImporting] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [importResults, setImportResults] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const importStats = await getRoadmapImportStats();
      setStats(importStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error",
        description: "Failed to load import statistics",
        variant: "destructive"
      });
    }
  };

  const handleImportAll = async () => {
    if (!user?.id || !hasPermission('write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to import roadmaps",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const result = await importRoadmapsToAdmin(user.id);
      setImportResults(result);
      
      if (result.success > 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.success} roadmaps`,
        });
      }

      if (result.failed > 0) {
        toast({
          title: "Partial Import",
          description: `${result.failed} roadmaps failed to import`,
          variant: "destructive"
        });
      }

      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportByCategory = async (category: 'role-based' | 'skill-based' | 'best-practices') => {
    if (!user?.id || !hasPermission('write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to import roadmaps",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const result = await importRoadmapsByCategory(user.id, category);
      setImportResults(result);
      
      if (result.success > 0) {
        toast({
          title: "Category Import Successful",
          description: `Successfully imported ${result.success} ${category} roadmaps`,
        });
      }

      await loadStats(); // Refresh stats
    } catch (error) {
      console.error('Category import error:', error);
      toast({
        title: "Import Failed",
        description: `Failed to import ${category} roadmaps`,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  if (!hasPermission('write')) {
    return (
      <Card className="bg-black/50 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>You don't have permission to import roadmaps.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Map className="h-6 w-6" />
            Roadmap.sh Integration
          </CardTitle>
          <p className="text-gray-400">
            Import comprehensive learning roadmaps from roadmap.sh directly into your content management system.
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card className="bg-black/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5" />
              Import Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 border border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{stats.totalAvailable}</div>
                <div className="text-sm text-gray-400">Total Available</div>
              </div>
              <div className="text-center p-4 border border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{stats.totalImported}</div>
                <div className="text-sm text-gray-400">Already Imported</div>
              </div>
              <div className="text-center p-4 border border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{stats.remainingToImport}</div>
                <div className="text-sm text-gray-400">Remaining</div>
              </div>
              <div className="text-center p-4 border border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round((stats.totalImported / stats.totalAvailable) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Import Progress</span>
                <span>{stats.totalImported} / {stats.totalAvailable}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.totalImported / stats.totalAvailable) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-lg font-semibold text-white">{stats.categories['role-based']}</div>
                <div className="text-xs text-gray-400">Role-based Roadmaps</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-lg font-semibold text-white">{stats.categories['skill-based']}</div>
                <div className="text-xs text-gray-400">Skill-based Roadmaps</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-lg font-semibold text-white">{stats.categories['best-practices']}</div>
                <div className="text-xs text-gray-400">Best Practices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Actions */}
      <Card className="bg-black/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Import Options</CardTitle>
          <p className="text-gray-400">
            Choose how you want to import roadmaps from roadmap.sh
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import All */}
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white mb-1">Import All Roadmaps</h4>
                <p className="text-sm text-gray-400">
                  Import all available roadmaps from roadmap.sh including role-based, skill-based, and best practices.
                </p>
              </div>
              <Button
                onClick={handleImportAll}
                disabled={importing}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Import All
              </Button>
            </div>
          </div>

          {/* Import by Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Role-based</h4>
              <p className="text-xs text-gray-400 mb-3">
                Career-focused roadmaps like Frontend, Backend, DevOps, etc.
              </p>
              <Button
                onClick={() => handleImportByCategory('role-based')}
                disabled={importing}
                size="sm"
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Import Roles
              </Button>
            </div>

            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Skill-based</h4>
              <p className="text-xs text-gray-400 mb-3">
                Technology-specific roadmaps like React, Python, Docker, etc.
              </p>
              <Button
                onClick={() => handleImportByCategory('skill-based')}
                disabled={importing}
                size="sm"
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Import Skills
              </Button>
            </div>

            <div className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Best Practices</h4>
              <p className="text-xs text-gray-400 mb-3">
                Industry best practices for performance, security, etc.
              </p>
              <Button
                onClick={() => handleImportByCategory('best-practices')}
                disabled={importing}
                size="sm"
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Import Practices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResults && (
        <Card className="bg-black/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold">{importResults.success} Successful</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-400 font-semibold">{importResults.failed} Failed</span>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Errors:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {importResults.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* External Link */}
      <Card className="bg-black/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <div>
                <div className="font-semibold text-white">Visit roadmap.sh</div>
                <div className="text-sm text-gray-400">Explore the original roadmaps</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
              asChild
            >
              <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapImporter;
