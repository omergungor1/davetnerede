"use client";

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export function TagInput({
    tags = [],
    onTagsChange,
    placeholder = "Özellik ekleyin...",
    maxTags = 10,
    disabled = false
}) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        }
    };

    const addTag = (tag) => {
        if (tag && !tags.includes(tag) && tags.length < maxTags) {
            onTagsChange([...tags, tag]);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[42px] p-2 border border-gray-300 rounded-md bg-white">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                        {tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-primary/80"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </span>
                ))}
                {!disabled && tags.length < maxTags && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? placeholder : ""}
                        className="flex-1 min-w-[120px] outline-none bg-transparent"
                        disabled={disabled}
                    />
                )}
            </div>
            {!disabled && (
                <p className="text-xs text-gray-500">
                    {tags.length}/{maxTags} özellik eklenebilir. Enter tuşu ile ekleyin.
                </p>
            )}
        </div>
    );
} 