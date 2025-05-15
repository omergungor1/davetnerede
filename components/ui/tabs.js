"use client";

import React from 'react';

export function Tabs({ defaultValue, children }) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    // Tab değerlerini çocuk bileşenlerden alın
    const tabsContent = React.Children.map(children, (child) => {
        if (child.type === TabsContent) {
            return React.cloneElement(child, {
                isActive: child.props.value === activeTab,
            });
        }
        return child;
    });

    // TabsList bileşenini aktif sekme bilgisiyle güncelleme
    const tabsList = React.Children.map(children, (child) => {
        if (child.type === TabsList) {
            return React.cloneElement(child, {
                activeTab,
                setActiveTab,
            });
        }
        return child;
    });

    return (
        <div className="w-full">
            {tabsList}
            {tabsContent}
        </div>
    );
}

export function TabsList({ activeTab, setActiveTab, children }) {
    // TabsTrigger bileşenlerini aktif sekme bilgisiyle güncelleme
    const triggers = React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
            return React.cloneElement(child, {
                isActive: child.props.value === activeTab,
                onSelect: () => setActiveTab(child.props.value),
            });
        }
        return child;
    });

    return <div className="flex space-x-2 border-b border-gray-200">{triggers}</div>;
}

export function TabsTrigger({ value, isActive, onSelect, children }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onSelect}
            className={`px-4 py-2 text-sm font-medium ${isActive
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, isActive, children }) {
    if (!isActive) return null;

    return (
        <div
            role="tabpanel"
            className="pt-4"
        >
            {children}
        </div>
    );
} 