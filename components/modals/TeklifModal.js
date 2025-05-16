"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, Users, Package, CreditCard, Send, FileText, Phone, User, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TeklifModal({ isOpen, onClose, teklifId, teklif, readOnly = false, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        price: '',
        notes: ''
    });

    const [musteri, setMusteri] = useState('');
    const [telefon, setTelefon] = useState('');
    const [packageName, setPackageName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [responseDate, setResponseDate] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [customerNote, setCustomerNote] = useState('');

    const mockTeklifData = {
        musteri: 'Ahmet Yılmaz',
        telefon: '0555 555 55 55',
        paket: 'Premium',
        eventDate: '2023-12-15',
        requestDate: '2023-10-01',
        responseDate: teklif?.durum === 'Gönderildi' ? '2023-10-03' : null,
        guestCount: '180',
        notes: 'Çok kalabalık olmayacağımızı düşünüyorum. Buna göre bir fiyat verirseniz sevinirim.'
    };

    //fake api call
    useEffect(() => {
        const fetchData = async () => {
            // Gerçek uygulamada, API'den veri çekilecek
            // const response = await fetch(`/api/teklifler/${teklifId}`);
            // const data = await response.json();

            // Eğer teklif prop olarak geldiyse ve readonly ise, değerleri oradan al
            if (teklif && readOnly) {
                setMusteri(teklif.musteri || mockTeklifData.musteri);
                setTelefon(teklif.telefon || mockTeklifData.telefon);
                setPackageName(teklif.paket || mockTeklifData.paket);
                setEventDate(mockTeklifData.eventDate);
                setRequestDate(mockTeklifData.requestDate);
                setResponseDate(mockTeklifData.responseDate);
                setGuestCount(mockTeklifData.guestCount);
                setCustomerNote(mockTeklifData.notes);
                setFormData({
                    price: teklif.fiyat || '',
                    notes: teklif.notes || ''
                });
            } else {
                // Eğer readonly değilse, mock veriyi kullan
                setMusteri(mockTeklifData.musteri);
                setTelefon(mockTeklifData.telefon);
                setPackageName(mockTeklifData.paket);
                setEventDate(mockTeklifData.eventDate);
                setRequestDate(mockTeklifData.requestDate);
                setResponseDate(mockTeklifData.responseDate);
                setGuestCount(mockTeklifData.guestCount);
                setCustomerNote(mockTeklifData.notes);
            }
        };
        fetchData();
    }, [teklifId, teklif, readOnly]);

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
            // Burada normalde API çağrısı yapılacak
            await new Promise(resolve => setTimeout(resolve, 600)); // Simülasyon için

            // Başarılı yanıt geldiğinde
            onSuccess({
                id: teklifId,
                musteri,
                telefon,
                paket: packageName,
                durum: 'Gönderildi',
                tarih: new Date().toLocaleDateString('tr-TR'),
                fiyat: parseFloat(formData.price),
                notes: formData.notes
            });

            onClose();
        } catch (error) {
            console.error('Teklif gönderme hatası:', error);
            alert('Teklif gönderilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">
                        {readOnly ? "Teklif Detayları" : "Teklif Gönder"}
                        {readOnly && <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Gönderildi</span>}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-6">
                        <h3 className="font-medium mb-2 text-gray-700 flex items-center">
                            <FileText size={16} className="mr-2 text-primary" />
                            Teklif İsteği Detayları
                        </h3>
                        <div className="bg-blue-50 p-4 rounded-md space-y-3 border border-blue-100">
                            {/* <div className="flex justify-between items-start"> */}
                            <div className="flex items-center">
                                <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Talep Tarihi:</span> {formatDate(requestDate)}
                                </p>
                            </div>
                            {/* {responseDate && readOnly && (
                                    <div className="flex items-center">
                                        <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                                        <p className="text-gray-700">
                                            <span className="font-medium">Gönderim Tarihi:</span> {formatDate(responseDate)}
                                        </p>
                                    </div>
                                )}
                            </div> */}
                            <div className="flex items-center">
                                <User size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium">Müşteri:</span> {musteri}</p>
                            </div>
                            <div className="flex items-center">
                                <Phone size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <p className="text-gray-700"><span className="font-medium mr-1">Telefon:</span>
                                    <a href={`tel:${telefon}`} className="text-primary hover:underline">{telefon}</a>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Calendar size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-700"><span className="font-medium">Cemiyet Günü:</span> {formatDate(eventDate)}</span>
                            </div>
                            <div className="flex items-center">
                                <Package size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-700"><span className="font-medium">İstenen Paket:</span> {packageName}</span>
                            </div>
                            <div className="flex items-center">
                                <Users size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-700"><span className="font-medium">Davetli Sayısı:</span> {guestCount} kişi</span>
                            </div>
                            {customerNote && (
                                <div className="flex items-start mt-2 pt-2 border-t border-blue-200">
                                    <FileText size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-gray-700 font-medium block">Müşteri Notu:</span>
                                        <span className="text-gray-600 text-sm">{customerNote}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {readOnly ? (
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
                            <h3 className="font-medium text-gray-700 flex items-center">
                                <Send size={16} className="mr-2 text-green-600" />
                                Gönderilen Teklif Bilgileri
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Teklif Fiyatı:</p>
                                        <p className="text-xl font-bold text-primary">{formData.price?.toLocaleString('tr-TR')} ₺</p>
                                    </div>
                                    {responseDate && readOnly && (
                                        <div className="flex items-center">
                                            <p className="text-gray-700 flex flex-col">
                                                <span className="font-medium">Tarih:</span>
                                                {formatDate(responseDate)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {formData.notes && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">İşletme Notu:</p>
                                        <p className="text-gray-800 bg-white p-3 rounded-md border border-gray-200 text-sm">{formData.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Teklif Fiyatı (₺) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                        <CreditCard size={16} />
                                    </span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                        placeholder="Teklif tutarını girin"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    İşletme Notu (Opsiyonel)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="Ekstra bilgiler, özel indirimler, paket detayları vb."
                                ></textarea>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className={readOnly ? "w-full" : "mr-2"}
                            disabled={loading}
                        >
                            {readOnly ? "Kapat" : "İptal"}
                        </Button>

                        {!readOnly && (
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Gönderiliyor...' : 'Teklifi Gönder'}
                                {!loading && <Send size={16} className="ml-2" />}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 