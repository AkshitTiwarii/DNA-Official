export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'note' | 'resource' | 'project' | 'event' | 'hackathon' | 'opportunity' | 'pdf' | 'video' | 'roadmap';
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_email?: string;
  tags?: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  external_url?: string; // For PDFs, videos, and roadmap links
  difficulty?: string;   // For hackathons and opportunities
  deadline?: string;     // For hackathons and opportunities
  prize?: string;        // For hackathons
  company?: string;      // For opportunities
}

export interface CreateContentItem {
  title: string;
  content: string;
  type: 'announcement' | 'note' | 'resource' | 'project' | 'event' | 'hackathon' | 'opportunity' | 'pdf' | 'video' | 'roadmap';
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  featured?: boolean;
  external_url?: string;
  difficulty?: string;
  deadline?: string;
  prize?: string;
  company?: string;
}

export interface UpdateContentItem extends Partial<CreateContentItem> {
  id: string;
}

export interface AdminStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalAdmins: number;
  recentActivity: number;
}
