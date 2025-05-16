"use client";

import { useState, useRef } from 'react';
import { Upload, User, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfileImageUploader({
    image = null,
    onChange,
    title = "Profil Resmi",
    description = "İşletmenizi en iyi şekilde yansıtan bir profil resmi yükleyin"
}) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Dosyayı base64'e çevir (gerçek uygulamada burada sunucuya yükleme yapılabilir)
            const base64 = await convertToBase64(file);

            onChange({
                id: Date.now().toString(),
                src: base64,
                name: file.name,
                type: file.type
            });
        } catch (error) {
            console.error("Profil resmi yükleme hatası:", error);
            alert("Profil resmi yüklenirken bir hata oluştu.");
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

    const handleRemoveImage = () => {
        onChange(null);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="flex items-center">
                <div
                    className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 mr-6"
                    onClick={!uploading ? handleUploadClick : undefined}
                >
                    {image ? (
                        <>
                            <img
                                src={image.src}
                                alt="Profil resmi"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="h-16 w-16 text-gray-400" />
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        {image ? 'Değiştir' : 'Yükle'}
                    </Button>

                    {image && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={uploading}
                            className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500"
                        >
                            Kaldır
                        </Button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                />
            </div>
        </div>
    );
} 