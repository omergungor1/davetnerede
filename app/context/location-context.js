"use client";

import { createContext, useContext, useState } from 'react';

// Location Context
export const LocationContext = createContext();

export function LocationProvider({ children }) {
    const [location, setLocation] = useState({
        province: null,
        district: null
    });

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
} 