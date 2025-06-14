"use client";

import { useState, useRef } from 'react';
import { Loader2, Upload, X, ImagePlus, MoveVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadBusinessImage, deleteBusinessImage, reorderBusinessImages, getBusinessImages } from '@/lib/upload-helpers';
import { useAuth } from '@/app/context/auth-context';
import toast from 'react-hot-toast';

export function ImageUploader({
    images: initialImages = [],
    onChange,
    maxImages = 10,
    title = 'Fotoğraflar',
    description = 'Fotoğraf ekleyin',
    businessId
}) {
    const [images, setImages] = useState(initialImages);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleClick = () => {
        if (images.length >= maxImages) {
            toast.error(`En fazla ${maxImages} resim yükleyebilirsiniz.`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (images.length + files.length > maxImages) {
            setError(`En fazla ${maxImages} resim yükleyebilirsiniz.`);
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Lütfen sadece resim dosyaları yükleyin');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Her resim dosyası 5MB\'dan küçük olmalıdır');
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            if (!businessId) {
                throw new Error('İşletme bilgisi bulunamadı');
            }

            const uploadPromises = files.map(async (file, index) => {
                const sequence = images.length + index;
                const result = await uploadBusinessImage(file, businessId, sequence);
                return result;
            });

            const uploadedImages = await Promise.all(uploadPromises);

            // Yüklenen resimleri getir
            const updatedImages = await getBusinessImages(businessId);
            setImages(updatedImages);
            onChange(updatedImages);

            toast.success('Resimler başarıyla yüklendi');
        } catch (error) {
            console.error('Resim yükleme hatası:', error);
            toast.error('Resim yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async (index) => {
        try {
            if (!businessId) {
                throw new Error('İşletme bilgisi bulunamadı');
            }

            const imageToDelete = images[index];

            if (imageToDelete.id) {
                await deleteBusinessImage(imageToDelete.id, businessId);
            }

            const newImages = [...images];
            newImages.splice(index, 1);

            const updatedImages = newImages.map((img, idx) => ({
                ...img,
                sequence: idx
            }));

            onChange(updatedImages);
            toast.success('Resim silindi');
        } catch (err) {
            console.error('Resim silme hatası:', err);
            toast.error('Resim silinirken bir hata oluştu');
        }
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
        setDragging(true);
    };

    const handleDragEnter = (index) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];

        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        const updatedImages = newImages.map((img, idx) => ({
            ...img,
            sequence: idx
        }));

        onChange(updatedImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Sıra numaralarını güncelle
        const updatedItems = items.map((item, index) => ({
            ...item,
            sequence: index
        }));

        try {
            await reorderBusinessImages(updatedItems, businessId);

            // Güncel resimleri getir
            const updatedImages = await getBusinessImages(businessId);
            setImages(updatedImages);
            onChange(updatedImages);

            toast.success('Resim sırası güncellendi');
        } catch (error) {
            console.error('Resim sıralama hatası:', error);
            toast.error('Resim sırası güncellenirken bir hata oluştu');
        }
    };

    const handleDelete = async (imageId) => {
        try {
            if (!businessId) {
                throw new Error('İşletme bilgisi bulunamadı');
            }

            await deleteBusinessImage(imageId, businessId);

            // Güncel resimleri getir
            const updatedImages = await getBusinessImages(businessId);
            setImages(updatedImages);
            onChange(updatedImages);

            toast.success('Resim başarıyla silindi');
        } catch (error) {
            console.error('Resim silme hatası:', error);
            toast.error('Resim silinirken bir hata oluştu');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-1">
                {title && <h3 className="text-lg font-medium text-text">{title}</h3>}
                {description && <p className="text-sm text-darkgray">{description}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className={`relative group aspect-square rounded-md overflow-hidden border border-border bg-gray-50 
                            ${dragging ? 'cursor-move' : 'cursor-pointer'} 
                            ${draggedIndex === index ? 'ring-2 ring-primary shadow-lg' : ''}`}
                        draggable={true}
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={handleDragEnd}
                        style={{ touchAction: 'none' }}
                    >
                        <img
                            src={image.url}
                            alt={`Resim ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute top-2 left-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {index + 1}
                        </div>

                        {index === 0 && (
                            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                                Kapak
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-black hover:bg-red-500 hover:text-white"
                                onClick={() => handleRemove(index)}
                            >
                                <X size={16} className="mr-1" /> Sil
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-black"
                            >
                                <MoveVertical size={16} className="mr-1" /> Sıra Değiştir
                            </Button>
                        </div>
                    </div>
                ))}

                {images.length < maxImages && !loading && (
                    <button
                        type="button"
                        onClick={handleClick}
                        className="aspect-square flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Resim Ekle</span>
                    </button>
                )}

                {loading && (
                    <div className="aspect-square flex items-center justify-center rounded-md border border-border bg-gray-50">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                multiple
            />

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}

            <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500">
                    {images.length} / {maxImages} resim
                </p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                    disabled={loading || images.length >= maxImages}
                    className="flex items-center gap-2"
                >
                    <Upload size={16} />
                    Resim Ekle
                </Button>
            </div>

            <p className="text-xs text-gray-500">
                <strong>Not:</strong> İlk sıradaki resim kapak fotoğrafı olarak kullanılacaktır.
                Sıralamayı değiştirmek için resimleri sürükleyip bırakabilirsiniz.
            </p>
        </div>
    );
} 