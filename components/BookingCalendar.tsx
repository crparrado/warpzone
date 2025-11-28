"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PC {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    name: string;
}

export default function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [pcs, setPcs] = useState<PC[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Confirm, 3: Success
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Mock time slots
    const timeSlots = [
        "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"
    ];

    useEffect(() => {
        // Fetch PCs
        fetch("/api/pcs").then(res => res.json()).then(data => setPcs(data));

        // Check Session
        fetch("/api/auth/me").then(res => res.json()).then(data => setUser(data));
    }, []);

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime || !user) return;
        setLoading(true);

        // Calculate start and end time
        const [hours, minutes] = selectedTime.split(':');
        const startTime = new Date(selectedDate);
        startTime.setHours(parseInt(hours), parseInt(minutes));

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1); // Default 1 hour duration

        // Pick a random available PC (Simplified logic)
        const randomPC = pcs[0];

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                    // pcId is now auto-assigned by backend
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString()
                }),
            });

            if (res.ok) {
                setStep(3);
            } else {
                const data = await res.json();
                alert(data.error || "Error al reservar. Intenta nuevamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate?.getDate() === i && selectedDate?.getMonth() === currentDate.getMonth();
            const isToday = new Date().getDate() === i && new Date().getMonth() === currentDate.getMonth();

            days.push(
                <button
                    key={i}
                    onClick={() => handleDateClick(i)}
                    className={`aspect-square rounded-sm flex items-center justify-center text-sm font-orbitron transition-all
            ${isSelected
                            ? 'bg-neon-magenta text-black font-bold shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'}
            ${isToday && !isSelected ? 'border border-neon-cyan/50 text-neon-cyan' : ''}
          `}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    if (step === 3) {
        return (
            <div className="glass p-12 text-center border border-neon-cyan/30">
                <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-neon-cyan" />
                </div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-4">¡RESERVA CONFIRMADA!</h2>
                <p className="text-gray-400 mb-8">
                    Hemos enviado los detalles a <strong>{user?.email}</strong>.<br />
                    Recibirás tu link de conexión 5 minutos antes de la hora.
                </p>
                <button
                    onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); }}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-orbitron rounded-sm transition-colors"
                >
                    HACER OTRA RESERVA
                </button>
            </div>
        );
    }

    return (
        <div className="glass p-6 md:p-8 border border-white/10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-orbitron font-bold text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar Grid */}
                <div>
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-orbitron text-gray-500">
                        <div>DO</div><div>LU</div><div>MA</div><div>MI</div><div>JU</div><div>VI</div><div>SA</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendar()}
                    </div>
                </div>

                {/* Time Selection & Form */}
                <div className="border-l border-white/10 pl-0 md:pl-8 flex flex-col">
                    {!selectedDate ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <Clock className="w-12 h-12 mb-4 opacity-50" />
                            <p>Selecciona una fecha para ver horarios</p>
                        </div>
                    ) : step === 1 ? (
                        <>
                            <h4 className="font-orbitron text-neon-cyan mb-4">HORARIOS DISPONIBLES</h4>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-2 text-sm font-mono border rounded-sm transition-all
                      ${selectedTime === time
                                                ? 'border-neon-cyan bg-neon-cyan/20 text-white shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                                : 'border-white/10 hover:border-white/30 text-gray-400'}
                    `}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={!selectedTime}
                                onClick={() => setStep(2)}
                                className="mt-auto w-full py-3 bg-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold font-orbitron hover:bg-white transition-colors"
                            >
                                CONTINUAR
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col h-full">
                            <h4 className="font-orbitron text-neon-cyan mb-6">CONFIRMAR RESERVA</h4>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-white/5 rounded text-sm text-gray-300">
                                    <div className="flex justify-between mb-2">
                                        <span>Fecha:</span>
                                        <span className="text-white">{selectedDate.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hora:</span>
                                        <span className="text-white">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                                        <span>Usuario:</span>
                                        <span className="text-neon-cyan">{user ? user.name : "Invitado"}</span>
                                    </div>
                                </div>

                                {!user && (
                                    <div className="bg-neon-magenta/10 border border-neon-magenta/30 p-4 text-center">
                                        <p className="text-sm text-gray-300 mb-3">Debes iniciar sesión para confirmar tu reserva.</p>
                                        <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-neon-magenta text-black font-bold font-orbitron text-sm hover:bg-white transition-colors">
                                            <LogIn className="w-4 h-4" /> INICIAR SESIÓN
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-white/10 text-gray-400 font-orbitron hover:bg-white/5"
                                >
                                    VOLVER
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!user || loading}
                                    className="flex-1 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <RefreshCw className="animate-spin" /> : "CONFIRMAR"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
