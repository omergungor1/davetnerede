"use client";

import { useState, useEffect } from 'react';
import { Loader2, X, Calendar as CalendarIcon, Clock, FileText, User, Phone, Edit, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RandevuModal({ isOpen, onClose, onSuccess, preselectedDate = null, randevuId = null, isEdit = false }) {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [randevuData, setRandevuData] = useState({
        musteri: '',
        telefon: '',
        tarih: preselectedDate ? new Date(preselectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        saat: '14:00',
        amac: '',
        durum: 'Beklemede',
        musteriNotu: '',
        isletmeNotu: ''
    });

    // Mock veri - API benzeri veri yükleme simülasyonu
    const mockRandevular = [
        {
            id: 1,
            musteri: "Selin Öztürk",
            telefon: "0555 111 11 11",
            tarih: "2023-10-08",
            saat: "14:30",
            durum: "Tamamlandı",
            amac: "Mekan Görüşmesi",
            musteriNotu: "Düğün salonu ve bahçe kısmını görmek istiyorum.",
            isletmeNotu: "Müşteriye özel indirim yapılabilir, düğün sezonunda rezervasyon yapmak istiyor."
        },
        {
            id: 2,
            musteri: "Hakan Demirci",
            telefon: "0533 222 22 22",
            tarih: "2023-10-12",
            saat: "11:00",
            durum: "Beklemede",
            amac: "Menü Tadımı",
            musteriNotu: "Vejetaryen seçeneği olup olmadığını sormak istiyorum.",
            isletmeNotu: ""
        },
        {
            id: 3,
            musteri: "Nihan Aktaş",
            telefon: "0544 333 33 33",
            tarih: "2023-10-15",
            saat: "16:00",
            durum: "Beklemede",
            amac: "Fiyat Görüşmesi",
            musteriNotu: "",
            isletmeNotu: "100 kişilik bir düğün için fiyat görüşmesi yapılacak."
        },
        {
            id: 4,
            musteri: "Berk Yıldız",
            telefon: "0522 444 44 44",
            tarih: "2023-10-18",
            saat: "10:30",
            durum: "İptal Edildi",
            amac: "Dekorasyon Planlaması",
            musteriNotu: "Sade ve şık bir dekorasyon istiyoruz.",
            isletmeNotu: "Müşteri iptal etti, tekrar aranacak."
        }
    ];

    // Düzenleme modunda mevcut randevu verilerini yükle
    useEffect(() => {
        if (isOpen && randevuId && isEdit) {
            setFetchLoading(true);
            setError(null);

            // API çağrısı simülasyonu
            setTimeout(() => {
                try {
                    // Mock veriden randevu bilgilerini getir
                    const bulundu = mockRandevular.find(r => r.id === randevuId);

                    if (bulundu) {
                        setRandevuData(bulundu);
                    } else {
                        setError("Randevu bulunamadı");
                    }
                } catch (err) {
                    setError("Randevu bilgileri yüklenirken bir hata oluştu");
                } finally {
                    setFetchLoading(false);
                }
            }, 800);
        } else if (isOpen && !isEdit) {
            // Yeni randevu oluşturma modunda form verilerini sıfırla
            resetForm();
        }
    }, [isOpen, randevuId, isEdit, preselectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRandevuData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Gerçek uygulamada API çağrısı yapılacak
            // Örnek: await saveRandevu(randevuData);

            // Mock işlem için timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Başarılı olduğunda onSuccess callback'ini çağır
            onSuccess({
                ...randevuData,
                id: isEdit ? randevuId : Date.now(),
                type: 'randevu'
            });

            resetForm();
            onClose();
        } catch (error) {
            console.error("Randevu işlemi hatası:", error);
            setError("İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setRandevuData({
            musteri: '',
            telefon: '',
            tarih: preselectedDate ? new Date(preselectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            saat: '14:00',
            amac: '',
            durum: 'Beklemede',
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

    // Durum bilgisine göre renk belirleme
    const getStatusColor = (status) => {
        switch (status) {
            case "Tamamlandı":
                return { color: "green", icon: <CheckCircle size={16} className="text-green-500 mr-2" /> };
            case "Beklemede":
                return { color: "yellow", icon: <Clock size={16} className="text-yellow-500 mr-2" /> };
            case "İptal Edildi":
                return { color: "red", icon: <X size={16} className="text-red-500 mr-2" /> };
            case "Onaylandı":
                return { color: "blue", icon: <CheckCircle size={16} className="text-blue-500 mr-2" /> };
            default:
                return { color: "gray", icon: <AlertCircle size={16} className="text-gray-500 mr-2" /> };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? "Randevu Düzenle" : "Randevu Ekle"}
                    </h2>
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
                ) : (
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
                                        value={randevuData.musteri}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="Örn: Ayşe Demir"
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
                                        value={randevuData.telefon}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="Örn: 0555 555 55 55"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Randevu Detayları bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Randevu Detayları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="tarih" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tarih *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            id="tarih"
                                            name="tarih"
                                            value={randevuData.tarih}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="saat" className="block text-sm font-medium text-gray-700 mb-1">
                                        Saat *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            id="saat"
                                            name="saat"
                                            value={randevuData.saat}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md py-2 pl-10 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="durum" className="block text-sm font-medium text-gray-700 mb-1">
                                        Durum
                                    </label>
                                    <select
                                        id="durum"
                                        name="durum"
                                        value={randevuData.durum}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="Beklemede">Beklemede</option>
                                        <option value="Onaylandı">Onaylandı</option>
                                        <option value="İptal Edildi">İptal Edildi</option>
                                        <option value="Tamamlandı">Tamamlandı</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notlar bölümü */}
                        <div className="space-y-2">
                            <h3 className="text-md font-semibold mb-2 border-b pb-1">Notlar</h3>
                            <div className="space-y-3 mb-4">
                                {isEdit && (
                                    <div>
                                        <label htmlFor="musteriNotu" className="block text-sm font-medium text-gray-700 mb-1">
                                            Müşteri Notu
                                        </label>
                                        <textarea
                                            id="musteriNotu"
                                            name="musteriNotu"
                                            value={randevuData.musteriNotu}
                                            rows={3}
                                            disabled
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary bg-gray-50"
                                            placeholder="Müşterinin özel notları..."
                                        />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="isletmeNotu" className="block text-sm font-medium text-gray-700 mb-1">
                                        İşletme Notu
                                    </label>
                                    <textarea
                                        id="isletmeNotu"
                                        name="isletmeNotu"
                                        value={randevuData.isletmeNotu}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                                        placeholder="İşletme için özel notlar..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
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
                                disabled={loading || !randevuData.musteri || !randevuData.tarih || !randevuData.saat}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                        {isEdit ? "Güncelleniyor..." : "Kaydediliyor..."}
                                    </>
                                ) : isEdit ? 'Değişiklikleri Kaydet' : 'Randevuyu Kaydet'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 