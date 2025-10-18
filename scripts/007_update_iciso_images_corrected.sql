-- Update ICISO logo using the actual organization name
UPDATE public.host_organizations
SET logo = '/iciso-logo.png'
WHERE name ILIKE '%ICISO%';

-- Check what we updated
SELECT id, name, logo FROM public.host_organizations WHERE name ILIKE '%ICISO%';

-- Update opportunity images using the actual opportunity IDs
-- First, let's see the opportunities with their IDs
SELECT id, title, images FROM public.opportunities 
WHERE host_organization_id = (
  SELECT id FROM public.host_organizations WHERE name ILIKE '%ICISO%'
);

-- Update each opportunity by ID (replace with your actual opportunity IDs)
-- Opportunity 1: 11147828-9d72-4b73-8d72-a53215a774c1
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-community.png']
WHERE id = '11147828-9d72-4b73-8d72-a53215a774c1';

-- Opportunity 2: dcba3be0-2523-41fa-89d2-658b3dc6aeb1
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-education.png']
WHERE id = 'dcba3be0-2523-41fa-89d2-658b3dc6aeb1';

-- Opportunity 3: 7fc435ac-96bc-4095-bec3-22a42d44dce6
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-heritage.png']
WHERE id = '7fc435ac-96bc-4095-bec3-22a42d44dce6';

-- Verify the updates
SELECT id, title, images FROM public.opportunities 
WHERE host_organization_id = (
  SELECT id FROM public.host_organizations WHERE name ILIKE '%ICISO%'
);
