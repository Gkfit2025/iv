-- Fix security warning: Add search_path to handle_updated_at function
-- This prevents potential SQL injection attacks via search_path manipulation

-- Recreate the function with proper security settings
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
