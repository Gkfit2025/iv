-- Update ICISO organization logo
-- Replace 'YOUR_USER_ID' with your actual user ID from the users table
-- You can find it by running: SELECT id, email FROM public.users WHERE email = 'your-iciso-email@example.com';

UPDATE public.host_organizations
SET logo = '/iciso-logo.png'  -- Change extension if needed (.jpg, .webp, etc.)
WHERE name = 'ICISO';

-- Update opportunity images
-- First, find your opportunity IDs by running:
-- SELECT id, title FROM public.opportunities WHERE host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- Then update each opportunity with its corresponding image
-- Replace 'OPPORTUNITY_ID_1' with the actual ID of your first opportunity

-- Example for "Students at Home" opportunity
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-home.png']  -- Change extension if needed
WHERE title ILIKE '%home%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- Example for "Students at Library" opportunity
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-library.png']  -- Change extension if needed
WHERE title ILIKE '%library%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- Example for "Students at Coffee" opportunity
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-coffee.png']  -- Change extension if needed
WHERE title ILIKE '%coffee%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- If you want to add multiple images to an opportunity:
-- UPDATE public.opportunities
-- SET images = ARRAY['/iciso-students-home.png', '/iciso-students-library.png', '/iciso-students-coffee.png']
-- WHERE id = 'YOUR_OPPORTUNITY_ID';
