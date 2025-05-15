"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '../../../../components/layout';
import { VenuesList } from '../../../../components/venue-listing/venues-list';
import turkiyeIlIlce from '../../../../data/turkiye-il-ilce';

// İl adını slug'dan bulan fonksiyon
function formatProvince(slug) {
    if (!slug) return '';

    // slug'ı Türkçe küçük harfe çevir
    const normalizedSlug = slug.toLocaleLowerCase('tr-TR').trim();

    // turkiyeIlIlce.js dosyasından il bul
    const province = turkiyeIlIlce.provinces.find(p =>
        p.slug.toLocaleLowerCase('tr-TR') === normalizedSlug
    );

    if (province) {
        return province.name;
    }

    // Eşleşme bulunamadığında daha esnek bir arama yap
    const closestMatch = turkiyeIlIlce.provinces.find(p =>
        p.slug.toLocaleLowerCase('tr-TR').includes(normalizedSlug) ||
        normalizedSlug.includes(p.slug.toLocaleLowerCase('tr-TR'))
    );

    if (closestMatch) {
        console.log(`Il tam eşleşmedi, yakın sonuç kullanılıyor: ${slug} -> ${closestMatch.name}`);
        return closestMatch.name;
    }

    // Eğer bulunamazsa ilk harfi büyük yapalım (eski yöntem)
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}

// İlçe adını slug'dan bulan fonksiyon
function formatDistrict(slug, provinceId) {
    if (!slug) return '';

    // slug'ı Türkçe küçük harfe çevir
    const normalizedSlug = slug.toLocaleLowerCase('tr-TR').trim();

    // Eğer il ID'si verilmişse, o ile ait ilçeleri filtreleyelim
    if (provinceId) {
        const district = turkiyeIlIlce.districts.find(
            d => d.slug.toLocaleLowerCase('tr-TR') === normalizedSlug &&
                d.province_id === provinceId
        );

        if (district) {
            return district.name;
        }

        // Eşleşme bulunamadığında daha esnek bir arama yap, yine de aynı il içinde
        const closestMatch = turkiyeIlIlce.districts.find(
            d => (d.slug.toLocaleLowerCase('tr-TR').includes(normalizedSlug) ||
                normalizedSlug.includes(d.slug.toLocaleLowerCase('tr-TR'))) &&
                d.province_id === provinceId
        );

        if (closestMatch) {
            console.log(`İlçe tam eşleşmedi, yakın sonuç kullanılıyor: ${slug} -> ${closestMatch.name} (il: ${provinceId})`);
            return closestMatch.name;
        }
    }

    // İl ID'si yoksa veya belirli ilde bulunamadıysa tüm ilçelerde arıyoruz
    const district = turkiyeIlIlce.districts.find(
        d => d.slug.toLocaleLowerCase('tr-TR') === normalizedSlug
    );

    if (district) {
        return district.name;
    }

    // Tüm ilçelerde yakın eşleşme ara
    const closestMatch = turkiyeIlIlce.districts.find(
        d => d.slug.toLocaleLowerCase('tr-TR').includes(normalizedSlug) ||
            normalizedSlug.includes(d.slug.toLocaleLowerCase('tr-TR'))
    );

    if (closestMatch) {
        console.log(`İlçe tam eşleşmedi, yakın sonuç kullanılıyor: ${slug} -> ${closestMatch.name}`);
        return closestMatch.name;
    }

    // Eğer bulunamazsa ilk harfi büyük yapalım (eski yöntem)
    console.log(`İlçe bulunamadı: ${slug}`);
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default function DistrictPage({ params }) {
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');

    // React.use() ile params nesnesini çözme
    const unwrappedParams = React.use(params);

    useEffect(() => {
        console.log('Aranıyor:', {
            il_slug: unwrappedParams.il_slug,
            ilce_slug: unwrappedParams.ilce_slug
        });

        // il_slug'dan il adını oluştur
        const normalizedProvinceSlug = (unwrappedParams.il_slug || '').toLocaleLowerCase('tr-TR').trim();
        const province = turkiyeIlIlce.provinces.find(
            p => p.slug.toLocaleLowerCase('tr-TR') === normalizedProvinceSlug
        );

        const formattedProvince = formatProvince(unwrappedParams.il_slug);

        let formattedDistrict;
        if (province) {
            // Eğer il bulunduysa, o ile ait ilçeleri filtreleyelim
            formattedDistrict = formatDistrict(unwrappedParams.ilce_slug, province.id);
        } else {
            // İl bulunamadıysa tüm ilçelerde arayalım
            formattedDistrict = formatDistrict(unwrappedParams.ilce_slug);
        }

        setProvinceName(formattedProvince);
        setDistrictName(formattedDistrict);

        // Sayfa başlığını güncelle
        document.title = `${formattedDistrict}, ${formattedProvince} Söz, Nişan Mekanları - Davet Evi Bul`;
    }, [unwrappedParams.il_slug, unwrappedParams.ilce_slug]);

    return (
        <Layout>
            <VenuesList province={provinceName} district={districtName} />
        </Layout>
    );
}
