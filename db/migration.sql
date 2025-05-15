-- Profiles tablosu oluşturma
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  city_id INTEGER,
  city_name TEXT,
  district_id INTEGER,
  district_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  password TEXT,
  user_type TEXT DEFAULT 'user'
);


-- Paylaşılabilir kullanıcı bilgilerini içeren view oluşturma
CREATE OR REPLACE VIEW public.shared_profiles AS
  SELECT 
    id,
    full_name,
    phone,
    city_id,
    city_name,
    district_id,
    district_name,
    user_type
  FROM profiles
  WHERE user_type = 'user'; -- Sadece normal kullanıcıları göster, firma hesaplarını değil


CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  capacity INTEGER,
  phone TEXT,
  email TEXT,
  address TEXT,
  city_id INTEGER,
  city_name TEXT,
  district_id INTEGER,
  district_name TEXT,
  lat FLOAT,
  lng FLOAT,
  features JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  profile_image_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  tagline TEXT,
  owner_name TEXT
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  position TEXT,
  phone TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  price FLOAT,
  is_per_person BOOLEAN DEFAULT false,
  capacity INTEGER,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  sequence INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
