"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const dayNames = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export function Calendar({ events, onSelectDate }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Verilen tarihte etkinlikler var mı kontrol eder
    const getEventsForDate = (day) => {
        if (!events || !Array.isArray(events)) return [];

        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toLocaleDateString('tr-TR');

        return events.filter(event => {
            if (!event.tarih) return false;
            // tarih formatı: "DD.MM.YYYY" (örn: "15.09.2023")
            if (typeof event.tarih === 'string') {
                return event.tarih === dateString;
            }
            return false;
        });
    };

    // Takvim günlerini render etme
    const renderCalendarDays = () => {
        const days = [];
        const todayDate = new Date().getDate();
        const todayMonth = new Date().getMonth();
        const todayYear = new Date().getFullYear();

        // Boş günler (ayın ilk gününden önceki günler)
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="border border-gray-100 p-2 h-24"></div>);
        }

        // Ayın günleri
        for (let day = 1; day <= daysInMonth; day++) {
            const dateEvents = getEventsForDate(day);
            const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
            const hasEvents = dateEvents.length > 0;

            days.push(
                <div
                    key={day}
                    className={`border border-gray-100 p-2 h-24 relative transition-colors
            ${isToday ? 'bg-primary/10' : ''} 
            ${hasEvents ? 'hover:bg-gray-50' : ''}
            cursor-pointer`}
                    onClick={() => onSelectDate && onSelectDate(new Date(currentYear, currentMonth, day), dateEvents)}
                >
                    <div className={`text-right font-medium ${isToday ? 'text-primary' : ''}`}>
                        {day}
                    </div>
                    <div className="mt-1 overflow-hidden max-h-16">
                        {dateEvents.slice(0, 2).map((event, idx) => (
                            <div
                                key={idx}
                                className={`text-xs rounded px-1 py-0.5 mb-0.5 truncate ${event.type === 'randevu'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}
                            >
                                {event.saat || ''} {event.musteri}
                            </div>
                        ))}
                        {dateEvents.length > 2 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                                +{dateEvents.length - 2} daha
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                        <ChevronLeft size={18} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setCurrentMonth(today.getMonth());
                            setCurrentYear(today.getFullYear());
                        }}
                    >
                        Bugün
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Haftanın günleri başlıkları */}
                {dayNames.map((day, idx) => (
                    <div key={idx} className="text-center font-medium py-2 bg-gray-50">
                        {day}
                    </div>
                ))}

                {/* Takvim günleri */}
                {renderCalendarDays()}
            </div>
        </div>
    );
} 