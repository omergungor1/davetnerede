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
    children,
    className,
    variant = 'primary',
    size = 'md',
    href,
    disabled,
    type = 'button',
    onClick,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-gray-200 text-text hover:bg-gray-300",
        outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
        link: "bg-transparent text-primary hover:underline p-0",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 rounded",
        md: "text-sm px-4 py-2 rounded-md",
        lg: "text-base px-6 py-3 rounded-md",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

    const classes = clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && disabledStyles,
        className
    );

    if (href && !disabled) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            {...props}
        >
            {children}
        </button>
    );
} 