-- DNA Forge Hub Admin System Database Schema

-- Enable RLS (Row Level Security)
-- Run these commands in your Supabase SQL editor

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('announcement', 'note', 'resource', 'project', 'event')),
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES admin_users(id) ON DELETE CASCADE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_featured ON content_items(featured);
CREATE INDEX IF NOT EXISTS idx_content_items_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users table
CREATE POLICY "Admin users can view all admin users" ON admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.is_active = true
        )
    );

CREATE POLICY "Only admins can insert admin users" ON admin_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Only admins can update admin users" ON admin_users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

-- RLS Policies for content_items table
CREATE POLICY "Anyone can read published content" ON content_items
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Admin users can read all content" ON content_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admin users can insert content" ON content_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.is_active = true
        )
        AND author_id = auth.uid()
    );

CREATE POLICY "Admin users can update their own content" ON content_items
    FOR UPDATE
    USING (
        author_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins and moderators can update any content" ON content_items
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.role IN ('admin', 'moderator')
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins and moderators can delete content" ON content_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() 
            AND au.role IN ('admin', 'moderator')
            AND au.is_active = true
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial admin user (replace with your email)
-- You'll need to sign up first, then run this with your actual user ID
-- INSERT INTO admin_users (id, email, role, is_active) 
-- VALUES ('your-user-id-here', 'your-email@example.com', 'admin', true);

-- Example content for testing (optional)
-- INSERT INTO content_items (title, content, type, status, author_id, featured) VALUES 
-- ('Welcome to DNA Forge Hub!', 'We are excited to announce the launch of our new platform for elite developers.', 'announcement', 'published', 'your-user-id-here', true),
-- ('Getting Started Guide', 'Here is everything you need to know to get started with DNA Forge Hub.', 'resource', 'published', 'your-user-id-here', false),
-- ('Weekly Coding Challenge', 'Join us for our weekly coding challenge. This week we are focusing on algorithms.', 'event', 'published', 'your-user-id-here', false);
