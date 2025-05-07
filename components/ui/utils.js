import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Bu fonksiyon class'ları birleştirmek için kullanılır
export function cn(...inputs) {
    return twMerge(clsx(inputs));
} 