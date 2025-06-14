-- Profiles tablosu oluşturma
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  password TEXT,
  user_type TEXT DEFAULT 'user'
);




CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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
  is_active BOOLEAN DEFAULT true,
  tagline TEXT,
  owner_name TEXT,
  password TEXT
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


-- İkinci eklenenler

-- Paketler tablosu
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Teklifler tablosu
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Beklemede', 'Gönderildi', 'İptal Edildi')),
    offer_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Rezervasyonlar tablosu
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    event_date DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('Beklemede', 'Kapora Alındı', 'Tamamı Ödendi')),
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Ön Rezervasyon', 'Kesin Rezervasyon')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Randevular tablosu
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Beklemede', 'Tamamlandı', 'İptal Edildi')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Soru-Cevap tablosu
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    question_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Yorumlar tablosu
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    answer TEXT,
    review_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- Hikayeler tablosu
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    story TEXT NOT NULL,
    image_url TEXT,
    story_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    isdeleted BOOLEAN DEFAULT FALSE
);

-- RLS Politikaları
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Paketler için politikalar
CREATE POLICY "Paketleri herkes görebilir"
    ON packages FOR SELECT
    USING (isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi paketlerini yönetebilir"
    ON packages FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Teklifler için politikalar
CREATE POLICY "İşletme sahipleri kendi tekliflerini görebilir"
    ON offers FOR SELECT
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ) AND isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi tekliflerini yönetebilir"
    ON offers FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Rezervasyonlar için politikalar
CREATE POLICY "İşletme sahipleri kendi rezervasyonlarını görebilir"
    ON reservations FOR SELECT
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ) AND isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi rezervasyonlarını yönetebilir"
    ON reservations FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Randevular için politikalar
CREATE POLICY "İşletme sahipleri kendi randevularını görebilir"
    ON appointments FOR SELECT
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ) AND isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi randevularını yönetebilir"
    ON appointments FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Soru-Cevap için politikalar
CREATE POLICY "Soru-cevapları herkes görebilir"
    ON questions FOR SELECT
    USING (isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi sorularını yönetebilir"
    ON questions FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Yorumlar için politikalar
CREATE POLICY "Yorumları herkes görebilir"
    ON reviews FOR SELECT
    USING (isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi yorumlarını yönetebilir"
    ON reviews FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Hikayeler için politikalar
CREATE POLICY "Hikayeleri herkes görebilir"
    ON stories FOR SELECT
    USING (isdeleted = false);

CREATE POLICY "İşletme sahipleri kendi hikayelerini yönetebilir"
    ON stories FOR ALL
    USING (business_id IN (
        SELECT id FROM businesses WHERE owner_id = auth.uid()
    ));

-- Enable RLS for images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- İşletme sahipleri için politika
CREATE POLICY "İşletme sahipleri kendi resimlerini yönetebilir"
ON images
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = images.business_id 
        AND businesses.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = images.business_id 
        AND businesses.owner_id = auth.uid()
    )
);

-- Herkes için okuma politikası
CREATE POLICY "Herkes aktif resimleri görebilir"
ON images
FOR SELECT
USING (is_active = true);

-- Enable RLS for businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- İşletme sahipleri kendi işletmelerini yönetebilir
CREATE POLICY "İşletme sahipleri kendi işletmelerini yönetebilir"
ON businesses
FOR ALL
USING (owner_id = auth.uid());

-- Herkes aktif işletmeleri görebilir
CREATE POLICY "Herkes aktif işletmeleri görebilir"
ON businesses
FOR SELECT
USING (is_active = true);

-- Enable RLS for images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- İşletme sahipleri için politika
CREATE POLICY "İşletme sahipleri kendi resimlerini yönetebilir"
ON images
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = images.business_id 
        AND businesses.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = images.business_id 
        AND businesses.owner_id = auth.uid()
    )
);

-- Herkes için okuma politikası
CREATE POLICY "Herkes aktif resimleri görebilir"
ON images
FOR SELECT
USING (is_active = true);