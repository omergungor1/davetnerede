"use client";

import Link from 'next/link';
import { clsx } from 'clsx';

const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-text hover:bg-lightgray',
    outline: 'bg-white border border-primary text-primary hover:bg-primary hover:text-white',
};

const sizeStyles = {
    sm: 'text-sm px-3 py-1 rounded',
    md: 'text-sm px-4 py-2 rounded',
    lg: 'text-base px-5 py-2.5 rounded-md',
};

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    href,
    ...props
}) {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    const styles = clsx(
        'inline-flex items-center justify-center font-medium transition-colors',
        variantStyle,
        sizeStyle,
        className
    );

    if (href) {
        return <Link href={href} className={styles} {...props} />;
    }

    return <button className={styles} {...props} />;
} 