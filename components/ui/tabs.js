"use client";

import React from 'react';

export function Tabs({ defaultValue, children }) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    // Geçerli çocuk bileşenleri filtrele ve React.Fragment'ları işle
    const validChildren = React.Children.toArray(children).filter(
        child => React.isValidElement(child)
    );

    // Tab değerlerini çocuk bileşenlerden alın
    const tabsContent = validChildren.filter(
        child => child.type === TabsContent
    ).map(child => {
        return React.cloneElement(child, {
            isActive: child.props.value === activeTab
        });
    });

    // TabsList bileşenini aktif sekme bilgisiyle güncelleme
    const tabsList = validChildren.filter(
        child => child.type === TabsList
    ).map(child => {
        return React.cloneElement(child, {
            activeTab,
            setActiveTab
        });
    });

    return (
        <div className="w-full">
            {tabsList}
            {tabsContent}
        </div>
    );
}

export function TabsList({ activeTab, setActiveTab, children, className }) {
    // Geçerli çocuk bileşenleri filtrele
    const validChildren = React.Children.toArray(children).filter(
        child => React.isValidElement(child)
    );

    // TabsTrigger bileşenlerini aktif sekme bilgisiyle güncelleme
    const triggers = validChildren.filter(
        child => child.type === TabsTrigger
    ).map(child => {
        return React.cloneElement(child, {
            isActive: child.props.value === activeTab,
            onSelect: () => setActiveTab(child.props.value)
        });
    });

    // Diğer çocukları da geçir (TabsTrigger olmayan)
    const otherChildren = validChildren.filter(
        child => child.type !== TabsTrigger
    );

    return (
        <div className={`flex flex-wrap gap-1 border-b border-gray-200 ${className || ''}`}>
            {triggers}
            {otherChildren}
        </div>
    );
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