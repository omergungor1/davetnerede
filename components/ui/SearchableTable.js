"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export function SearchableTable({
    data,
    columns,
    searchPlaceholder = "Ara...",
    emptyMessage = "Kayıt bulunamadı."
}) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrelenmiş veriyi hesapla
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;

        const searchTermLower = searchTerm.toLowerCase().trim();

        return data.filter(item => {
            // Tüm alanları kontrol et ve metin içerenlerle eşleştir
            return columns.some(column => {
                const value = item[column.accessor];
                if (value === null || value === undefined) return false;

                return String(value).toLowerCase().includes(searchTermLower);
            });
        });
    }, [data, searchTerm, columns]);

    return (
        <div>
            {/* Arama bölümü */}
            <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={searchPlaceholder}
                />
                {searchTerm && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">
                        {filteredData.length} sonuç
                    </span>
                )}
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                            filteredData.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {columns.map((column, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                                            {column.cell ? column.cell(row) : (
                                                <div className={`text-sm ${column.textClass || 'text-gray-900'}`}>
                                                    {row[column.accessor]}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 