// Script to import roadmaps from roadmap.sh into the admin system
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/data/roadmaps';

interface RoadmapImportResult {
  success: number;
  failed: number;
  errors: string[];
}

/**
 * Import all roadmaps from roadmap.sh data into the content management system
 * This function should be called by an admin user
 */
export const importRoadmapsToAdmin = async (authorId: string): Promise<RoadmapImportResult> => {
  const result: RoadmapImportResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  const roadmaps = getAllRoadmaps();
  
  for (const roadmap of roadmaps) {
    try {
      // Check if roadmap already exists
      const { data: existingRoadmap } = await supabase
        .from('content_items')
        .select('id')
        .eq('title', roadmap.title)
        .eq('type', 'roadmap')
        .single();

      if (existingRoadmap) {
        console.log(`Roadmap "${roadmap.title}" already exists, skipping...`);
        continue;
      }

      // Create new roadmap content item
      const { error } = await supabase
        .from('content_items')
        .insert({
          title: roadmap.title,
          content: roadmap.description,
          type: 'roadmap',
          status: 'published',
          author_id: authorId,
          tags: roadmap.tags,
          featured: (roadmap as any).featured || false,
          external_url: roadmap.url,
          difficulty: roadmap.difficulty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        result.failed++;
        result.errors.push(`Failed to import "${roadmap.title}": ${error.message}`);
        console.error(`Error importing roadmap "${roadmap.title}":`, error);
      } else {
        result.success++;
        console.log(`Successfully imported roadmap: ${roadmap.title}`);
      }
    } catch (error) {
      result.failed++;
      result.errors.push(`Unexpected error importing "${roadmap.title}": ${error}`);
      console.error(`Unexpected error importing roadmap "${roadmap.title}":`, error);
    }
  }

  return result;
};

/**
 * Import roadmaps by category
 */
export const importRoadmapsByCategory = async (
  authorId: string, 
  category: 'role-based' | 'skill-based' | 'best-practices'
): Promise<RoadmapImportResult> => {
  const result: RoadmapImportResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  const roadmaps = getAllRoadmaps().filter(roadmap => roadmap.category === category);
  
  for (const roadmap of roadmaps) {
    try {
      // Check if roadmap already exists
      const { data: existingRoadmap } = await supabase
        .from('content_items')
        .select('id')
        .eq('title', roadmap.title)
        .eq('type', 'roadmap')
        .single();

      if (existingRoadmap) {
        console.log(`Roadmap "${roadmap.title}" already exists, skipping...`);
        continue;
      }

      // Create new roadmap content item
      const { error } = await supabase
        .from('content_items')
        .insert({
          title: roadmap.title,
          content: `${roadmap.description}\n\nCategory: ${roadmap.category}\n\nThis roadmap is sourced from roadmap.sh, a community-driven platform for developer learning paths.`,
          type: 'roadmap',
          status: 'published',
          author_id: authorId,
          tags: [...roadmap.tags, roadmap.category, 'roadmap.sh'],
          featured: (roadmap as any).featured || false,
          external_url: roadmap.url,
          difficulty: roadmap.difficulty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        result.failed++;
        result.errors.push(`Failed to import "${roadmap.title}": ${error.message}`);
      } else {
        result.success++;
      }
    } catch (error) {
      result.failed++;
      result.errors.push(`Unexpected error importing "${roadmap.title}": ${error}`);
    }
  }

  return result;
};

/**
 * Get roadmap import statistics
 */
export const getRoadmapImportStats = async () => {
  const totalAvailable = getAllRoadmaps().length;
  
  const { data: importedRoadmaps, error } = await supabase
    .from('content_items')
    .select('id, title')
    .eq('type', 'roadmap');

  if (error) {
    throw new Error(`Error getting import stats: ${error.message}`);
  }

  return {
    totalAvailable,
    totalImported: importedRoadmaps?.length || 0,
    remainingToImport: totalAvailable - (importedRoadmaps?.length || 0),
    categories: {
      'role-based': getAllRoadmaps().filter(r => r.category === 'role-based').length,
      'skill-based': getAllRoadmaps().filter(r => r.category === 'skill-based').length,
      'best-practices': getAllRoadmaps().filter(r => r.category === 'best-practices').length
    }
  };
};
