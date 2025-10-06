import { supabase } from './supabase';
import type { AdminUser, ContentItem, CreateContentItem, UpdateContentItem, AdminStats } from '@/types/admin';

// Admin Users Management
export const checkAdminAccess = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('id', userId)
      .eq('is_active', true)
      .single();
    
    if (error || !data) return false;
    return ['admin', 'moderator', 'editor'].includes(data.role);
  } catch {
    return false;
  }
};

export const getAdminUser = async (userId: string): Promise<AdminUser | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};

export const getAllAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addAdminUser = async (email: string, role: 'admin' | 'moderator' | 'editor'): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .insert([{ email, role, is_active: true }]);
  
  if (error) throw error;
};

export const updateAdminUser = async (id: string, updates: Partial<AdminUser>): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
};

export const removeAdminUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
};

// Content Management
export const getAllContent = async (): Promise<ContentItem[]> => {
  const { data, error } = await supabase
    .from('content_items')
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    author_email: item.admin_users?.email
  }));
};

export const getContentByType = async (type: string): Promise<ContentItem[]> => {
  const { data, error } = await supabase
    .from('content_items')
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .eq('type', type)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    author_email: item.admin_users?.email
  }));
};

export const getPublishedContent = async (type?: string): Promise<ContentItem[]> => {
  let query = supabase
    .from('content_items')
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .eq('status', 'published');
    
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    author_email: item.admin_users?.email
  }));
};

export const getFeaturedContent = async (): Promise<ContentItem[]> => {
  const { data, error } = await supabase
    .from('content_items')
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    author_email: item.admin_users?.email
  }));
};

export const createContent = async (content: CreateContentItem, authorId: string): Promise<ContentItem> => {
  const { data, error } = await supabase
    .from('content_items')
    .insert([{
      ...content,
      author_id: authorId,
      featured: content.featured || false
    }])
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    author_email: data.admin_users?.email
  };
};

export const updateContent = async (content: UpdateContentItem): Promise<ContentItem> => {
  const { id, ...updates } = content;
  
  const { data, error } = await supabase
    .from('content_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      admin_users!content_items_author_id_fkey(email)
    `)
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    author_email: data.admin_users?.email
  };
};

export const deleteContent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const [contentResult, adminResult] = await Promise.all([
      supabase.from('content_items').select('status'),
      supabase.from('admin_users').select('id').eq('is_active', true)
    ]);

    const content = contentResult.data || [];
    const admins = adminResult.data || [];

    const totalContent = content.length;
    const publishedContent = content.filter(item => item.status === 'published').length;
    const draftContent = content.filter(item => item.status === 'draft').length;
    const totalAdmins = admins.length;

    // Get recent activity (content created in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: recentContent } = await supabase
      .from('content_items')
      .select('id')
      .gte('created_at', weekAgo.toISOString());

    const recentActivity = recentContent?.length || 0;

    return {
      totalContent,
      publishedContent,
      draftContent,
      totalAdmins,
      recentActivity
    };
  } catch (error) {
    throw error;
  }
};
