"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { StoryModal } from '@/components/modals/StoryModal';
import { Calendar } from '@/components/ui/calendar';
import { EventDetailsModal } from '@/components/modals/EventDetailsModal';
import { RandevuModal } from '@/components/modals/RandevuModal';
import { RezervasyonModal } from '@/components/modals/RezervasyonModal';
import { SearchableTable } from '@/components/ui/SearchableTable';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ProfileImageUploader } from '@/components/ui/ProfileImageUploader';
import { TeklifModal } from '@/components/modals/TeklifModal';

export default function FirmaProfilPage() {
    const router = useRouter();
    const { user, isCompanyAccount, signOut, isLoading: authLoading } = useAuth();

    // Mock veriler
    const mockTeklifler = [
        { id: 1, musteri: "Ahmet Yılmaz", telefon: '0555 555 55 55', paket: "Başlangıç", tarih: "12.08.2023", durum: "Beklemede", fiyat: 12500 },
        { id: 2, musteri: "Zeynep Kaya", telefon: '0555 555 55 55', paket: "Orta", tarih: "05.09.2023", durum: "Gönderildi", fiyat: 15800 },
        { id: 3, musteri: "Mehmet Demir", telefon: '0555 555 55 55', paket: "Herşey Dahil", tarih: "18.09.2023", durum: "Gönderildi", fiyat: 8750 },
        { id: 4, musteri: "Ayşe Çelik", telefon: '0555 555 55 55', paket: "Orta", tarih: "22.09.2023", durum: "Beklemede", fiyat: 22000 },
        { id: 5, musteri: "Fatma Şahin", telefon: '0555 555 55 55', paket: "Herşey Dahil", tarih: "01.10.2023", durum: "Gönderildi", fiyat: 18500 }
    ];

    const mockRezervasyon = [
        { id: 1, musteri: "Ali Veli", telefon: "0555 555 55 55", paket: "Başlangıç", tarih: "15.11.2023", misafirSayisi: 250, odemeDurumu: "Kapora Alındı", tutar: 35000, type: "Ön Rezervasyon" },
        { id: 2, musteri: "Hande Doğan", telefon: "0533 333 33 33", paket: "Orta", tarih: "22.12.2023", misafirSayisi: 120, odemeDurumu: "Tamamı Ödendi", tutar: 22000, type: "Ön Rezervasyon" },
        { id: 3, musteri: "Serkan Öz", telefon: "0544 444 44 44", paket: "Herşey Dahil", tarih: "05.01.2024", misafirSayisi: 180, odemeDurumu: "Kapora Alındı", tutar: 28500, type: "Ön Rezervasyon" },
        { id: 4, musteri: "Ece Güneş", telefon: "0522 222 22 22", paket: "Orta", tarih: "14.02.2024", misafirSayisi: 300, odemeDurumu: "Beklemede", tutar: 42000, type: "Ön Rezervasyon" }
    ];

    const mockRandevular = [
        { id: 1, musteri: "Selin Öztürk", telefon: "0555 111 11 11", tarih: "08.10.2023", saat: "14:30", durum: "Tamamlandı" },
        { id: 2, musteri: "Hakan Demirci", telefon: "0533 222 22 22", tarih: "12.10.2023", saat: "11:00", durum: "Beklemede" },
        { id: 3, musteri: "Nihan Aktaş", telefon: "0544 333 33 33", tarih: "15.10.2023", saat: "16:00", durum: "Beklemede" },
        { id: 4, musteri: "Berk Yıldız", telefon: "0522 444 44 44", tarih: "18.10.2023", saat: "10:30", durum: "İptal Edildi" }
    ];

    const mockSorular = [
        { id: 1, musteri: "Ceyda Kılıç", tarih: "01.10.2023", soru: "Nişan tarihini değiştirmek istiyoruz, ne yapmamız gerekiyor?", cevap: "Merhaba, en az 2 hafta önceden bildirmeniz durumunda tarih değişikliği yapabiliriz." },
        { id: 2, musteri: "Emre Aydın", tarih: "03.10.2023", soru: "Vejetaryen misafirlerimiz için özel menü seçeneğiniz var mı?", cevap: null },
        { id: 3, musteri: "Pınar Yücel", tarih: "04.10.2023", soru: "Düğün fotoğrafçısı ve kameraman için ekstra ücret ödememiz gerekiyor mu?", cevap: "Tüm paketlerimizde fotoğrafçı ve kameraman hizmeti dahildir, ekstra ücret ödemenize gerek yok." },
        { id: 4, musteri: "Kaan Işık", tarih: "05.10.2023", soru: "Davet salonunun maksimum kapasitesi nedir?", cevap: "Ana salonumuz 400 kişi kapasitesine sahiptir." }
    ];

    const mockComments = [
        { id: 1, musteri: "Deniz & Murat", tarih: "25.08.2023", puan: 5, comment: "Harika bir düğün oldu, herşey için çok teşekkürler!", answer: "Teşekkürler, umarım gelecekte  tekrar görüşelim." },
        { id: 2, musteri: "Sevgi & Onur", tarih: "12.09.2023", puan: 4, comment: "Yemekler muhteşemdi, organizasyon çok başarılıydı. Daha iyi olabilecek tek şey parkın biraz daha geniş olması olabilirdi.", answer: "Teşekkürler, hayat boyu mutluluklar dileriz." },
        { id: 3, musteri: "Elif & Burak", tarih: "18.09.2023", puan: 3, comment: "Mekan çok güzeldi fakat hizmet konusunda biraz geç kalındı." },
        { id: 4, musteri: "Gamze & Alper", tarih: "30.09.2023", puan: 5, comment: "Hayalimizdeki düğünü gerçekleştirdik, herşey kusursuzdu!" }
    ];

    const mockStories = [
        { id: 1, name: "Merve & Can'ın Bitmeyen Aşk Hikayeleri", category: 'nisan', tarih: "05.08.2023", hikaye: "2 yıllık bir ilişkinin ardından Can'ın sürpriz evlilik teklifi ile nişanlandık. Tekliften 6 ay sonra ise muhteşem bir düğünle hayatımızı birleştirdik. Düğün mekanı olarak Sunset Garden'ı seçtiğimiz için çok mutluyuz. Harika manzara ve profesyonel hizmet sayesinde unutulmaz bir gün yaşadık. Tüm misafirlerimiz de mekanı ve organizasyonu çok beğendi.", image: "/images/person-1.webp" },
        { id: 2, name: "Zeynep & Arda'nın İlham Veren Hikayesi", category: 'soz-nisan', tarih: "15.09.2023", hikaye: "Üniversitede tanıştık ve 5 yıl boyunca ayrı şehirlerde yaşadıktan sonra nihayet hayatlarımızı birleştirdik. Uzun yıllar süren uzak mesafe ilişkimiz, sabır ve sevgiyle güçlendi. Nişanımızı 100 kişinin katıldığı samimi bir törenle kutladık. Düğün günümüzde hava şartları biraz zorladı ama personelin hızlı çözümleriyle her şey harika geçti. Balayımızı İtalya'da geçirdik ve şimdi birlikte yeni hayatımıza adım attık.", image: "/images/person-4.jpg" }
    ];

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [firmaProfil, setFirmaProfil] = useState({
        firma_adi: '',
        email: '',
        telefon: '',
        adres: '',
        il_id: null,
        il_adi: '',
        ilce_id: null,
        ilce_adi: '',
        aciklama: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [ilceler, setIlceler] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [storyModalOpen, setStoryModalOpen] = useState(false);
    const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
    const [randevuModalOpen, setRandevuModalOpen] = useState(false);
    const [rezervasyonModalOpen, setRezervasyonModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [rezervasyonView, setRezervasyonView] = useState('list'); // 'list' veya 'calendar'
    const [randevuView, setRandevuView] = useState('list'); // 'list' veya 'calendar'
    const [profileImage, setProfileImage] = useState(null);
    const [businessImages, setBusinessImages] = useState([]);
    const [savingImages, setSavingImages] = useState(false);
    const [teklifModalOpen, setTeklifModalOpen] = useState(false);
    const [selectedTeklif, setSelectedTeklif] = useState(null);
    const [teklifler, setTeklifler] = useState(mockTeklifler);
    const [selectedRezervasyon, setSelectedRezervasyon] = useState(null);
    const [selectedRandevu, setSelectedRandevu] = useState(null);
    const [randevuIsEdit, setRandevuIsEdit] = useState(false);
    const [rezervasyonModalMode, setRezervasyonModalMode] = useState('add'); // 'add', 'edit', 'view'

    // Yorum yanıtlama state'leri
    const [commentReplies, setCommentReplies] = useState({});
    const [replyInProgress, setReplyInProgress] = useState(false);

    // Takvim için randevu ve rezervasyon verilerini hazırla
    const randevuEvents = mockRandevular.map(randevu => ({
        ...randevu,
        type: 'randevu'
    }));

    const rezervasyonEvents = mockRezervasyon.map(rezervasyon => ({
        ...rezervasyon,
        type: 'rezervasyon'
    }));

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
            // Önce businesses tablosundan veri çekmeyi deneyelim
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (!businessError && businessData) {
                // İşletme verileri başarıyla alındı
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
                    ozellikler: businessData.features || []
                });

                // Profil resmini ayarla
                if (businessData.profile_image) {
                    setProfileImage({
                        id: 'profile',
                        src: businessData.profile_image,
                        name: 'profile.jpg'
                    });
                }

                // İşletme resimlerini ayarla
                if (businessData.images && Array.isArray(businessData.images)) {
                    setBusinessImages(businessData.images);
                }

                return; // Veri başarıyla alındı, fonksiyonu sonlandır
            }

            // İşletme verisi yoksa veya hata varsa profiles tablosundan almayı dene
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                // Eğer gerçek bir veri hatası varsa (not found hariç)
                if (profileError.code !== 'PGRST116') {
                    console.error('Profil veri hatası:', profileError);
                    throw profileError;
                }
            }

            // Profil verileri başarıyla alındıysa kullan
            if (profileData) {
                setFirmaProfil({
                    firma_adi: profileData.full_name || user.user_metadata?.full_name || '',
                    email: profileData.email || user.email || '',
                    telefon: profileData.phone || user.user_metadata?.phone || '',
                    adres: profileData.address || user.user_metadata?.address || '',
                    il_id: profileData.city_id || user.user_metadata?.city_id || null,
                    il_adi: profileData.city_name || user.user_metadata?.city_name || '',
                    ilce_id: profileData.district_id || user.user_metadata?.district_id || null,
                    ilce_adi: profileData.district_name || user.user_metadata?.district_name || '',
                    aciklama: profileData.description || user.user_metadata?.description || '',
                });
                return;
            }

            // Hiçbir yerden veri alınamadıysa, user metadata'sını kullan
            setFirmaProfil({
                firma_adi: user.user_metadata?.full_name || '',
                email: user.email || '',
                telefon: user.user_metadata?.phone || '',
                adres: user.user_metadata?.address || '',
                il_id: user.user_metadata?.city_id || null,
                il_adi: user.user_metadata?.city_name || '',
                ilce_id: user.user_metadata?.district_id || null,
                ilce_adi: user.user_metadata?.district_name || '',
                aciklama: user.user_metadata?.description || '',
            });
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
        setLoading(true);

        try {
            // 1. Auth metadatasını güncelle
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: firmaProfil.firma_adi,
                    phone: firmaProfil.telefon,
                    adres: firmaProfil.adres,
                    city_id: firmaProfil.il_id,
                    city_name: firmaProfil.il_adi,
                    district_id: firmaProfil.ilce_id,
                    district_name: firmaProfil.ilce_adi,
                    aciklama: firmaProfil.aciklama
                }
            });

            if (authError) throw authError;

            // 2. Profiles tablosunu güncelle
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: firmaProfil.firma_adi,
                    email: user.email,
                    phone: firmaProfil.telefon,
                    adres: firmaProfil.adres,
                    city_id: firmaProfil.il_id,
                    city_name: firmaProfil.il_adi,
                    district_id: firmaProfil.ilce_id,
                    district_name: firmaProfil.ilce_adi,
                    aciklama: firmaProfil.aciklama,
                    updated_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            toast.success('Firma bilgileriniz başarıyla güncellendi!');
            setIsEditing(false);
        } catch (error) {
            console.error('Firma profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
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

        setReplyInProgress(true);

        // Mock veri güncelleme - gerçek uygulamada API çağrısı yapılır
        setTimeout(() => {
            const updatedComments = mockComments.map(comment => {
                if (comment.id === id) {
                    return {
                        ...comment,
                        answer: commentReplies[id]
                    };
                }
                return comment;
            });

            // Normalde burada state güncellemesi olacak:
            // setMockComments(updatedComments);

            // Yanıt gönderildi bildirimi
            toast.success('Yanıtınız kaydedildi!');

            // Form state'ini temizle
            setCommentReplies(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });

            setReplyInProgress(false);
        }, 500);
    };

    // Yanıt silme fonksiyonu
    const handleDeleteReply = (id) => {
        setReplyInProgress(true);

        // Mock veri güncelleme - gerçek uygulamada API çağrısı yapılır
        setTimeout(() => {
            const updatedComments = mockComments.map(comment => {
                if (comment.id === id) {
                    const { answer, ...rest } = comment;
                    return rest;
                }
                return comment;
            });

            // Normalde burada state güncellemesi olacak:
            // setMockComments(updatedComments);

            toast.success('Yanıt silindi!');
            setReplyInProgress(false);
        }, 500);
    };

    // Yeni hikaye ekleme fonksiyonu
    const handleStorySuccess = (storyData) => {
        console.log('Yeni hikaye:', storyData);

        // Gerçek bir uygulamada burada veritabanına kaydetme işlemi yapılır
        // Şimdilik mevcut hikayelere ekliyoruz (mock veri)
        const newStory = {
            id: mockStories.length + 1,
            name: storyData.name,
            tarih: new Date().toLocaleDateString('tr-TR'),
            hikaye: storyData.hikaye,
            image: "/images/person-1.webp" // Gerçek uygulamada yüklenen resmin URL'si kullanılır
        };

        // Mock veriyi güncelliyoruz (gerçek uygulamada bu kısım farklı olacak)
        // setMockStories([newStory, ...mockStories]);

        toast.success('Hikaye başarıyla eklendi!');
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

        if (newRandevu.id && mockRandevular.some(r => r.id === newRandevu.id)) {
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
                    profile_image: newImage ? newImage.src : null,
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

    const handleSaveBusinessImages = async () => {
        setSavingImages(true);

        try {
            const { error } = await supabase
                .from('businesses')
                .update({
                    images: businessImages,
                    updated_at: new Date().toISOString()
                })
                .eq('owner_id', user.id);

            if (error) throw error;

            toast.success('İşletme resimleri güncellendi');
        } catch (error) {
            console.error('İşletme resimleri güncelleme hatası:', error);
            toast.error('İşletme resimleri güncellenirken bir hata oluştu');
        } finally {
            setSavingImages(false);
        }
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
                    <Tabs defaultValue="profil">
                        <TabsList className="mb-8 flex flex-wrap gap-2">
                            <TabsTrigger value="profil">Firma Bilgileri</TabsTrigger>
                            <TabsTrigger value="teklifler">Teklifler</TabsTrigger>
                            <TabsTrigger value="rezervasyonlar">Rezervasyonlar</TabsTrigger>
                            <TabsTrigger value="randevular">Randevular</TabsTrigger>
                            <TabsTrigger value="sorucevap">Soru-Cevap</TabsTrigger>
                            <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
                            <TabsTrigger value="stories">Nişan Hikayeleri</TabsTrigger>
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
                                            disabled={loading}
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
                                                disabled={loading}
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
                                            disabled={loading}
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
                                                disabled={loading}
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
                                                disabled={loading || !firmaProfil.il_id}
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
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:w-auto"
                                        >
                                            {loading ? (
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
                                />

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        onClick={handleSaveBusinessImages}
                                        disabled={savingImages}
                                    >
                                        {savingImages ? (
                                            <>
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Kaydediliyor...
                                            </>
                                        ) : 'Resimleri Kaydet'}
                                    </Button>
                                </div>
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
                                            {mockRezervasyon.map((rezervasyon) => (
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
                                                        {rezervasyon.misafirSayisi}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rezervasyon.odemeDurumu === "Tamamı Ödendi" ? "bg-green-100 text-green-800" :
                                                            rezervasyon.odemeDurumu === "Kapora Alındı" ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {rezervasyon.odemeDurumu}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.tutar.toLocaleString('tr-TR')} ₺
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {rezervasyon.type}
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

                            {mockRezervasyon.length === 0 && rezervasyonView === 'list' && (
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
                                            {mockRandevular.map((randevu) => (
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

                            {mockRandevular.length === 0 && randevuView === 'list' && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz randevu bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sorucevap" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Soru & Cevaplar</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex items-center gap-1">
                                        <Plus size={16} />
                                        Soru & Cevap Ekle
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {mockSorular.map((soru) => (
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
                                                ></textarea>
                                                <div className="mt-2 flex justify-end">
                                                    <Button size="sm">Yanıtla</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {mockSorular.length === 0 && (
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
                                            {mockComments.length > 0
                                                ? (mockComments.reduce((total, yorum) => total + yorum.puan, 0) / mockComments.length).toFixed(1)
                                                : 0}
                                        </span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, index) => {
                                                const rating = mockComments.length > 0
                                                    ? (mockComments.reduce((total, yorum) => total + yorum.puan, 0) / mockComments.length)
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
                                        <span className="ml-2 text-sm text-gray-500">({mockComments.length} yorum)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {mockComments.map((yorum) => (
                                    <div key={yorum.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-lg">{yorum.musteri}</div>
                                            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{yorum.tarih}</div>
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
                                                        disabled={replyInProgress}
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
                                                    disabled={replyInProgress}
                                                ></textarea>
                                                <div className="mt-2 flex justify-end">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveReply(yorum.id)}
                                                        disabled={!commentReplies[yorum.id]?.trim() || replyInProgress}
                                                    >
                                                        {replyInProgress ? (
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

                            {mockComments.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz yorum bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="stories" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Nişan Hikayeleri</h2>
                                <Button
                                    variant="default"
                                    className="flex items-center gap-2 shadow-sm"
                                    onClick={() => setStoryModalOpen(true)}
                                >
                                    <Plus size={16} />
                                    Hikaye Ekle
                                </Button>
                            </div>

                            <div className="space-y-8">
                                {mockStories.map((story) => (
                                    <div key={story.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                                        <div className="flex flex-col md:flex-row h-full">
                                            <div className="md:w-2/5 relative h-72 md:h-auto min-h-[280px] overflow-hidden">
                                                <Image
                                                    src={story.image}
                                                    alt={`${story.name} fotoğrafı`}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 40vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="md:w-3/5 p-6 md:p-8 flex flex-col bg-white">
                                                <div className="flex flex-col sm:justify-between sm:items-start gap-2 mb-4">
                                                    <h3 className="text-xl font-semibold text-primary leading-tight">{story.name}</h3>
                                                    <div className="flex gap-2">
                                                        <span className="text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full whitespace-nowrap">{story.category == 'nisan' ? 'Nişan' : 'Söz-Nişan'}</span>
                                                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{story.tarih}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 flex-grow mb-5 leading-relaxed">{story.hikaye}</p>
                                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                                    <Button variant="outline" size="sm" className="px-4 py-2">
                                                        <Edit size={15} className="mr-2" /> Düzenle
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="px-4 py-2 text-red-500 hover:text-white hover:bg-red-500">
                                                        <X size={15} className="mr-2" /> Kaldır
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {mockStories.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz nişan hikayesi bulunmamaktadır.</p>
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

            <StoryModal
                isOpen={storyModalOpen}
                onClose={() => setStoryModalOpen(false)}
                onSuccess={handleStorySuccess}
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

            <Toaster position="top-right" />
        </Layout>
    );
} 