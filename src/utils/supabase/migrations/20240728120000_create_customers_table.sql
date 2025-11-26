-- Supabase migration to create the 'customers' table and related policies.
-- This script is designed to be idempotent and can be run safely multiple times.

-- 1. Create the customers table
-- This table will store customer profiles, each linked to a user from the auth.users table.
-- We use 'if not exists' to prevent errors if the table already exists.
create table if not exists public.customers (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone not null default now(),
    name text,
    email text,
    phone text,
    status text default 'active' not null,
    website text,
    brand_color text,
    linkedin_url text,
    twitter_url text,
    instagram_url text,
    avatar_url text,
    
    -- Ensures a user cannot add the same customer email address more than once.
    constraint unique_customer_email_for_user unique (user_id, email)
);

-- 2. Add comments to the table and columns for clarity in the database schema.
comment on table public.customers is 'Stores customer profiles (companies) managed by application users.';
comment on column public.customers.id is 'Unique identifier for the customer.';
comment on column public.customers.user_id is 'The user from auth.users who owns this customer record.';
comment on column public.customers.created_at is 'Timestamp of when the customer was created.';
comment on column public.customers.name is 'Full name of the customer/company.';
comment on column public.customers.email is 'Email address of the customer.';
comment on column public.customers.phone is 'Phone number of the customer.';
comment on column public.customers.status is 'Status of the customer (e.g., active, inactive).';
comment on column public.customers.website is 'The customer''s website URL.';
comment on column public.customers.brand_color is 'Primary brand color in hex format.';
comment on column public.customers.linkedin_url is 'URL for the customer''s LinkedIn profile.';
comment on column public.customers.twitter_url is 'URL for the customer''s Twitter profile.';
comment on column public.customers.instagram_url is 'URL for the customer''s Instagram profile.';
comment on column public.customers.avatar_url is 'URL for the customer''s logo or avatar image.';


-- 3. Enable Row-Level Security (RLS) on the customers table.
-- This is a crucial security step. By default, it denies all access.
-- We will then create policies to grant specific permissions.
alter table public.customers enable row level security;


-- 4. Create RLS policies to control access to the data.
-- These policies ensure that users can only interact with their own data.

-- Policy for SELECT (read) access
-- Allows a user to select (read) only their own customers.
drop policy if exists "Allow individual select access" on public.customers;
create policy "Allow individual select access"
on public.customers for select
using (auth.uid() = user_id);

-- Policy for INSERT (create) access
-- Allows a user to insert new customers for themselves.
-- The 'with check' clause ensures the user_id matches the creator's UID.
drop policy if exists "Allow individual insert access" on public.customers;
create policy "Allow individual insert access"
on public.customers for insert
with check (auth.uid() = user_id);

-- Policy for UPDATE (modify) access
-- Allows a user to update only their own customers.
drop policy if exists "Allow individual update access" on public.customers;
create policy "Allow individual update access"
on public.customers for update
using (auth.uid() = user_id);

-- Policy for DELETE (remove) access
-- Allows a user to delete only their own customers.
drop policy if exists "Allow individual delete access" on public.customers;
create policy "Allow individual delete access"
on public.customers for delete
using (auth.uid() = user_id); 