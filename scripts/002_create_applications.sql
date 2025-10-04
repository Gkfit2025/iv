-- Create applications table to track volunteer applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id text not null,
  opportunity_title text not null,
  host_organization text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  motivation text,
  experience text,
  availability_start date,
  availability_end date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.applications enable row level security;

-- Policies for applications table
create policy "Users can view their own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- Add trigger to auto-update updated_at
create trigger set_updated_at
  before update on public.applications
  for each row
  execute function public.handle_updated_at();

-- Create index for faster queries
create index applications_user_id_idx on public.applications(user_id);
create index applications_status_idx on public.applications(status);
