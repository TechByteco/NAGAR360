-- ========================================================
-- NAGAR360 — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
  id VARCHAR PRIMARY KEY,
  ticket_id VARCHAR UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  severity VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'submitted',
  ward VARCHAR NOT NULL,
  locality VARCHAR NOT NULL,
  city VARCHAR NOT NULL DEFAULT 'Chennai',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  user_id VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  assigned_department VARCHAR,
  resolution_note TEXT,
  resolution_image_url TEXT,
  supports_count INT DEFAULT 1,
  supported_user_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Status History Table
CREATE TABLE IF NOT EXISTS public.status_history (
  id VARCHAR PRIMARY KEY DEFAULT ('hist-' || uuid_generate_v4()),
  complaint_id VARCHAR REFERENCES public.complaints(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL,
  note TEXT,
  updated_by_name VARCHAR NOT NULL,
  resolution_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id VARCHAR PRIMARY KEY DEFAULT ('cmt-' || uuid_generate_v4()),
  complaint_id VARCHAR REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  is_official BOOLEAN DEFAULT FALSE,
  body TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Official Credentials Table
CREATE TABLE IF NOT EXISTS public.official_credentials (
  id INT PRIMARY KEY DEFAULT 1,
  user_id VARCHAR NOT NULL DEFAULT 'admin',
  password_hash VARCHAR NOT NULL DEFAULT 'admin@123',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial admin row
INSERT INTO public.official_credentials (id, user_id, password_hash)
VALUES (1, 'admin', 'admin@123')
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime on complaints table
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
