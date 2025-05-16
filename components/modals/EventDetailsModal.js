"use client";

import { X, Clock, User, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EventDetailsModal({ isOpen, onClose, date, events, onAddRandevu, onAddRezervasyon }) {
    if (!isOpen) return null;

    const formattedDate = date ? date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : '';

    // Randevuları ve rezervasyonları ayır
    const randevular = events?.filter(event => event.type === 'randevu') || [];
    const rezervasyonlar = events?.filter(event => event.type === 'rezervasyon') || [];

    const handleAddRandevu = () => {
        onClose();
        if (onAddRandevu) onAddRandevu(date);
    };

    const handleAddRezervasyon = () => {
        onClose();
        if (onAddRezervasyon) onAddRezervasyon(date);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                        {formattedDate}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    {events?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Bu tarihte planlanmış etkinlik bulunmamaktadır.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Randevular bölümü */}
                            {randevular.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-3 pb-2 border-b text-blue-700">Randevular</h3>
                                    <div className="space-y-3">
                                        {randevular.map((randevu, index) => (
                                            <div key={index} className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium">{randevu.musteri}</h4>
                                                    <div className="flex items-center text-blue-700 text-sm">
                                                        <Clock size={14} className="mr-1" />
                                                        {randevu.saat}
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <User size={14} />
                                                        <span>Amaç: {randevu.amac}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        <span>Durum: {randevu.durum}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex justify-end gap-2">
                                                    <Button variant="outline" size="sm">Düzenle</Button>
                                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-white hover:bg-red-500">İptal Et</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rezervasyonlar bölümü */}
                            {rezervasyonlar.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-3 pb-2 border-b text-green-700">Rezervasyonlar</h3>
                                    <div className="space-y-3">
                                        {rezervasyonlar.map((rezervasyon, index) => (
                                            <div key={index} className="bg-green-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium">{rezervasyon.musteri}</h4>
                                                    <div className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                        {rezervasyon.odemeDurumu}
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <User size={14} />
                                                        <span>Misafir Sayısı: {rezervasyon.misafirSayisi}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        <span>Tutar: {rezervasyon.tutar?.toLocaleString('tr-TR')} ₺</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex justify-end gap-2">
                                                    <Button variant="outline" size="sm">Detaylar</Button>
                                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-white hover:bg-red-500">İptal Et</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Yeni etkinlik ekleme */}
                            <div className="flex justify-center gap-2 pt-4 border-t">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={handleAddRandevu}
                                >
                                    Randevu Ekle
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleAddRezervasyon}
                                >
                                    Rezervasyon Ekle
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 