import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Profil resmi yükleme fonksiyonu
 * @param {File} file - Yüklenecek dosya
 * @param {string} businessId - İşletme ID'si
 * @returns {Promise<{url: string}>} - Yüklenen dosyanın URL'i
 */
export const uploadProfileImage = async (file, businessId) => {
    try {
        if (!file || !businessId) throw new Error('Dosya ve işletme ID\'si gereklidir');

        // Dosya adı oluştur: işletmeId_timestamp_uuid.uzantı
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessId}_${Date.now()}_${uuidv4()}.${fileExt}`;
        const filePath = `${businessId}/${fileName}`;

        // Dosyayı Supabase storage'a yükle
        const { data, error } = await supabase.storage
            .from('business_profiles')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // URL oluştur
        const { data: urlData } = await supabase.storage
            .from('business_profiles')
            .getPublicUrl(filePath);

        return { url: urlData.publicUrl };
    } catch (error) {
        console.error('Profil resmi yükleme hatası:', error);
        throw error;
    }
};

/**
 * İşletme resmi yükleme fonksiyonu
 * @param {File} file - Yüklenecek dosya
 * @param {string} businessId - İşletme ID'si
 * @param {number} sequence - Resim sıra numarası
 * @returns {Promise<{url: string, sequence: number}>} - Yüklenen dosyanın URL'i ve sıra numarası
 */
export const uploadBusinessImage = async (file, businessId, sequence = 0) => {
    try {
        if (!file || !businessId) throw new Error('Dosya ve işletme ID\'si gereklidir');

        // Dosya adı oluştur: işletmeId_sequence_timestamp_uuid.uzantı
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessId}_${sequence}_${Date.now()}_${uuidv4()}.${fileExt}`;
        const filePath = `${businessId}/${fileName}`;

        // Dosyayı Supabase storage'a yükle
        const { data: storageData, error: storageError } = await supabase.storage
            .from('business_images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (storageError) {
            console.error('Storage yükleme hatası:', storageError);
            throw storageError;
        }

        // URL oluştur
        const { data: urlData, error: urlError } = await supabase.storage
            .from('business_images')
            .getPublicUrl(filePath);

        if (urlError) {
            console.error('URL alma hatası:', urlError);
            throw urlError;
        }

        // Veritabanına ekle
        const { data: imageData, error: dbError } = await supabase
            .from('images')
            .insert({
                business_id: businessId,
                url: urlData.publicUrl,
                sequence: sequence,
                is_active: true
            })
            .select()
            .single();

        if (dbError) {
            console.error('Veritabanı kayıt hatası:', dbError);
            // Resim yüklendi ama veritabanına eklenemedi, yüklenen resmi sil
            await supabase.storage
                .from('business_images')
                .remove([filePath]);
            throw dbError;
        }

        return {
            id: imageData.id,
            url: urlData.publicUrl,
            sequence: sequence
        };
    } catch (error) {
        console.error('İşletme resmi yükleme hatası:', error);
        throw error;
    }
};

/**
 * İşletmenin tüm resimlerini getir
 * @param {string} businessId - İşletme ID'si
 * @returns {Promise<Array>} - Resim listesi
 */
export const getBusinessImages = async (businessId) => {
    try {
        if (!businessId) throw new Error('İşletme ID\'si gereklidir');

        const { data, error } = await supabase
            .from('images')
            .select('*')
            .eq('business_id', businessId)
            .eq('is_active', true)
            .order('sequence', { ascending: true });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('İşletme resimleri getirme hatası:', error);
        throw error;
    }
};

/**
 * İşletme resmini sil
 * @param {string} imageId - Resim ID'si
 * @param {string} businessId - İşletme ID'si
 * @returns {Promise<boolean>} - İşlem başarılı mı?
 */
export const deleteBusinessImage = async (imageId, businessId) => {
    try {
        if (!imageId || !businessId) throw new Error('Resim ID\'si ve işletme ID\'si gereklidir');

        // Önce resmin URL'ini al
        const { data: imageData, error: fetchError } = await supabase
            .from('images')
            .select('url')
            .eq('id', imageId)
            .eq('business_id', businessId)
            .single();

        if (fetchError || !imageData) throw fetchError || new Error('Resim bulunamadı');

        // URL'den dosya yolunu çıkar
        const urlParts = imageData.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${businessId}/${fileName}`;

        // Resmi storage'dan sil
        const { error: storageError } = await supabase.storage
            .from('business_images')
            .remove([filePath]);

        // Resmi veritabanından sil (soft delete)
        const { error: dbError } = await supabase
            .from('images')
            .update({ is_active: false })
            .eq('id', imageId)
            .eq('business_id', businessId);

        if (storageError) console.error('Storage\'dan resim silme hatası:', storageError);
        if (dbError) throw dbError;

        return true;
    } catch (error) {
        console.error('İşletme resmi silme hatası:', error);
        throw error;
    }
};

/**
 * İşletme resimlerini sırala
 * @param {Array} images - Resimlerin ID ve sequence bilgisini içeren dizi
 * @param {string} businessId - İşletme ID'si
 * @returns {Promise<boolean>} - İşlem başarılı mı?
 */
export const reorderBusinessImages = async (images, businessId) => {
    try {
        if (!images || !businessId) throw new Error('Resimler ve işletme ID\'si gereklidir');

        // Her bir resmin sequence değerini güncelle
        const promises = images.map(img =>
            supabase
                .from('images')
                .update({ sequence: img.sequence })
                .eq('id', img.id)
                .eq('business_id', businessId)
        );

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Resim sıralama hatası:', error);
        throw error;
    }
};

/**
 * İşletme profilini güncelle
 * @param {string} businessId - İşletme ID'si
 * @param {object} profileData - Güncellenecek profil verileri
 * @returns {Promise<object>} - Güncellenmiş profil
 */
export const updateBusinessProfile = async (businessId, profileData) => {
    try {
        if (!businessId) throw new Error('İşletme ID\'si gereklidir');

        const { data, error } = await supabase
            .from('businesses')
            .update({
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .eq('id', businessId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        throw error;
    }
}; 