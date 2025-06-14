"use client";

import { useState, useRef } from 'react';
import { Loader2, Upload, User, XCircle } from 'lucide-react';
import { uploadProfileImage } from '@/lib/upload-helpers';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';

export function ProfileImageUploader({
    image = null,
    onChange,
    title = "Profil Resmi",
    description = "İşletmenizi en iyi şekilde yansıtan bir profil resmi yükleyin"
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Dosya tipini kontrol et
        if (!file.type.startsWith('image/')) {
            setError('Lütfen geçerli bir resim dosyası yükleyin');
            return;
        }

        // Dosya boyutunu kontrol et (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Resim dosyası 5MB\'dan küçük olmalıdır');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('Kullanıcı oturumu bulunamadı');
            }

            // Supabase storage'a yükle
            const { url } = await uploadProfileImage(file, user.id);

            // Değişikliği bildir
            onChange({
                id: 'profile',
                src: url,
                name: file.name
            });

        } catch (err) {
            console.error('Profil resmi yükleme hatası:', err);
            setError('Resim yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
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
                    onClick={!loading && !image ? handleClick : undefined}
                >
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        </div>
                    ) : image ? (
                        <>
                            <img
                                src={image.src}
                                alt="Profil resmi"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-white rounded-full shadow-md p-1 hover:bg-gray-100"
                                onClick={handleRemove}
                            >
                                <XCircle className="h-6 w-6 text-red-500" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <User className="h-16 w-16 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Profil Resmi Ekle</p>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {!image && !loading && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClick}
                            className="flex items-center gap-2"
                        >
                            <Upload size={16} />
                            Resim Yükle
                        </Button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}

            <p className="text-xs text-gray-500 mt-2 text-center">
                Maksimum dosya boyutu: 5MB<br />
                Desteklenen formatlar: JPG, PNG
            </p>
        </div>
    );
} 