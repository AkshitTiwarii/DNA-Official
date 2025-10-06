-- Update content_items table to support new content types and fields
-- Run this to extend your existing database schema

-- Add new columns to content_items table
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS difficulty TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS prize TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS company TEXT;

-- Update the type constraint to include new content types
ALTER TABLE content_items DROP CONSTRAINT IF EXISTS content_items_type_check;
ALTER TABLE content_items ADD CONSTRAINT content_items_type_check 
CHECK (type IN ('announcement', 'note', 'resource', 'project', 'event', 'hackathon', 'opportunity', 'pdf', 'video', 'roadmap'));

-- Create index for content type filtering
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_deadline ON content_items(deadline) WHERE deadline IS NOT NULL;

-- Add comment explaining the new fields
COMMENT ON COLUMN content_items.external_url IS 'URL for external resources like PDFs, videos, or roadmaps';
COMMENT ON COLUMN content_items.difficulty IS 'Difficulty level for hackathons and opportunities (beginner, intermediate, advanced)';
COMMENT ON COLUMN content_items.deadline IS 'Deadline for hackathons and opportunities';
COMMENT ON COLUMN content_items.prize IS 'Prize information for hackathons';
COMMENT ON COLUMN content_items.company IS 'Company name for opportunities';
