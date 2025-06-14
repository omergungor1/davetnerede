"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, UserCheck, MapPin, Phone, Mail, X, Download, ExternalLink, Plus, ListFilter, Calendar as CalendarIcon, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';
import { CallMeForm } from '@/components/ui/call-me-form';
import { Calendar } from '@/components/ui/calendar';
import { EventDetailsModal } from '@/components/modals/EventDetailsModal';
import { RandevuModal } from '@/components/modals/RandevuModal';
import { RezervasyonModal } from '@/components/modals/RezervasyonModal';
import { SearchableTable } from '@/components/ui/SearchableTable';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ProfileImageUploader } from '@/components/ui/ProfileImageUploader';
import { TeklifModal } from '@/components/modals/TeklifModal';
import { SoruCevapModal } from '@/components/modals/SoruCevapModal';
import { TagInput } from '@/components/ui/TagInput';

export default function FirmaProfilPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isCompanyAccount, signOut, isLoading: authLoading } = useAuth();
    const activeTab = searchParams.get('tab') || 'profil';

    // State tanımlamaları
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [businessData, setBusinessData] = useState(null);

    // Firma profil state'leri
    const [firmaProfil, setFirmaProfil] = useState({
        firma_adi: '',
        aciklama: '',
        adres: '',
        telefon: '',
        email: '',
        website: '',
        instagram: '',
        facebook: '',
        twitter: '',
        ozellikler: [],
        hizmetler: []
    });
    const [ilceler, setIlceler] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [businessImages, setBusinessImages] = useState([]);

    // Veri state'leri
    const [teklifler, setTeklifler] = useState([]);
    const [rezervasyonlar, setRezervasyonlar] = useState([]);
    const [randevular, setRandevular] = useState([]);
    const [sorular, setSorular] = useState([]);
    const [yorumlar, setYorumlar] = useState([]);

    // Modal state'leri
    const [modalOpen, setModalOpen] = useState(false);
    const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
    const [randevuModalOpen, setRandevuModalOpen] = useState(false);
    const [rezervasyonModalOpen, setRezervasyonModalOpen] = useState(false);
    const [teklifModalOpen, setTeklifModalOpen] = useState(false);
    const [soruCevapModalOpen, setSoruCevapModalOpen] = useState(false);

    // Seçim state'leri
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectedTeklif, setSelectedTeklif] = useState(null);
    const [selectedRezervasyon, setSelectedRezervasyon] = useState(null);
    const [selectedRandevu, setSelectedRandevu] = useState(null);

    // Görünüm state'leri
    const [rezervasyonView, setRezervasyonView] = useState('list'); // 'list' veya 'calendar'
    const [randevuView, setRandevuView] = useState('list'); // 'list' veya 'calendar'
    const [randevuIsEdit, setRandevuIsEdit] = useState(false);
    const [rezervasyonModalMode, setRezervasyonModalMode] = useState('add'); // 'add', 'edit', 'view'

    // Yorum ve soru state'leri
    const [commentReplies, setCommentReplies] = useState({});
    const [replyInProgress, setReplyInProgress] = useState({});
    const [soruYanitlar, setSoruYanitlar] = useState({});
    const [yanitGonderiliyor, setYanitGonderiliyor] = useState(false);

    // Verileri getir
    useEffect(() => {
        // Kullanıcı veya işletme hesabı yoksa veri getirme
        if (!user || authLoading) {
            return;
        }

        // Kullanıcı tipini kontrol et - işletme hesabı değilse veri getirme
        if (!isCompanyAccount()) {
            return;
        }

        // Veri getirme işlemi daha önce başlatıldıysa tekrar yapma
        if (loading) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const businessId = '1'; // TODO: Dinamik olarak alınacak

                console.log('Veriler getiriliyor...');

                // Tüm verileri paralel olarak getir
                const [tekliflerRes, rezervasyonlarRes, randevularRes, sorularRes, yorumlarRes] = await Promise.all([
                    fetch(`/api/business/${businessId}/offers`).catch(e => ({ ok: false, json: () => Promise.resolve([]) })),
                    fetch(`/api/business/${businessId}/reservations`).catch(e => ({ ok: false, json: () => Promise.resolve([]) })),
                    fetch(`/api/business/${businessId}/appointments`).catch(e => ({ ok: false, json: () => Promise.resolve([]) })),
                    fetch(`/api/business/${businessId}/questions`).catch(e => ({ ok: false, json: () => Promise.resolve([]) })),
                    fetch(`/api/business/${businessId}/reviews`).catch(e => ({ ok: false, json: () => Promise.resolve([]) }))
                ]);

                // Yanıtları JSON'a çevir
                const [tekliflerData, rezervasyonlarData, randevularData, sorularData, yorumlarData] = await Promise.all([
                    tekliflerRes.json(),
                    rezervasyonlarRes.json(),
                    randevularRes.json(),
                    sorularRes.json(),
                    yorumlarRes.json()
                ]);

                // Hata kontrolü
                if (tekliflerRes.ok) setTeklifler(tekliflerData);
                if (rezervasyonlarRes.ok) setRezervasyonlar(rezervasyonlarData);
                if (randevularRes.ok) setRandevular(randevularData);
                if (sorularRes.ok) setSorular(sorularData);
                if (yorumlarRes.ok) setYorumlar(yorumlarData);

                console.log('Veriler başarıyla getirildi');
            } catch (error) {
                console.error('Veri getirme hatası:', error);
                toast.error('Veriler getirilirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        // İlk yükleme sırasında verileri getir
        fetchData();
    }, [user, authLoading, isCompanyAccount, loading]);

    // Yorum cevaplama fonksiyonu
    const handleYorumCevap = async (yorumId, cevap) => {
        try {
            const businessId = '1'; // TODO: Dinamik olarak alınacak
            const response = await fetch(`/api/business/${businessId}/reviews`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: yorumId, answer: cevap })
            });

            if (response.ok) {
                // Yorumları güncelle
                setYorumlar(prevYorumlar =>
                    prevYorumlar.map(yorum =>
                        yorum.id === yorumId ? { ...yorum, cevap } : yorum
                    )
                );
                toast.success('Yorum cevabı güncellendi');
            } else {
                throw new Error('Yorum cevabı güncellenemedi');
            }
        } catch (error) {
            console.error('Yorum cevaplama hatası:', error);
            toast.error('Yorum cevabı güncellenirken bir hata oluştu');
        }
    };

    // Soru cevaplama fonksiyonu
    const handleSoruCevap = async (soruId, cevap) => {
        try {
            const businessId = '1'; // TODO: Dinamik olarak alınacak
            const response = await fetch(`/api/business/${businessId}/questions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: soruId, answer: cevap })
            });

            if (response.ok) {
                // Soruları güncelle
                setSorular(prevSorular =>
                    prevSorular.map(soru =>
                        soru.id === soruId ? { ...soru, cevap } : soru
                    )
                );
                toast.success('Soru cevabı güncellendi');
            } else {
                throw new Error('Soru cevabı güncellenemedi');
            }
        } catch (error) {
            console.error('Soru cevaplama hatası:', error);
            toast.error('Soru cevabı güncellenirken bir hata oluştu');
        }
    };


    // Teklif silme fonksiyonu
    const handleTeklifSil = async (teklifId) => {
        try {
            const businessId = '1'; // TODO: Dinamik olarak alınacak
            const response = await fetch(`/api/business/${businessId}/offers?id=${teklifId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Teklifleri güncelle
                setTeklifler(prevTeklifler =>
                    prevTeklifler.filter(teklif => teklif.id !== teklifId)
                );
                toast.success('Teklif silindi');
            } else {
                throw new Error('Teklif silinemedi');
            }
        } catch (error) {
            console.error('Teklif silme hatası:', error);
            toast.error('Teklif silinirken bir hata oluştu');
        }
    };

    // Rezervasyon silme fonksiyonu
    const handleRezervasyonSil = async (rezervasyonId) => {
        try {
            const businessId = '1'; // TODO: Dinamik olarak alınacak
            const response = await fetch(`/api/business/${businessId}/reservations?id=${rezervasyonId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Rezervasyonları güncelle
                setRezervasyonlar(prevRezervasyonlar =>
                    prevRezervasyonlar.filter(rezervasyon => rezervasyon.id !== rezervasyonId)
                );
                toast.success('Rezervasyon silindi');
            } else {
                throw new Error('Rezervasyon silinemedi');
            }
        } catch (error) {
            console.error('Rezervasyon silme hatası:', error);
            toast.error('Rezervasyon silinirken bir hata oluştu');
        }
    };

    // Randevu silme fonksiyonu
    const handleRandevuSil = async (randevuId) => {
        try {
            const businessId = '1'; // TODO: Dinamik olarak alınacak
            const response = await fetch(`/api/business/${businessId}/appointments?id=${randevuId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Randevuları güncelle
                setRandevular(prevRandevular =>
                    prevRandevular.filter(randevu => randevu.id !== randevuId)
                );
                toast.success('Randevu silindi');
            } else {
                throw new Error('Randevu silinemedi');
            }
        } catch (error) {
            console.error('Randevu silme hatası:', error);
            toast.error('Randevu silinirken bir hata oluştu');
        }
    };

    // İl değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (firmaProfil.il_id) {
            // Bu ile ait tüm ilçeleri filtrele
            const districts = turkiyeIlIlce.districts.filter(
                d => d.province_id === firmaProfil.il_id
            ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

            setIlceler(districts);

            // Eğer mevcut ilçe bu ile ait değilse ilçe seçimini sıfırla
            const districtExists = districts.some(d => d.id === firmaProfil.ilce_id);
            if (!districtExists) {
                setFirmaProfil(prev => ({
                    ...prev,
                    ilce_id: null,
                    ilce_adi: ''
                }));
            }
        } else {
            setIlceler([]);
            // İl seçimi yoksa ilçe seçimini sıfırla
            setFirmaProfil(prev => ({
                ...prev,
                ilce_id: null,
                ilce_adi: ''
            }));
        }
    }, [firmaProfil.il_id]);

    // Kullanıcı kontrol işlemi
    useEffect(() => {
        if (authLoading) {
            // Auth durumu yükleniyorsa, bekleyelim
            return;
        }

        if (!user) {
            router.push('/firmalar-icin/giris');
            return;
        }

        // Kullanıcı tipini kontrol et
        if (user && !isCompanyAccount()) {
            toast.error('Bu sayfaya erişim yetkiniz bulunmamaktadır');
            router.push('/');
            return;
        }

        fetchFirmaProfil();
    }, [user, authLoading]);

    const fetchFirmaProfil = async () => {
        if (!user) return;

        setFetchLoading(true);
        setFetchError(null);

        try {
            // Businesses tablosundan veri çek
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (businessError) {
                console.error('İşletme verisi çekme hatası:', businessError);
                throw businessError;
            }


            if (businessData) {
                // İşletme verileri başarıyla alındı - ilk kaydı kullan
                setBusinessData(businessData);
                setFirmaProfil({
                    firma_adi: businessData.name || '',
                    email: businessData.email || user.email || '',
                    telefon: businessData.phone || '',
                    adres: businessData.address || '',
                    il_id: businessData.city_id || null,
                    il_adi: businessData.city_name || '',
                    ilce_id: businessData.district_id || null,
                    ilce_adi: businessData.district_name || '',
                    aciklama: businessData.description || '',
                    kapasite: businessData.capacity || '',
                    ozellikler: businessData.features || [],
                    hizmetler: businessData.services || [],
                    id: businessData.id // İşletme ID'sini ekleyelim
                });

                // Profil resmini ayarla
                if (businessData.profile_image_url) {
                    setProfileImage({
                        id: 'profile',
                        src: businessData.profile_image_url,
                        name: 'profile.jpg'
                    });
                }

                // İşletme resimlerini images tablosundan al
                const { data: imagesData, error: imagesError } = await supabase
                    .from('images')
                    .select('*')
                    .eq('business_id', businessData.id)
                    .eq('is_active', true)
                    .order('sequence', { ascending: true });

                if (!imagesError && imagesData) {
                    setBusinessImages(imagesData.map(img => ({
                        id: img.id,
                        url: img.url,
                        sequence: img.sequence
                    })));
                }
            } else {
                // İşletme verisi yoksa boş form göster
                setFirmaProfil({
                    firma_adi: '',
                    email: user.email || '',
                    telefon: '',
                    adres: '',
                    il_id: null,
                    il_adi: '',
                    ilce_id: null,
                    ilce_adi: '',
                    aciklama: '',
                    kapasite: '',
                    ozellikler: [],
                    hizmetler: []
                });
            }
        } catch (error) {
            console.error('Firma profil verisi çekme hatası:', error);
            setFetchError('Profil bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setFetchLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'il_id' && value) {
            // İl seçildiğinde, il adını da kaydet
            const selectedProvince = turkiyeIlIlce.provinces.find(p => p.id === parseInt(value));
            if (selectedProvince) {
                setFirmaProfil(prev => ({
                    ...prev,
                    il_id: parseInt(value),
                    il_adi: selectedProvince.name
                }));
            }
        } else if (name === 'ilce_id' && value) {
            // İlçe seçildiğinde, ilçe adını da kaydet
            const selectedDistrict = turkiyeIlIlce.districts.find(d => d.id === parseInt(value));
            if (selectedDistrict) {
                setFirmaProfil(prev => ({
                    ...prev,
                    ilce_id: parseInt(value),
                    ilce_adi: selectedDistrict.name
                }));
            }
        } else {
            setFirmaProfil(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            // 1. Auth metadatasını güncelle 
            // const { error: authError } = await supabase.auth.updateUser({
            //     data: {
            //         full_name: firmaProfil.firma_adi,
            //         phone: firmaProfil.telefon,
            //     }
            // });

            // if (authError) throw authError;

            // 2. Profiles tablosunu güncelle
            // const { error: profileError } = await supabase
            //     .from('profiles')
            //     .upsert({
            //         phone: firmaProfil.telefon
            //     });

            // if (profileError) throw profileError;

            // 3. Businesses tablosunu güncelle
            const { error: businessError } = await supabase
                .from('businesses')
                .upsert({
                    name: firmaProfil.firma_adi,
                    description: firmaProfil.aciklama,
                    phone: firmaProfil.telefon,
                    address: firmaProfil.adres,
                    city_id: firmaProfil.il_id,
                    city_name: firmaProfil.il_adi,
                    district_id: firmaProfil.ilce_id,
                    district_name: firmaProfil.ilce_adi,
                    features: firmaProfil.ozellikler,
                    services: firmaProfil.hizmetler,
                    updated_at: new Date().toISOString()
                })
                .eq('owner_id', user.id);

            if (businessError) throw businessError;

            toast.success('Firma bilgileriniz başarıyla güncellendi!');
            setIsEditing(false);
        } catch (error) {
            console.error('Firma profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/firmalar-icin');
        } catch (error) {
            console.error('Çıkış hatası:', error);
            toast.error('Çıkış yapılırken bir hata oluştu');
        }
    };

    const handleCallMeSuccess = (formData) => {
        console.log('Form bilgileri:', formData);
        toast.success('Geri arama talebiniz alındı!');
    };

    // Yoruma yanıt yazma fonksiyonu
    const handleReplyChange = (id, value) => {
        setCommentReplies(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Yanıtı kaydetme fonksiyonu
    const handleSaveReply = (id) => {
        if (!commentReplies[id]?.trim()) return;

        // Sadece işlem yapılan yorumun loading durumunu güncelleyelim
        setReplyInProgress(prev => ({
            ...prev,
            [id]: true
        }));

        // API'ye istek gönder
        handleYorumCevap(id, commentReplies[id])
            .then(() => {
                // Form state'ini temizle
                setCommentReplies(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            })
            .finally(() => {
                // Sadece işlem yapılan yorumun loading durumunu sıfırlayalım
                setReplyInProgress(prev => ({
                    ...prev,
                    [id]: false
                }));
            });
    };

    // Yanıt silme fonksiyonu
    const handleDeleteReply = (id) => {
        // Sadece işlem yapılan yorumun loading durumunu güncelleyelim
        setReplyInProgress(prev => ({
            ...prev,
            [id]: true
        }));

        // Silme işlemi için API'ye istek gönder
        handleYorumCevap(id, null)
            .then(() => {
                toast.success('Yanıt silindi!');
            })
            .finally(() => {
                // Sadece işlem yapılan yorumun loading durumunu sıfırlayalım
                setReplyInProgress(prev => ({
                    ...prev,
                    [id]: false
                }));
            });
    };

    // Takvimde bir tarih seçildiğinde
    const handleSelectDate = (date, events) => {
        setSelectedDate(date);
        setSelectedEvents(events);
        setEventDetailsModalOpen(true);
    };

    // Yeni randevu ekleme işlemi
    const handleAddRandevu = () => {
        setSelectedRandevu(null);  // yeni randevu, seçili randevu yok
        setRandevuIsEdit(false);   // düzenleme modu değil
        setRandevuModalOpen(true);
    };

    // Yeni randevu eklendiğinde ve randevu güncellendiğinde
    const handleRandevuSuccess = (newRandevu) => {
        console.log('Randevu işlemi:', newRandevu);
        // Gerçek uygulamada API çağrısı burada yapılabilir

        if (newRandevu.id && randevular.some(r => r.id === newRandevu.id)) {
            // Randevu güncelleme durumu
            // Mock veriyi güncelle (gerçek uygulamada farklı olacak)
            // const updatedMockRandevular = mockRandevular.map(r =>
            //     r.id === newRandevu.id ? newRandevu : r
            // );
            // setMockRandevular(updatedMockRandevular);
            toast.success('Randevu başarıyla güncellendi!');
        } else {
            // Yeni randevu ekleme durumu
            // Mevcut verilere yeni randevuyu ekle (mock veri için)
            // setMockRandevular(prev => [newRandevu, ...prev]);
            toast.success('Randevu başarıyla eklendi!');
        }
    };

    // Sadece bunu siliyorum, 584. satırda yeniden tanımlanıyor

    const handleProfileImageChange = async (newImage) => {
        setProfileImage(newImage);


        // Gerçek uygulamada burada veritabanına kaydetme işlemi yapılabilir
        try {
            const { error } = await supabase
                .from('businesses')
                .update({
                    profile_image_url: newImage ? newImage.src : null,
                    updated_at: new Date().toISOString()
                })
                .eq('owner_id', user.id);

            if (error) throw error;

            toast.success(newImage ? 'Profil resmi güncellendi' : 'Profil resmi kaldırıldı');
        } catch (error) {
            console.error('Profil resmi güncelleme hatası:', error);
            toast.error('Profil resmi güncellenirken bir hata oluştu');
        }
    };

    const handleBusinessImagesChange = (newImages) => {
        setBusinessImages(newImages);
    };

    // Teklif başarıyla gönderildiğinde
    const handleTeklifSuccess = (newTeklif) => {
        // Teklif listesini güncelle
        setTeklifler(prev =>
            prev.map(teklif =>
                teklif.id === newTeklif.id ?
                    {
                        ...teklif,
                        durum: 'Gönderildi',
                        fiyat: newTeklif.fiyat,
                        paket: newTeklif.paket || teklif.paket
                    } : teklif
            )
        );

        toast.success('Teklif başarıyla gönderildi!');
    };

    // Etkinlik detayları modalından randevu ekle butonuna tıklandığında
    const handleAddRandevuFromCalendar = (date) => {
        setSelectedDate(date);
        setSelectedRandevu(null);  // yeni randevu, seçili randevu yok
        setRandevuIsEdit(false);   // düzenleme modu değil
        setRandevuModalOpen(true);
    };

    // Etkinlik detayları modalından rezervasyon ekle butonuna tıklandığında
    const handleAddRezervasyonFromCalendar = (date) => {
        setSelectedDate(date);
        setRezervasyonModalMode('add');
        setRezervasyonModalOpen(true);
    };

    // Rezervasyon yönetimi ile ilgili fonksiyonlar
    const handleRezervasyonSuccess = (newRezervasyon) => {
        console.log('Yeni rezervasyon:', newRezervasyon);
        // Gerçek uygulamada API çağrısı burada yapılabilir

        // Mevcut verilere yeni rezervasyonu ekle (mock veri için)
        // setMockRezervasyon(prev => [newRezervasyon, ...prev]);

        toast.success('Rezervasyon başarıyla eklendi!');
    };

    const handleRezervasyonUpdate = (updatedRezervasyon) => {
        if (updatedRezervasyon.requiresEdit) {
            // Düzenleme moduna geçiş
            setRezervasyonModalMode('edit');
            setSelectedRezervasyon(updatedRezervasyon);
            setRezervasyonModalOpen(true);
            return;
        }

        // Güncellenmiş rezervasyon verilerini işle
        // Gerçek uygulamada burada API çağrısı yapılabilir

        // Mock veriyi güncelle (gerçek uygulamada farklı olacak)
        const updatedMockRezervasyon = mockRezervasyon.map(r =>
            r.id === updatedRezervasyon.id ? updatedRezervasyon : r
        );

        // UI'da güncellenen verileri göster
        // setMockRezervasyon(updatedMockRezervasyon);

        toast.success('Rezervasyon başarıyla güncellendi!');
    };

    const handleOpenRezervasyonModal = (mode, rezervasyon = null) => {
        setRezervasyonModalMode(mode);
        setSelectedRezervasyon(rezervasyon);
        setRezervasyonModalOpen(true);
    };

    // Yeni bir soruCevap eklendiğinde çağrılacak fonksiyon
    const handleSoruCevapSuccess = (newSoruCevap) => {
        // Yeni soru-cevap'ı mevcut listeye ekle
        setSorular(prev => [newSoruCevap, ...prev]);
        toast.success('Soru & Cevap başarıyla eklendi!');
    };

    // Soru yanıtlama işlevleri
    const handleSoruYanitChange = (id, value) => {
        setSoruYanitlar(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSoruYanitla = (id) => {
        if (!soruYanitlar[id]?.trim()) return;

        setYanitGonderiliyor(true);

        // API'ye istek gönder
        handleSoruCevap(id, soruYanitlar[id])
            .then(() => {
                // State'i temizle
                setSoruYanitlar(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            })
            .finally(() => {
                setYanitGonderiliyor(false);
            });
    };

    // Takvim için randevu ve rezervasyon verilerini hazırla
    const randevuEvents = randevular.map(randevu => ({
        ...randevu,
        type: 'randevu'
    }));

    const rezervasyonEvents = rezervasyonlar.map(rezervasyon => ({
        ...rezervasyon,
        type: 'rezervasyon'
    }));

    // Kullanıcı giriş yapmamışsa veya firma hesabı değilse
    if (authLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <h1 className="text-xl font-semibold mb-4">Yükleniyor</h1>
                        <p className="mb-6 text-darkgray">
                            Kullanıcı bilgileri yükleniyor, lütfen bekleyin...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!user || !isCompanyAccount()) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
                        <h1 className="text-xl font-semibold mb-4">Erişim Reddedildi</h1>
                        <p className="mb-6 text-darkgray">
                            Bu sayfaya erişim yetkiniz bulunmamaktadır.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/" className="text-primary font-medium hover:underline">
                                Ana Sayfaya Dön
                            </Link>
                            <Link href="/firmalar-icin/giris" className="text-primary font-medium hover:underline">
                                Firma Girişi Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Firma Paneli</h1>
                    <Button onClick={handleSignOut} variant="outline">Çıkış Yap</Button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Tabs defaultValue={activeTab}>
                        <TabsList className="mb-8 flex flex-wrap gap-2">
                            <TabsTrigger value="profil">Firma Bilgileri</TabsTrigger>
                            <TabsTrigger value="teklifler">Teklifler</TabsTrigger>
                            <TabsTrigger value="rezervasyonlar">Rezervasyonlar</TabsTrigger>
                            <TabsTrigger value="randevular">Randevular</TabsTrigger>
                            <TabsTrigger value="sorucevap">Soru-Cevap</TabsTrigger>
                            <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profil" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Firma Bilgileri</h2>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? "outline" : "default"}
                                >
                                    {isEditing ? "İptal" : <><Edit size={16} className="mr-2" /> Düzenle</>}
                                </Button>
                            </div>

                            {fetchError && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                                    {fetchError}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="mb-8">
                                        <ProfileImageUploader
                                            image={profileImage}
                                            onChange={handleProfileImageChange}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="firma_adi" className="block text-sm font-medium text-text mb-1">
                                            Firma Adı
                                        </label>
                                        <input
                                            type="text"
                                            id="firma_adi"
                                            name="firma_adi"
                                            value={firmaProfil.firma_adi}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={submitLoading}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={firmaProfil.email}
                                            className="w-full border border-border rounded-md p-3 text-text bg-gray-50"
                                            disabled={true}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            E-posta adresinizi değiştiremezsiniz
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefon"
                                                name="telefon"
                                                value={firmaProfil.telefon}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={submitLoading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="adres" className="block text-sm font-medium text-text mb-1">
                                            Adres
                                        </label>
                                        <input
                                            type="text"
                                            id="adres"
                                            name="adres"
                                            value={firmaProfil.adres}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={submitLoading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="il_id" className="block text-sm font-medium text-text mb-1">
                                                İl
                                            </label>
                                            <select
                                                id="il_id"
                                                name="il_id"
                                                value={firmaProfil.il_id || ''}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={submitLoading}
                                            >
                                                <option value="">Seçiniz</option>
                                                {turkiyeIlIlce.provinces.sort((a, b) =>
                                                    a.name.localeCompare(b.name, 'tr')
                                                ).map(province => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="ilce_id" className="block text-sm font-medium text-text mb-1">
                                                İlçe
                                            </label>
                                            <select
                                                id="ilce_id"
                                                name="ilce_id"
                                                value={firmaProfil.ilce_id || ''}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={submitLoading || !firmaProfil.il_id}
                                            >
                                                <option value="">Seçiniz</option>
                                                {ilceler.map(district => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="aciklama" className="block text-sm font-medium text-text mb-1">
                                            Firma Açıklaması
                                        </label>
                                        <textarea
                                            id="aciklama"
                                            name="aciklama"
                                            value={firmaProfil.aciklama}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={submitLoading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">
                                            Mekan Özellikleri
                                        </label>
                                        <TagInput
                                            tags={firmaProfil.ozellikler || []}
                                            onTagsChange={(newTags) => setFirmaProfil(prev => ({ ...prev, ozellikler: newTags }))}
                                            placeholder="Özellik ekleyin (örn: Açık Alan, Havuz, Otopark...)"
                                            maxTags={10}
                                            disabled={submitLoading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">
                                            Sunulan Hizmetler
                                        </label>
                                        <TagInput
                                            tags={firmaProfil.hizmetler || []}
                                            onTagsChange={(newTags) => setFirmaProfil(prev => ({ ...prev, hizmetler: newTags }))}
                                            placeholder="Hizmet ekleyin (örn: DJ, Fotoğrafçı, Catering...)"
                                            maxTags={10}
                                            disabled={submitLoading}
                                        />
                                    </div>

                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={submitLoading}
                                            className="w-full md:w-auto"
                                        >
                                            {submitLoading ? (
                                                <>
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                    Kaydediliyor...
                                                </>
                                            ) : 'Değişiklikleri Kaydet'}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex mb-8">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mr-6 flex-shrink-0">
                                            {profileImage ? (
                                                <img
                                                    src={profileImage.src}
                                                    alt="Profil resmi"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                                    <User className="h-16 w-16 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h1 className="text-2xl font-bold mb-2">{firmaProfil.firma_adi}</h1>
                                            {firmaProfil.il_adi && (
                                                <p className="flex items-center text-gray-500 mb-1">
                                                    <MapPin size={16} className="mr-1" />
                                                    {firmaProfil.il_adi}
                                                    {firmaProfil.ilce_adi && `, ${firmaProfil.ilce_adi}`}
                                                </p>
                                            )}
                                            {firmaProfil.telefon && (
                                                <p className="flex items-center text-gray-500 mb-1">
                                                    <Phone size={16} className="mr-1" />
                                                    {firmaProfil.telefon}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Firma Açıklaması</h3>
                                            <div className="">
                                                {firmaProfil.aciklama ? (
                                                    <p>{firmaProfil.aciklama}</p>
                                                ) : (
                                                    <p className="text-gray-400 italic">Henüz firma açıklaması girilmemiş</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Mekan Özellikleri</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {firmaProfil.ozellikler?.length > 0 ? (
                                                    firmaProfil.ozellikler.map((ozellik, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-primary/10 text-primary"
                                                        >
                                                            {ozellik}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 italic">Henüz özellik eklenmemiş</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Sunulan Hizmetler</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {firmaProfil.hizmetler?.length > 0 ? (
                                                    firmaProfil.hizmetler.map((hizmet, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-primary/10 text-primary"
                                                        >
                                                            {hizmet}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 italic">Henüz hizmet eklenmemiş</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t">
                                <ImageUploader
                                    images={businessImages}
                                    onChange={handleBusinessImagesChange}
                                    maxImages={10}
                                    title="İşletme Fotoğrafları"
                                    description="Mekanınızı en iyi şekilde tanıtan fotoğraflar ekleyin. İlk fotoğraf kapak fotoğrafı olarak görüntülenecektir."
                                    businessId={businessData?.id}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="teklifler" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Teklifler</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Müşteri
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Telefon
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Paket
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fiyat
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teklifler.map((teklif) => (
                                            <tr key={teklif.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{teklif.musteri}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <a href={`tel:${teklif.telefon.replace(/\s+/g, '')}`} className="text-primary hover:underline">
                                                            {teklif.telefon}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{teklif.tarih}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {teklif.paket}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {teklif.fiyat.toLocaleString('tr-TR')} ₺
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teklif.durum === "Gönderildi" ? "bg-green-100 text-green-800" :
                                                        teklif.durum === "Beklemede" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                        {teklif.durum}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {teklif.durum === "Beklemede" ? (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedTeklif(teklif);
                                                                setTeklifModalOpen(true);
                                                            }}
                                                        >
                                                            Teklif Ver
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedTeklif(teklif);
                                                                setTeklifModalOpen(true);
                                                            }}
                                                        >
                                                            Detay
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {teklifler.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz teklif bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="rezervasyonlar" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Rezervasyonlar</h2>
                                <div className="flex gap-3 items-center">
                                    <div className="flex bg-gray-100 rounded-md p-1">
                                        <button
                                            className={`px-3 py-1.5 rounded ${rezervasyonView === 'list' ? 'bg-white shadow-sm' : ''}`}
                                            onClick={() => setRezervasyonView('list')}
                                        >
                                            <ListFilter size={16} />
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded ${rezervasyonView === 'calendar' ? 'bg-white shadow-sm' : ''}`}
                                            onClick={() => setRezervasyonView('calendar')}
                                        >
                                            <CalendarIcon size={16} />
                                        </button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => handleOpenRezervasyonModal('add')}
                                    >
                                        <Plus size={16} />
                                        Rezervasyon Ekle
                                    </Button>
                                </div>
                            </div>

                            {rezervasyonView === 'calendar' ? (
                                <div className="mt-4">
                                    <Calendar
                                        events={rezervasyonEvents}
                                        onSelectDate={handleSelectDate}
                                    />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Müşteri
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Telefon
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tarih
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Paket
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Misafir Sayısı
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ödeme Durumu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tutar
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tür
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {rezervasyonlar.map((rezervasyon) => (
                                                <tr key={rezervasyon.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{rezervasyon.musteri}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {rezervasyon.telefon ? (
                                                                <a href={`tel:${rezervasyon.telefon.replace(/\s+/g, '')}`} className="text-primary hover:underline">
                                                                    {rezervasyon.telefon}
                                                                </a>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{rezervasyon.tarih}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.paket}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.misafir_sayisi}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rezervasyon.odeme_durumu === "Tamamı Ödendi" ? "bg-green-100 text-green-800" :
                                                            rezervasyon.odeme_durumu === "Kapora Alındı" ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {rezervasyon.odeme_durumu}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.tutar?.toLocaleString('tr-TR')} ₺
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.tur}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                handleOpenRezervasyonModal('view', rezervasyon);
                                                            }}
                                                        >
                                                            Detay
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {rezervasyonlar.length === 0 && rezervasyonView === 'list' && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz rezervasyon bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="randevular" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Randevular</h2>
                                <div className="flex gap-3 items-center">
                                    <div className="flex bg-gray-100 rounded-md p-1">
                                        <button
                                            className={`px-3 py-1.5 rounded ${randevuView === 'list' ? 'bg-white shadow-sm' : ''}`}
                                            onClick={() => setRandevuView('list')}
                                        >
                                            <ListFilter size={16} />
                                        </button>
                                        <button
                                            className={`px-3 py-1.5 rounded ${randevuView === 'calendar' ? 'bg-white shadow-sm' : ''}`}
                                            onClick={() => setRandevuView('calendar')}
                                        >
                                            <CalendarIcon size={16} />
                                        </button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={handleAddRandevu}
                                    >
                                        <Plus size={16} />
                                        Randevu Ekle
                                    </Button>
                                </div>
                            </div>

                            {randevuView === 'calendar' ? (
                                <div className="mt-4">
                                    <Calendar
                                        events={randevuEvents}
                                        onSelectDate={handleSelectDate}
                                    />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Müşteri
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Telefon
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tarih
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Saat
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Durum
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {randevular.map((randevu) => (
                                                <tr key={randevu.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{randevu.musteri}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {randevu.telefon ? (
                                                                <a href={`tel:${randevu.telefon.replace(/\s+/g, '')}`} className="text-primary hover:underline">
                                                                    {randevu.telefon}
                                                                </a>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{randevu.tarih}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{randevu.saat}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${randevu.durum === "Tamamlandı" ? "bg-green-100 text-green-800" :
                                                            randevu.durum === "Beklemede" ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-red-100 text-red-800"
                                                            }`}>
                                                            {randevu.durum}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRandevu(randevu);
                                                                setRandevuIsEdit(true);  // düzenleme modu aktif
                                                                setRandevuModalOpen(true);
                                                            }}
                                                        >
                                                            Düzenle
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {randevular.length === 0 && randevuView === 'list' && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz randevu bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sorucevap" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Soru & Cevaplar</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => setSoruCevapModalOpen(true)}
                                    >
                                        <Plus size={16} />
                                        Soru & Cevap Ekle
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {sorular.map((soru) => (
                                    <div key={soru.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{soru.musteri}</div>
                                            <div className="text-sm text-gray-500">{soru.tarih}</div>
                                        </div>
                                        <div className="mt-2 bg-gray-50 p-3 rounded-md">
                                            <p className="font-medium text-gray-800">{soru.soru}</p>
                                        </div>

                                        {soru.cevap ? (
                                            <div className="mt-3 ml-4 border-l-2 border-primary pl-3">
                                                <p className="text-sm font-medium text-gray-500 mb-1">Cevabınız:</p>
                                                <p>{soru.cevap}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                    rows="2"
                                                    placeholder="Bu soruyu yanıtlayın..."
                                                    value={soruYanitlar[soru.id] || ''}
                                                    onChange={(e) => handleSoruYanitChange(soru.id, e.target.value)}
                                                    disabled={yanitGonderiliyor}
                                                ></textarea>
                                                <div className="mt-2 flex justify-end">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSoruYanitla(soru.id)}
                                                        disabled={yanitGonderiliyor || !soruYanitlar[soru.id]?.trim()}
                                                    >
                                                        {yanitGonderiliyor ? (
                                                            <>
                                                                <span className="animate-spin mr-2">●</span>
                                                                Yanıtlanıyor...
                                                            </>
                                                        ) : 'Yanıtla'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {sorular.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz soru bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="yorumlar" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-xl font-semibold">Müşteri Yorumları</h2>
                                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
                                    <div className="text-yellow-700 font-medium flex items-center">
                                        <span>Ortalama Puan:</span>
                                        <span className="mx-2 text-xl">
                                            {yorumlar.length > 0
                                                ? (yorumlar.reduce((total, yorum) => total + yorum.puan, 0) / yorumlar.length).toFixed(1)
                                                : 0}
                                        </span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, index) => {
                                                const rating = yorumlar.length > 0
                                                    ? (yorumlar.reduce((total, yorum) => total + yorum.puan, 0) / yorumlar.length)
                                                    : 0;
                                                return (
                                                    <span
                                                        key={index}
                                                        className={`text-lg ${index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">({yorumlar.length} yorum)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {yorumlar.map((yorum) => (
                                    <div key={yorum.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-lg">{yorum.musteri}</div>
                                            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">{yorum.tarih}</div>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            {[...Array(5)].map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xl ${index < yorum.puan ? 'text-yellow-500' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-gray-700">{yorum.comment}</p>

                                        {/* Eğer yoruma cevap varsa göster */}
                                        {yorum.answer ? (
                                            <div className="mt-4 ml-4 pl-4 border-l-4 border-primary/30 bg-blue-50/50 p-3 rounded-md relative">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-sm font-semibold text-primary">İşletme Yanıtı</h4>
                                                    <button
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Yanıtı Sil"
                                                        onClick={() => handleDeleteReply(yorum.id)}
                                                        disabled={replyInProgress[yorum.id]}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 text-sm">{yorum.answer}</p>
                                            </div>
                                        ) : (
                                            /* Yoksa yanıt yazma formunu göster */
                                            <div className="mt-4">
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-primary focus:border-primary resize-none"
                                                    rows="2"
                                                    placeholder="Bu yorumu yanıtlayın..."
                                                    value={commentReplies[yorum.id] || ''}
                                                    onChange={(e) => handleReplyChange(yorum.id, e.target.value)}
                                                    disabled={replyInProgress[yorum.id]}
                                                ></textarea>
                                                <div className="mt-2 flex justify-end">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveReply(yorum.id)}
                                                        disabled={!commentReplies[yorum.id]?.trim() || replyInProgress[yorum.id]}
                                                    >
                                                        {replyInProgress[yorum.id] ? (
                                                            <>
                                                                <Loader2 size={14} className="mr-2 animate-spin" />
                                                                Kaydediliyor...
                                                            </>
                                                        ) : 'Yanıtla'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {yorumlar.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz yorum bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <CallMeForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleCallMeSuccess}
            />

            <EventDetailsModal
                isOpen={eventDetailsModalOpen}
                onClose={() => setEventDetailsModalOpen(false)}
                date={selectedDate}
                events={selectedEvents}
                onAddRandevu={handleAddRandevuFromCalendar}
                onAddRezervasyon={handleAddRezervasyonFromCalendar}
            />

            <RandevuModal
                isOpen={randevuModalOpen}
                onClose={() => {
                    setRandevuModalOpen(false);
                    setSelectedRandevu(null);
                    setRandevuIsEdit(false);
                }}
                onSuccess={handleRandevuSuccess}
                preselectedDate={selectedDate}
                randevuId={selectedRandevu?.id}
                isEdit={randevuIsEdit}
            />

            <RezervasyonModal
                isOpen={rezervasyonModalOpen}
                onClose={() => {
                    setRezervasyonModalOpen(false);
                    setSelectedRezervasyon(null);
                }}
                onSuccess={handleRezervasyonSuccess}
                onUpdate={handleRezervasyonUpdate}
                preselectedDate={selectedDate}
                rezervasyonId={selectedRezervasyon?.id}
                isEdit={rezervasyonModalMode === 'edit'}
                readOnly={rezervasyonModalMode === 'view'}
            />

            {selectedTeklif && (
                <TeklifModal
                    isOpen={teklifModalOpen}
                    onClose={() => {
                        setTeklifModalOpen(false);
                        setSelectedTeklif(null);
                    }}
                    teklifId={selectedTeklif.id}
                    teklif={selectedTeklif}
                    readOnly={selectedTeklif.durum !== "Beklemede"}
                    onSuccess={handleTeklifSuccess}
                />
            )}

            <SoruCevapModal
                isOpen={soruCevapModalOpen}
                onClose={() => setSoruCevapModalOpen(false)}
                onSuccess={handleSoruCevapSuccess}
            />

            <Toaster position="top-right" />
        </Layout>
    );
} 