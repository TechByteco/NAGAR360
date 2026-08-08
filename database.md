# Nagar360 — Database Schema & Data Models

## PostgreSQL Schema (Supabase & Mock Store)

### 1. `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('citizen', 'official', 'admin')) DEFAULT 'citizen',
  department TEXT, -- null for citizens, e.g., 'Road Maintenance', 'Sanitation'
  city TEXT DEFAULT 'Chennai',
  preferred_language TEXT DEFAULT 'en',
  civic_points INT DEFAULT 150,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `complaints` Table
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT UNIQUE NOT NULL, -- e.g. NGR-CHN-2026-00124
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  status TEXT CHECK (status IN ('submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'duplicate')) DEFAULT 'submitted',
  image_url TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  locality TEXT NOT NULL,
  ward TEXT NOT NULL,
  city TEXT DEFAULT 'Chennai',
  state TEXT DEFAULT 'Tamil Nadu',
  assigned_department TEXT,
  assigned_official_id UUID REFERENCES users(id),
  is_anonymous BOOLEAN DEFAULT FALSE,
  ai_analysis JSONB,
  supports_count INT DEFAULT 0,
  duplicate_of_id UUID REFERENCES complaints(id),
  resolution_note TEXT,
  resolution_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `status_history` Table
```sql
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  updated_by_id UUID REFERENCES users(id),
  updated_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `supports` Table (Upvotes)
```sql
CREATE TABLE supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(complaint_id, user_id)
);
```

### 5. `comments` Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  is_official BOOLEAN DEFAULT FALSE,
  body TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. `civic_events` Table
```sql
CREATE TABLE civic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  locality TEXT NOT NULL,
  organizer TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  attendees_count INT DEFAULT 0,
  image_url TEXT
);
```
