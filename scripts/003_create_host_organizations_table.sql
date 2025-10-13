-- Create host_organizations table
CREATE TABLE IF NOT EXISTS public.host_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    website TEXT,
    phone TEXT,
    logo TEXT,
    cover_image TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_host_organizations_user_id ON public.host_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_host_organizations_country ON public.host_organizations(country);
CREATE INDEX IF NOT EXISTS idx_host_organizations_verified ON public.host_organizations(verified);
