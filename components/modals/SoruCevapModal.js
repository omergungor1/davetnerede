"use client";

import { useState } from 'react';
import { X, MessageSquare, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SoruCevapModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        musteri: '',
        soru: '',
        cevap: '',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simülasyon için kısa bekleme
            await new Promise(resolve => setTimeout(resolve, 800));

            // Bugünün tarihini ekleyerek yeni soru-cevap verisi oluştur
            const newSoruCevap = {
                ...formData,
                id: Date.now(), // Gerçek uygulamada backend tarafından verilecek
                tarih: new Date().toLocaleDateString('tr-TR'),
            };

            // Başarı fonksiyonunu çağır
            onSuccess(newSoruCevap);

            // Formu temizle ve modalı kapat
            setFormData({
                musteri: '',
                soru: '',
                cevap: '',
            });
            onClose();
        } catch (error) {
            console.error('Soru-cevap ekleme hatası:', error);
            // Burada hata mesajı gösterilebilir
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold flex items-center">
                        <MessageSquare size={20} className="mr-2 text-primary" />
                        Soru & Cevap Ekle
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="musteri" className="block text-sm font-medium text-gray-700 mb-1">
                            Müşteri/Ziyaretçi Adı <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Users size={16} />
                            </span>
                            <input
                                type="text"
                                id="musteri"
                                name="musteri"
                                value={formData.musteri}
                                onChange={handleChange}
                                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="Soru soran kişinin adı"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="soru" className="block text-sm font-medium text-gray-700 mb-1">
                            Soru <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="soru"
                            name="soru"
                            value={formData.soru}
                            onChange={handleChange}
                            rows="3"
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="Müşteri/ziyaretçi sorusu"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="cevap" className="block text-sm font-medium text-gray-700 mb-1">
                            Cevap <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="cevap"
                            name="cevap"
                            value={formData.cevap}
                            onChange={handleChange}
                            rows="4"
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="Soruya vereceğiniz yanıt"
                            required
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="mr-2"
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
                                    <span className="animate-spin mr-2">●</span>
                                    Yayınlanıyor...
                                </>
                            ) : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    Yayınla
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 