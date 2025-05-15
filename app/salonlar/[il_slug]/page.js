"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '../../../components/layout';
import { VenuesList } from '../../../components/venue-listing/venues-list';
import turkiyeIlIlce from '../../../data/turkiye-il-ilce';

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

export default function ProvincePage({ params }) {
    const [provinceName, setProvinceName] = useState('');

    // React.use() ile params nesnesini çözme
    const unwrappedParams = React.use(params);

    useEffect(() => {
        // il_slug'dan il adını oluştur
        const formattedProvince = formatProvince(unwrappedParams.il_slug);
        setProvinceName(formattedProvince);

        // Sayfa başlığını güncelle
        document.title = `${formattedProvince} Söz, Nişan Mekanları - Davet Evi Bul`;
    }, [unwrappedParams.il_slug]);

    return (
        <Layout>
            <VenuesList province={provinceName} />
        </Layout>
    );
} 