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

-- RLS (Row Level Security) kurallarını ayarlama
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcıların kendi profillerini görmelerine izin ver
CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Kullanıcıların kendi profillerini güncellemelerine izin ver
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Anonim kullanıcıların profil oluşturmasına izin ver (kayıt sürecinde kullanılır)
CREATE POLICY "Anonim kullanıcılar profil oluşturabilir"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Firma hesaplarının belirli profil alanlarını görebilmesi için policy
CREATE POLICY "Firmalar belirli profil alanlarını görebilir"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT (raw_user_meta_data->>'user_type')::text FROM auth.users WHERE id = auth.uid()) = 'company'
    AND
    id <> auth.uid() -- kendi profili değilse
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

-- View'a güvenlik ayarı uygulama
-- NOT: View'lar için RLS etkinleştirme özelliği farklı çalışır
-- View tarafından kullanılan tablo(lar) üzerinde policy uygulayacağız
-- View erişimi için özel bir fonksiyon oluşturalım

-- View erişimi için firma rolü kontrolü yapan bir fonksiyon oluştur
CREATE OR REPLACE FUNCTION public.check_is_company()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'user_type')::text = 'company'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View üzerinde erişim kontrolü için policy
CREATE POLICY "Firmalar shared_profiles erişebilir"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    public.check_is_company() AND user_type = 'user'
  );

-- Otomatik profil güncellemesi için trigger oluştur
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Auth kullanıcısı silindiğinde profil tablosundaki kaydı da silmek için trigger
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql; 