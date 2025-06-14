"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Layout } from '../layout';
import { VenueCard } from '../venue-card';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';
import { useRouter } from 'next/navigation';
import { useLocation } from '../../app/context/location-context';

export function VenuesList({ province, district }) {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districtOptions, setDistrictOptions] = useState([]);
    const router = useRouter();
    const { location, setLocation } = useLocation();

    // Veri durumları
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sayfalama durumları
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 5,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // API'dan veri çekme fonksiyonu
    const fetchVenues = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            // İl slugunu bul
            const provinceObj = province ? turkiyeIlIlce.provinces.find(
                p => p.name.toLocaleLowerCase('tr-TR').trim() === province.toLocaleLowerCase('tr-TR').trim()
            ) : null;

            if (!provinceObj) {
                setVenues([]);
                setLoading(false);
                return;
            }

            // İlçe slugunu bul
            const districtObj = district && provinceObj ? turkiyeIlIlce.districts.find(
                d => d.name.toLocaleLowerCase('tr-TR').trim() === district.toLocaleLowerCase('tr-TR').trim() &&
                    d.province_id === provinceObj.id
            ) : null;

            // API URL oluştur
            let url = `/api/venues?province_slug=${provinceObj.slug}&page=${page}`;
            if (districtObj) {
                url += `&district_slug=${districtObj.slug}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Mekanlar yüklenirken bir hata oluştu');
            }


            const data = await response.json();
            setVenues(data.venues);
            setPagination(data.pagination);
            setCurrentPage(data?.pagination?.page || 1);
        } catch (err) {
            console.error('Veri çekme hatası:', err);
            setError(err.message || 'Bir hata oluştu');
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
        const handleResize = () => {
            setFiltersVisible(window.innerWidth >= 768);
        };

        handleResize();

        // Il ve ilçe değerlerini ayarla
        if (province) {
            setSelectedProvince(province);
        }

        if (district) {
            setSelectedDistrict(district);
        }

        // Context'i güncelle
        if (province || district) {
            setLocation({
                province: province || null,
                district: district || null
            });
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [province, district, setLocation]);

    // Province veya district değiştiğinde veya sayfa değiştiğinde verileri getir
    useEffect(() => {
        if (province) {
            fetchVenues(currentPage);
        }
    }, [province, district, currentPage]);

    // Seçili ile göre ilçeleri getir
    useEffect(() => {
        if (selectedProvince) {
            // Seçili ilin id'sini bul
            const selectedProvinceObj = turkiyeIlIlce.provinces.find(
                p => p.name.toLocaleLowerCase('tr-TR').trim() === selectedProvince.toLocaleLowerCase('tr-TR').trim()
            );

            if (selectedProvinceObj) {
                // Bu ile ait tüm ilçeleri filtrele
                const districts = turkiyeIlIlce.districts.filter(
                    d => d.province_id === selectedProvinceObj.id
                ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

                setDistrictOptions(districts);
            } else {
                console.log('Il bulunamadı:', selectedProvince);
                setDistrictOptions([]);
            }
        } else {
            setDistrictOptions([]);
        }
    }, [selectedProvince]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    // Il değiştiğinde yönlendirme
    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        if (selectedProvince) {
            const provinceObj = turkiyeIlIlce.provinces.find(
                p => p.name.toLocaleLowerCase('tr-TR').trim() === selectedProvince.toLocaleLowerCase('tr-TR').trim()
            );
            if (provinceObj) {
                setSelectedProvince(selectedProvince);
                setSelectedDistrict('');

                // Context'i güncelle
                setLocation({
                    province: selectedProvince,
                    district: null
                });

                router.push(`/salonlar/${provinceObj.slug}`);
            } else {
                console.log('Yönlendirme için il bulunamadı:', selectedProvince);
            }
        } else {
            // İl seçimi kaldırıldığında
            setSelectedProvince('');
            setSelectedDistrict('');

            // Context'i temizle
            setLocation({
                province: null,
                district: null
            });
        }
    };

    // İlçe değiştiğinde yönlendirme
    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        if (selectedDistrict && selectedProvince) {
            const provinceObj = turkiyeIlIlce.provinces.find(
                p => p.name.toLocaleLowerCase('tr-TR').trim() === selectedProvince.toLocaleLowerCase('tr-TR').trim()
            );
            const districtObj = turkiyeIlIlce.districts.find(
                d => d.name.toLocaleLowerCase('tr-TR').trim() === selectedDistrict.toLocaleLowerCase('tr-TR').trim() &&
                    d.province_id === provinceObj?.id
            );

            if (provinceObj && districtObj) {
                setSelectedDistrict(selectedDistrict);

                // Context'i güncelle
                setLocation({
                    province: selectedProvince,
                    district: selectedDistrict
                });

                router.push(`/salonlar/${provinceObj.slug}/${districtObj.slug}`);
            } else {
                console.log('Yönlendirme için ilçe bulunamadı:', {
                    il: selectedProvince,
                    ilce: selectedDistrict
                });
            }
        } else {
            // İlçe seçimi kaldırıldığında
            setSelectedDistrict('');

            // Context'te sadece il kalsın
            setLocation({
                province: selectedProvince,
                district: null
            });

            if (selectedProvince) {
                const provinceObj = turkiyeIlIlce.provinces.find(
                    p => p.name.toLocaleLowerCase('tr-TR').trim() === selectedProvince.toLocaleLowerCase('tr-TR').trim()
                );
                if (provinceObj) {
                    router.push(`/salonlar/${provinceObj.slug}`);
                } else {
                    console.log('Yönlendirme için il bulunamadı:', selectedProvince);
                }
            }
        }
    };

    // Sayfa değiştirme işlemleri
    const handlePrevPage = () => {
        if (pagination.hasPrevPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    // Sayfalama numaralarını hazırla
    const getPageNumbers = () => {
        let pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(pagination.totalPages, currentPage + 2);

        if (pagination.totalPages <= 5) {
            // 5 veya daha az sayfa varsa hepsini göster
            for (let i = 1; i <= pagination.totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // İlk sayfa
            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            // Orta sayfalar
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Son sayfa
            if (endPage < pagination.totalPages) {
                if (endPage < pagination.totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(pagination.totalPages);
            }
        }

        return pageNumbers;
    };

    const activeFilterCount = 7;

    // Başlık ve sayfa içeriği için bilgiler
    const pageTitle = district
        ? `${district}, ${province} Söz, Nişan Mekanları`
        : `${province} Söz, Nişan Mekanları`;

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Mobil Filtre Toggle Butonu */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={toggleFilters}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border ${filtersVisible ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-border text-text'} font-medium transition-colors`}
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            {filtersVisible ? 'Filtreleri Gizle' : 'Filtreler'}
                        </span>
                        <span className="flex items-center">
                            <span className="text-xs mr-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform ${filtersVisible ? 'rotate-180 text-primary' : 'text-primary'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sol Filtreler */}
                    <div className={`w-full md:w-1/4 lg:w-1/5 transition-all duration-300 ${isClient ? (filtersVisible ? 'block' : 'hidden md:block') : 'hidden md:block'}`}>
                        <div className="bg-white rounded-lg border border-border p-4 mb-4 shadow-sm">
                            <div className="mb-4">
                                <label className="block text-sm text-darkgray mb-2">Filtreler</label>
                                <h4 className="font-medium text-text mb-2">İl</h4>
                                <div className="relative">
                                    <select
                                        className="w-full border border-border rounded-md py-2 px-3 bg-white text-text focus:outline-none focus:border-primary"
                                        value={selectedProvince}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">İl Seçiniz</option>
                                        {turkiyeIlIlce.provinces.map(province => (
                                            <option key={province.id} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className=" pt-4 mb-4">
                                <h4 className="font-medium text-text mb-2">İlçe</h4>
                                {selectedProvince ? (
                                    <div className="relative">
                                        <select
                                            className="w-full border border-border rounded-md py-2 px-3 bg-white text-text focus:outline-none focus:border-primary mb-3"
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                        >
                                            <option value="">İlçe Seçiniz</option>
                                            {districtOptions.map(district => (
                                                <option key={district.id} value={district.name}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <p className="text-sm text-darkgray mb-3">Önce il seçiniz</p>
                                )}

                            </div>

                            <div className="border-t border-border pt-4 mb-4">
                                <h3 className="font-medium text-text mb-2">Davetli Sayısı</h3>
                                <ul className="text-sm">
                                    <li className="mb-2">
                                        <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                            <span>0 - 50 kişi</span>
                                            <span className="text-xs text-darkgray">(56)</span>
                                        </a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                            <span>50 - 100 kişi</span>
                                            <span className="text-xs text-darkgray">(124)</span>
                                        </a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                            <span>100 - 200 kişi</span>
                                            <span className="text-xs text-darkgray">(87)</span>
                                        </a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                            <span>200 + kişi</span>
                                            <span className="text-xs text-darkgray">(32)</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                    {/* Sağ İçerik */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center md:mb-6  mb-4">
                            <h1 className="text-text text-sm">
                                {loading ? 'Yükleniyor...' : `${venues?.length || 0} adet ${pageTitle} bulundu.`}
                            </h1>

                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-border rounded-md py-2 pl-3 pr-8 text-sm text-text focus:outline-none focus:border-primary">
                                        <option>Sırala</option>
                                        <option>Popülerlik</option>
                                        <option>Fiyat: Artan</option>
                                        <option>Fiyat: Azalan</option>
                                        <option>Puan</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="h-4 w-4 text-darkgray" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Yükleniyor veya Hata Durumu */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-red-500 text-center">
                                    <p className="text-lg font-medium mb-2">Bir hata oluştu</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        ) : venues?.length === 0 ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <p className="text-lg font-medium mb-2">Hiç sonuç bulunamadı</p>
                                    <p className="text-sm text-gray-500">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mekan Kartları */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    {venues?.map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} />
                                    ))}
                                </div>

                                {/* Sayfalama */}
                                {pagination?.totalPages > 1 && (
                                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                                        <button
                                            className={`flex items-center text-sm ${pagination?.hasPrevPage ? 'text-darkgray cursor-pointer' : 'text-gray-300 cursor-not-allowed'} bg-white border border-border rounded-md px-3 py-2 hover:bg-lightgray`}
                                            onClick={handlePrevPage}
                                            disabled={!pagination?.hasPrevPage}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 sm:mr-2">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                            <span className="hidden xs:inline">Önceki</span>
                                        </button>

                                        <div className="flex items-center space-x-1 mx-auto">
                                            {getPageNumbers().map((page, index) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${index}`} className="hidden sm:inline-flex items-center justify-center h-8 px-2 text-sm text-darkgray">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={`page-${page}`}
                                                        onClick={() => handlePageClick(page)}
                                                        className={`inline-flex items-center justify-center min-w-[28px] sm:min-w-[32px] h-8 text-sm ${page === currentPage
                                                            ? 'bg-primary text-white'
                                                            : 'text-darkgray hover:bg-lightgray'
                                                            } rounded-md`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}
                                        </div>

                                        <button
                                            className={`flex items-center text-sm ${pagination.hasNextPage ? 'text-darkgray cursor-pointer' : 'text-gray-300 cursor-not-allowed'} bg-white border border-border rounded-md px-3 py-2 hover:bg-lightgray`}
                                            onClick={handleNextPage}
                                            disabled={!pagination?.hasNextPage}
                                        >
                                            <span className="hidden xs:inline">Sonraki</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 sm:ml-2">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Fiyat Tablosu */}
                        <div className="mt-16 bg-white border border-border rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-lightgray border-b border-border">
                                <h2 className="text-text font-medium">{province} Söz, Nişan Mekanları Fiyatları</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr className="bg-lightgray">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">İlçe</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Kapasite</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Kişi Başı Fiyat</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Düğün Fiyatı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white font-medium divide-y divide-border text-text opacity-70">
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Üsküdar</td>
                                            <td className="px-4 py-2 text-sm text-text">150</td>
                                            <td className="px-4 py-2 text-sm text-text">1300 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">195.000 TL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Sarıyer</td>
                                            <td className="px-4 py-2 text-sm text-text">350</td>
                                            <td className="px-4 py-2 text-sm text-text">1150 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">402.500 TL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Beykoz</td>
                                            <td className="px-4 py-2 text-sm text-text">350</td>
                                            <td className="px-4 py-2 text-sm text-text">1000 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">350.000 TL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Pendik</td>
                                            <td className="px-4 py-2 text-sm text-text">200</td>
                                            <td className="px-4 py-2 text-sm text-text">700 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">140.000 TL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Bakırköy</td>
                                            <td className="px-4 py-2 text-sm text-text">100</td>
                                            <td className="px-4 py-2 text-sm text-text">1050 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">105.000 TL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm text-text">Ümraniye</td>
                                            <td className="px-4 py-2 text-sm text-text">250</td>
                                            <td className="px-4 py-2 text-sm text-text">350 TL</td>
                                            <td className="px-4 py-2 text-sm text-text">87.500 TL</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 