-- Update applications table to use UUID foreign key for opportunities
-- First, add the new column
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS opportunity_uuid UUID;

-- Add foreign key constraint (will be enforced once we migrate data)
-- For now, we'll keep both opportunity_id (text) and opportunity_uuid (UUID)
-- to support gradual migration from mock data to database

-- Add index for the new UUID column
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_uuid ON public.applications(opportunity_uuid);

-- Add a comment to document the migration strategy
COMMENT ON COLUMN public.applications.opportunity_id IS 'Legacy text ID - will be deprecated after migration to database opportunities';
COMMENT ON COLUMN public.applications.opportunity_uuid IS 'New UUID foreign key to opportunities table';
