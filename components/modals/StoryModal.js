"use client";

import { useState, useRef } from 'react';
import { Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StoryModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [storyData, setStoryData] = useState({
        name: '',
        hikaye: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStoryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setStoryData(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Burada bir API çağrısı yapılacak
            // Örnek: await saveStory(storyData);

            // Mock bir işlem için bekletiyoruz
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Başarılı olduğunda
            onSuccess(storyData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Hikaye ekleme hatası:", error);
            // Toast ile hata bildirimi yapılabilir
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStoryData({
            name: '',
            hikaye: '',
            image: null
        });
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Nişan Hikayesi Ekle</h2>
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

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Hikaye Başlığı
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={storyData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                            placeholder="Örn: Ayşe & Mehmet'in Aşk Hikayesi"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hikaye Fotoğrafı
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${previewUrl ? 'border-primary' : 'border-gray-300'
                                }`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {previewUrl ? (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Önizleme"
                                        className="mx-auto max-h-48 rounded-md object-contain"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewUrl(null);
                                            setStoryData(prev => ({ ...prev, image: null }));
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = null;
                                            }
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <ImageIcon size={48} className="text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        Fotoğraf yüklemek için tıklayın veya sürükleyin
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, WEBP (max. 5MB)
                                    </p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="hikaye" className="block text-sm font-medium text-gray-700 mb-1">
                            Hikaye
                        </label>
                        <textarea
                            id="hikaye"
                            name="hikaye"
                            value={storyData.hikaye}
                            onChange={handleChange}
                            rows={6}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                            placeholder="Çiftimizin aşk hikayesi..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
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
                            disabled={loading || !storyData.name || !storyData.hikaye || !storyData.image}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} className="mr-2" />
                                    Hikayeyi Paylaş
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 