"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageUploader({
    images = [],
    onChange,
    maxImages = 10,
    title = "İşletme Resimleri",
    description = "Mekanınızın resimlerini yükleyin. En fazla 10 adet resim yükleyebilirsiniz."
}) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (images.length + files.length > maxImages) {
            alert(`En fazla ${maxImages} resim yükleyebilirsiniz.`);
            return;
        }

        setUploading(true);

        try {
            // Her bir dosya için aşağıdaki işlemler yapılır
            const newImages = await Promise.all(
                files.map(async (file) => {
                    // Dosyayı base64'e çevir (gerçek uygulamada burada sunucuya yükleme yapılabilir)
                    const base64 = await convertToBase64(file);
                    return {
                        id: Date.now() + Math.random().toString(36).substring(2, 9), // Benzersiz ID
                        src: base64,
                        name: file.name,
                        type: file.type,
                        order: images.length // Eklendiği andaki sıra
                    };
                })
            );

            // Yeni resimleri ekleyip sıra numaralarını güncelle
            const updatedImages = [...images, ...newImages].map((img, index) => ({
                ...img,
                order: index
            }));

            onChange(updatedImages);
        } catch (error) {
            console.error("Resim yükleme hatası:", error);
            alert("Resimler yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
            // Input'u temizle ki aynı dosyayı tekrar seçebilsin
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleRemoveImage = (id) => {
        const filteredImages = images.filter(img => img.id !== id);
        // Silme işleminden sonra sıra numaralarını güncelle
        const updatedImages = filteredImages.map((img, index) => ({
            ...img,
            order: index
        }));
        onChange(updatedImages);
    };

    const handleMoveImage = (id, direction) => {
        const imageIndex = images.findIndex(img => img.id === id);
        if (
            (direction === 'up' && imageIndex === 0) ||
            (direction === 'down' && imageIndex === images.length - 1)
        ) {
            return; // İlk resmi yukarı veya son resmi aşağı taşımaya çalışıyorsa, bir şey yapma
        }

        const newImages = [...images];
        const targetIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1;

        // Resimlerin yerlerini değiştir
        [newImages[imageIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[imageIndex]];

        // Sıra numaralarını güncelle
        const updatedImages = newImages.map((img, index) => ({
            ...img,
            order: index
        }));

        onChange(updatedImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                        {images.length}/{maxImages} resim
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                        disabled={uploading || images.length >= maxImages}
                        className="flex items-center gap-2"
                    >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Resim Ekle
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                    />
                </div>
            </div>


            {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative group border rounded-md overflow-hidden aspect-square">
                            <img
                                src={image.src}
                                alt={image.name || "İşletme resmi"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex space-x-1">
                                        <button
                                            type="button"
                                            className={`h-8 w-8 bg-white hover:bg-gray-200 rounded flex items-center justify-center border border-gray-300 ${image.order === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => handleMoveImage(image.id, 'up')}
                                            disabled={image.order === 0}
                                        >
                                            <ArrowLeft size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className={`h-8 w-8 bg-white hover:bg-gray-200 rounded flex items-center justify-center border border-gray-300 ${image.order === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => handleMoveImage(image.id, 'down')}
                                            disabled={image.order === images.length - 1}
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        className="h-8 w-8 bg-white hover:bg-red-100 rounded flex items-center justify-center border border-red-300 text-red-600"
                                        onClick={() => handleRemoveImage(image.id)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                {image.order + 1}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-md p-8 text-center bg-gray-50">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">Henüz resim eklenmedi</p>
                    <p className="text-sm text-gray-400">PNG, JPG, WEBP (max. 5MB)</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleUploadClick}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Resim Seç
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
} 