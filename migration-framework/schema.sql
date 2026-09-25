-- IMRC Database Schema & Migration for Supabase
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create tables if they do not exist
CREATE TABLE IF NOT EXISTS public.settings (
    id INT PRIMARY KEY DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Events',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Safely add any missing columns to existing settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_about TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_mission TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_vision TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_gallery TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image_contact TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS image_legacy TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS team_members JSONB;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Insert default row 1 into settings if missing
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Setup policies so site and admin can read & write
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read gallery" ON public.gallery_items;
CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins all settings" ON public.settings;
CREATE POLICY "Admins all settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins all gallery" ON public.gallery_items;
CREATE POLICY "Admins all gallery" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert contact" ON public.contact_submissions;
CREATE POLICY "Public insert contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins all contact" ON public.contact_submissions;
CREATE POLICY "Admins all contact" ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);
