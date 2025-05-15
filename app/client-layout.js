"use client";

import { LocationProvider } from './context/location-context';
import { AuthProvider } from './context/auth-context';

export default function ClientLayoutWrapper({ children }) {
    return (
        <AuthProvider>
            <LocationProvider>
                {children}
            </LocationProvider>
        </AuthProvider>
    )
} 