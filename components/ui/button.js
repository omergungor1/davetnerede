"use client";

import React from "react";

export function Button({
    children,
    type = "button",
    disabled = false,
    variant = "default",
    size = "default",
    className = "",
    onClick,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
        outline: "border border-primary text-primary hover:bg-primary/5 active:bg-primary/10",
        ghost: "text-primary hover:bg-primary/5 active:bg-primary/10",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    };

    const sizes = {
        sm: "text-xs px-2.5 py-1.5 rounded",
        default: "text-sm px-4 py-2 rounded-md",
        lg: "text-base px-6 py-3 rounded-md",
    };

    const variantStyle = variants[variant] || variants.default;
    const sizeStyle = sizes[size] || sizes.default;

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
} 