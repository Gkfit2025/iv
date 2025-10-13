-- Create opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_organization_id UUID NOT NULL REFERENCES public.host_organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    theme TEXT[] NOT NULL DEFAULT '{}',
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    applicant_types TEXT[] NOT NULL DEFAULT '{}',
    min_duration INTEGER NOT NULL,
    max_duration INTEGER NOT NULL,
    images TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_opportunities_host_id ON public.opportunities(host_organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_country ON public.opportunities(country);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON public.opportunities(featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_theme ON public.opportunities USING GIN(theme);
CREATE INDEX IF NOT EXISTS idx_opportunities_applicant_types ON public.opportunities USING GIN(applicant_types);

-- Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_host_organizations_updated_at ON public.host_organizations;
CREATE TRIGGER update_host_organizations_updated_at
    BEFORE UPDATE ON public.host_organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
