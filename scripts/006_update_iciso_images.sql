-- Update ICISO organization logo
-- Replace 'YOUR_USER_ID' with your actual user ID from the users table
-- You can find it by running: SELECT id, email FROM public.users WHERE email = 'icisoi.club@gmail.com';
-- id = ce8a78a8-d3e5-48dc-8b35-c8340989ba45    e-mail = 'icisoi.club@gmail.com'

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
SET images = ARRAY['/iciso-students-community.png']  -- Change extension if needed
WHERE title ILIKE '%community%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- Example for "Students at Library" opportunity
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-education.png']  -- Change extension if needed
WHERE title ILIKE '%education%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- Example for "Students at Coffee" opportunity
UPDATE public.opportunities
SET images = ARRAY['/iciso-students-heritage.png']  -- Change extension if needed
WHERE title ILIKE '%heritage%'
AND host_organization_id = (SELECT id FROM public.host_organizations WHERE name = 'ICISO');

-- If you want to add multiple images to an opportunity:
-- UPDATE public.opportunities
-- SET images = ARRAY['/iciso-students-home.png', '/iciso-students-library.png', '/iciso-students-coffee.png']
-- WHERE id = 'YOUR_OPPORTUNITY_ID';
