-- Gerekli uzantıyı etkinleştir
create extension if not exists "uuid-ossp";

-- Profil fotoğrafları için bucket oluştur
insert into storage.buckets (id, name, public)
values ('business_profiles', 'business_profiles', true);

-- İşletme galerisi için bucket oluştur
insert into storage.buckets (id, name, public)
values ('business_images', 'business_images', true);

-- Profil resimleri için politikalar
-- 1. Görüntüleme politikası (herkes görebilir)
create policy "Profil resimleri görüntüleme"
on storage.objects for select
using (bucket_id = 'business_profiles');

-- 2. İşletme sahipleri kendi profil resimlerini yükleyebilir
create policy "İşletme sahipleri profil resmi yükleyebilir"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'business_profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. İşletme sahipleri kendi profil resimlerini güncelleyebilir
create policy "İşletme sahipleri profil resimlerini güncelleyebilir"
on storage.objects for update
to authenticated
using (
  bucket_id = 'business_profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. İşletme sahipleri kendi profil resimlerini silebilir
create policy "İşletme sahipleri profil resimlerini silebilir"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'business_profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- İşletme galerisi için politikalar
-- 1. Görüntüleme politikası (herkes görebilir)
create policy "İşletme resimleri görüntüleme"
on storage.objects for select
using (bucket_id = 'business_images');

-- 2. İşletme sahipleri kendi galerilerine resim yükleyebilir
create policy "İşletme sahipleri galeri resmi yükleyebilir"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'business_images' AND
  exists (
    select 1 from businesses
    where id = (storage.foldername(name))[1]::uuid
    and owner_id = auth.uid()
  )
);

-- 3. İşletme sahipleri kendi galerilerindeki resimleri güncelleyebilir
create policy "İşletme sahipleri galeri resimlerini güncelleyebilir"
on storage.objects for update
to authenticated
using (
  bucket_id = 'business_images' AND
  exists (
    select 1 from businesses
    where id = (storage.foldername(name))[1]::uuid
    and owner_id = auth.uid()
  )
);

-- 4. İşletme sahipleri kendi galerilerindeki resimleri silebilir
create policy "İşletme sahipleri galeri resimlerini silebilir"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'business_images' AND
  exists (
    select 1 from businesses
    where id = (storage.foldername(name))[1]::uuid
    and owner_id = auth.uid()
  )
);

-- business_images bucket'ı için politikalar
create policy "Herkes business_images görebilir"
on storage.objects for select
using ( bucket_id = 'business_images' );

create policy "İşletme sahipleri resim yükleyebilir"
on storage.objects for insert
with check (
    bucket_id = 'business_images' AND
    (storage.foldername(name))[1]::uuid in (
        select id from businesses where owner_id = auth.uid()
    )
);

create policy "İşletme sahipleri kendi resimlerini güncelleyebilir"
on storage.objects for update
using (
    bucket_id = 'business_images' AND
    (storage.foldername(name))[1]::uuid in (
        select id from businesses where owner_id = auth.uid()
    )
);

create policy "İşletme sahipleri kendi resimlerini silebilir"
on storage.objects for delete
using (
    bucket_id = 'business_images' AND
    (storage.foldername(name))[1]::uuid in (
        select id from businesses where owner_id = auth.uid()
    )
); 