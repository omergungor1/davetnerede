"use client";

import { useState, useEffect } from 'react';
import { Loader2, X, Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle, Calendar, Users, Package, CreditCard, FileText, Edit, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RezervasyonModal({ isOpen, onClose, onSuccess, onUpdate, preselectedDate = null, rezervasyonId = null, isEdit = false, readOnly = false }) {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rezervasyonData, setRezervasyonData] = useState({
        musteri: '',
        telefon: '',
        tarih: preselectedDate ? new Date(preselectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        misafirSayisi: 100,
        odemeDurumu: 'Beklemede',
        rezervasyonDurumu: 'Ön Rezervasyon',
        tutar: 0,
        paket: 'Standart',
        musteriNotu: '',
        isletmeNotu: ''
    });

    // Mock veri - API benzeri veri yükleme simülasyonu
    const mockRezervasyonlar = [
        {
            id: 1,
            musteri: "Ali Veli",
            telefon: "0555 555 55 55",
            tarih: "2023-11-15",
            misafirSayisi: 250,
            odemeDurumu: "Kapora Alındı",
            rezervasyonDurumu: "Kesin Rezervasyon",
            tutar: 35000,
            paket: "Standart",
            musteriNotu: "Düğün pastasını kendimiz getireceğiz.",
            isletmeNotu: "Müşteri kendi pastasını getirecek, pasta kesim ücreti alınmayacak."
        },
        {
            id: 2,
            musteri: "Hande Doğan",
            telefon: "0533 333 33 33",
            tarih: "2023-12-22",
            misafirSayisi: 120,
            odemeDurumu: "Tamamı Ödendi",
            rezervasyonDurumu: "Kesin Rezervasyon",
            tutar: 22000,
            paket: "Ekonomik",
            musteriNotu: "",
            isletmeNotu: "VIP masa düzeni istiyor, ekstra ücret alındı."
        },
        {
            id: 3,
            musteri: "Serkan Öz",
            telefon: "0544 444 44 44",
            tarih: "2024-01-05",
            misafirSayisi: 180,
            odemeDurumu: "Kapora Alındı",
            rezervasyonDurumu: "Kesin Rezervasyon",
            tutar: 28500,
            paket: "Herşey Dahil",
            musteriNotu: "Mekan süslemesinde mavi ve beyaz renklerin kullanılmasını istiyoruz. Fotograflarda deniz manzarası olmasını tercih ederiz.",
            isletmeNotu: "Süsleme detayları için ekstra ücret talep edilmedi. Fotoğraf çekimi için sahil kenarına özel alan hazırlanacak."
        },
        {
            id: 4,
            musteri: "Ece Güneş",
            telefon: "0522 222 22 22",
            tarih: "2024-02-14",
            misafirSayisi: 300,
            odemeDurumu: "Beklemede",
            rezervasyonDurumu: "Ön Rezervasyon",
            tutar: 42000,
            paket: "Premium Plus",
            musteriNotu: "Sevgililer gününde evleniyoruz, özel bir organizasyon istiyoruz.",
            isletmeNotu: ""
        }
    ];

    // Mevcut rezervasyon verilerini yükle (düzenleme veya detay görüntüleme modunda)
    useEffect(() => {
        if (isOpen && rezervasyonId && (isEdit || readOnly)) {
            setFetchLoading(true);
            setError(null);

            // API çağrısı simülasyonu
            setTimeout(() => {
                try {
                    // Mock veriden rezervasyon bilgilerini getir
                    const bulundu = mockRezervasyonlar.find(r => r.id === rezervasyonId);

                    if (bulundu) {
                        setRezervasyonData(bulundu);
                    } else {
                        setError("Rezervasyon bulunamadı");
                    }
                } catch (err) {
                    setError("Rezervasyon bilgileri yüklenirken bir hata oluştu");
                } finally {
                    setFetchLoading(false);
                }
            }, 800);
        } else if (isOpen && !isEdit && !readOnly) {
            // Yeni rezervasyon oluşturma modunda
            resetForm();
        }
    }, [isOpen, rezervasyonId, isEdit, readOnly, preselectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Misafir sayısı ve tutar için sayısal değer kontrolü
        if (name === 'misafirSayisi' || name === 'tutar') {
            const numValue = value === '' ? '' : Number(value);
            setRezervasyonData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setRezervasyonData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Gerçek uygulamada API çağrısı yapılacak
            // Örnek: await saveRezervasyon(rezervasyonData);

            // Mock işlem için timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isEdit) {
                // Düzenleme modunda
                if (onUpdate) {
                    onUpdate({
                        ...rezervasyonData,
                        id: rezervasyonId,
                    });
                }
            } else {
                // Ekleme modunda
                onSuccess({
                    ...rezervasyonData,
                    id: Date.now(),
                    type: 'rezervasyon'
                });
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error("Rezervasyon işlemi hatası:", error);
            setError("İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setRezervasyonData({
            musteri: '',
            telefon: '',
            tarih: preselectedDate ? new Date(preselectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            misafirSayisi: 100,
            odemeDurumu: 'Beklemede',
            rezervasyonDurumu: 'Ön Rezervasyon',
            tutar: 0,
            paket: 'Standart',
            musteriNotu: '',
            isletmeNotu: ''
        });
        setError(null);
    };

    // Tarih formatlamak için yardımcı fonksiyon
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    // Ödeme durumuna göre renk ve ikon belirleme
    const getStatusInfo = (status) => {
        switch (status) {
            case "Tamamı Ödendi":
                return { color: "green", icon: <CheckCircle size={16} className="text-green-500 mr-2" /> };
            case "Kapora Alındı":
                return { color: "yellow", icon: <Clock size={16} className="text-yellow-500 mr-2" /> };
            case "Beklemede":
                return { color: "gray", icon: <AlertCircle size={16} className="text-gray-500 mr-2" /> };
            case "İptal Edildi":
                return { color: "red", icon: <X size={16} className="text-red-500 mr-2" /> };
            default:
                return { color: "gray", icon: <AlertCircle size={16} className="text-gray-500 mr-2" /> };
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Tamamı Ödendi":
                return "bg-green-100 text-green-800";
            case "Kapora Alındı":
                return "bg-yellow-100 text-yellow-800";
            case "Beklemede":
                return "bg-gray-100 text-gray-800";
            case "İptal Edildi":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (!isOpen) return null;

    const modalTitle = readOnly
        ? "Rezervasyon Detayları"
        : isEdit
            ? "Rezervasyon Düzenle"
            : "Rezervasyon Ekle";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">{modalTitle}</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-md text-red-600 m-4">
                        <p>{error}</p>
                    </div>
                ) : readOnly ? (
                    // Salt okunur mod (detay görüntüleme)
                    <div className="p-4 space-y-6">
                        {/* Durum bilgisi */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(rezervasyonData.odemeDurumu)}`}>
                                    {getStatusInfo(rezervasyonData.odemeDurumu).icon}
                                    {rezervasyonData.odemeDurumu}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
                                    {rezervasyonData.rezervasyonDurumu}
                                </span>
                            </div>
                        </div>

                        {/* Müşteri bilgileri */}
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 space-y-3">
                            <h3 className="font-medium mb-2 text-gray-700 flex items-center">
                                <User size={16} className="mr-2 text-primary" />
                                Müşteri Bilgileri
                            </h3>
                            <div className="flex items-center">
                                <User size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Müşteri:</span> {rezervasyonData.musteri}</p>
                            </div>
                            <div className="flex items-center">
                                <Phone size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium mr-1">Telefon:</span>
                                    <a href={`tel:${rezervasyonData.telefon}`} className="text-primary hover:underline">{rezervasyonData.telefon}</a>
                                </p>
                            </div>
                        </div>

                        {/* Rezervasyon detayları */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
                            <h3 className="font-medium mb-2 text-gray-700 flex items-center">
                                <Calendar size={16} className="mr-2 text-primary" />
                                Rezervasyon Detayları
                            </h3>
                            <div className="flex items-center">
                                <Calendar size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Etkinlik Tarihi:</span> {formatDate(rezervasyonData.tarih)}</p>
                            </div>
                            <div className="flex items-center">
                                <Users size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Misafir Sayısı:</span> {rezervasyonData.misafirSayisi} kişi</p>
                            </div>
                            <div className="flex items-center">
                                <Package size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Seçilen Paket:</span> {rezervasyonData.paket}</p>
                            </div>
                            <div className="flex items-center">
                                <CreditCard size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Toplam Tutar:</span> {rezervasyonData.tutar.toLocaleString('tr-TR')} ₺</p>
                            </div>
                        </div>

                        {/* Notlar */}
                        {(rezervasyonData.musteriNotu || rezervasyonData.isletmeNotu) && (
                            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 space-y-3">
                                <h3 className="font-medium mb-2 text-gray-700 flex items-center">
                                    <FileText size={16} className="mr-2 text-yellow-600" />
                                    Notlar
                                </h3>
                                {rezervasyonData.musteriNotu && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Müşteri Notu:</p>
                                        <p className="text-gray-700 bg-white p-3 rounded-md border border-yellow-200 text-sm">{rezervasyonData.musteriNotu}</p>
                                    </div>
                                )}
                                {rezervasyonData.isletmeNotu && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">İşletme Notu:</p>
                                        <p className="text-gray-700 bg-white p-3 rounded-md border border-yellow-200 text-sm">{rezervasyonData.isletmeNotu}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // Form modu (ekleme veya düzenleme)
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Müşteri Bilgileri bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Müşteri Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="musteri" className="block text-sm font-medium text-gray-700 mb-1">
                                        Adı ve Soyadı *
                                    </label>
                                    <input
                                        type="text"
                                        id="musteri"
                                        name="musteri"
                                        value={rezervasyonData.musteri}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="Örn: Ayşe & Mehmet"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon Numarası *
                                    </label>
                                    <input
                                        type="text"
                                        id="telefon"
                                        name="telefon"
                                        value={rezervasyonData.telefon}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="Örn: 0555 555 55 55"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rezervasyon Detayları bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Rezervasyon Detayları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="tarih" className="block text-sm font-medium text-gray-700 mb-1">
                                        Etkinlik Tarihi *
                                    </label>
                                    <input
                                        type="date"
                                        id="tarih"
                                        name="tarih"
                                        value={rezervasyonData.tarih}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="misafirSayisi" className="block text-sm font-medium text-gray-700 mb-1">
                                        Misafir Sayısı *
                                    </label>
                                    <input
                                        type="number"
                                        id="misafirSayisi"
                                        name="misafirSayisi"
                                        value={rezervasyonData.misafirSayisi}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="paket" className="block text-sm font-medium text-gray-700 mb-1">
                                        Paket *
                                    </label>
                                    <select
                                        id="paket"
                                        name="paket"
                                        value={rezervasyonData.paket}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        required
                                    >
                                        <option value="Standart">Standart</option>
                                        <option value="Ekonomik">Ekonomik</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Premium Plus">Premium Plus</option>
                                        <option value="Herşey Dahil">Herşey Dahil</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="tutar" className="block text-sm font-medium text-gray-700 mb-1">
                                        Toplam Tutar (₺) *
                                    </label>
                                    <input
                                        type="number"
                                        id="tutar"
                                        name="tutar"
                                        value={rezervasyonData.tutar}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Durum Bilgileri bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Durum Bilgileri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="odemeDurumu" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ödeme Durumu *
                                    </label>
                                    <select
                                        id="odemeDurumu"
                                        name="odemeDurumu"
                                        value={rezervasyonData.odemeDurumu}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        required
                                    >
                                        <option value="Beklemede">Beklemede</option>
                                        <option value="Kapora Alındı">Kapora Alındı</option>
                                        <option value="Tamamı Ödendi">Tamamı Ödendi</option>
                                        <option value="İptal Edildi">İptal Edildi</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="rezervasyonDurumu" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rezervasyon Durumu *
                                    </label>
                                    <select
                                        id="rezervasyonDurumu"
                                        name="rezervasyonDurumu"
                                        value={rezervasyonData.rezervasyonDurumu}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        required
                                    >
                                        <option value="Ön Rezervasyon">Ön Rezervasyon</option>
                                        <option value="Kesin Rezervasyon">Kesin Rezervasyon</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notlar bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Notlar</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="musteriNotu" className="block text-sm font-medium text-gray-700 mb-1">
                                        Müşteri Notu
                                    </label>
                                    <textarea
                                        id="musteriNotu"
                                        name="musteriNotu"
                                        value={rezervasyonData.musteriNotu}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="Müşterinin ilettiği özel istekler..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="isletmeNotu" className="block text-sm font-medium text-gray-700 mb-1">
                                        İşletme Notu
                                    </label>
                                    <textarea
                                        id="isletmeNotu"
                                        name="isletmeNotu"
                                        value={rezervasyonData.isletmeNotu}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="İşletme içi notlar..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Form düğmeleri */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    resetForm();
                                    onClose();
                                }}
                                disabled={loading}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        İşlem yapılıyor...
                                    </>
                                ) : isEdit ? "Güncelle" : "Kaydet"}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Detay modunda ve düzenleme veya iptal butonları */}
                {readOnly && (
                    <div className="p-4 border-t flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Kapat
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                onClose();
                                // Düzenleme modunu başlatmak için
                                if (onUpdate) {
                                    // Burada düzenleme modalını açmak için parent'a bilgi verilir
                                    onUpdate({
                                        ...rezervasyonData,
                                        requiresEdit: true
                                    });
                                }
                            }}
                        >
                            <Edit size={16} className="mr-2" />
                            Düzenle
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
} 