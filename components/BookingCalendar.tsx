"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, RefreshCw, LogIn, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PC {
    id: string;
    name: string;
    status: string;
}

interface BookingUser {
    id: string;
    email: string;
    name: string;
    minutes: number;
}

interface Game {
    id: string;
    name: string;
    imageUrl?: string;
}

export default function BookingCalendar() {
    // Helper to get "Today" in Chile Time
    const getChileDate = () => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Santiago',
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
        const parts = formatter.formatToParts(now);
        const chileParts: any = {};
        parts.forEach(p => chileParts[p.type] = p.value);
        // Return a Date object representing 00:00 on the day it is in Chile
        // We use the local browser's timezone for the Date object itself, but the *values* (Y,M,D) match Chile.
        // This ensures the calendar renders the correct "Day" even if the user is in a different timezone.
        return new Date(parseInt(chileParts.year), parseInt(chileParts.month) - 1, parseInt(chileParts.day));
    };

    const [currentDate, setCurrentDate] = useState(() => getChileDate());
    const [selectedDate, setSelectedDate] = useState<Date>(() => getChileDate());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(1);
    const [pcs, setPcs] = useState<PC[]>([]);
    const [selectedPC, setSelectedPC] = useState<string | null>(null);
    const [user, setUser] = useState<BookingUser | null>(null);
    const [step, setStep] = useState(1); // 1: Date/Time, 2: PC, 3: Confirm, 4: Success
    const [loading, setLoading] = useState(false);

    // Game Selection State
    const [wantGame, setWantGame] = useState(false);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [loadingGames, setLoadingGames] = useState(false);
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

    useEffect(() => {
        if (wantGame && games.length === 0) {
            setLoadingGames(true);
            fetch("/api/games")
                .then(res => res.json())
                .then(data => setGames(data.filter((g: any) => g.active)))
                .catch(err => console.error(err))
                .finally(() => setLoadingGames(false));
        }
    }, [wantGame]);

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const handleBooking = async () => {
        if (!selectedTime || !selectedPC || !user) return;

        // Calculate total minutes needed
        const totalMinutes = duration * 60;

        if (user.minutes < totalMinutes) {
            alert("No tienes suficientes minutos disponibles.");
            return;
        }

        setLoading(true);
        try {
            // Create date object from selected date and time
            const [hours, minutes] = selectedTime.split(':').map(Number);

            // We need to construct a Date that corresponds to the selected YYYY-MM-DD HH:mm in Chile.
            // Since we don't have a timezone library, we'll use a robust approximation using Intl.

            // 1. Create a base date in UTC with the selected components
            const baseDate = new Date(Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                hours,
                minutes,
                0
            ));

            // 2. Get the parts of this UTC date as if it were in Chile
            // This tells us: "When it is X time in UTC, what time is it in Chile?"
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Santiago',
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            });

            const parts = formatter.formatToParts(baseDate);
            const chileParts: any = {};
            parts.forEach(p => chileParts[p.type] = p.value);

            // 3. Calculate the difference (offset) between UTC and Chile for this specific time
            // We reconstruct the "Chile Time" as a UTC date to compare
            const chileTimeAsUTC = new Date(Date.UTC(
                parseInt(chileParts.year),
                parseInt(chileParts.month) - 1,
                parseInt(chileParts.day),
                parseInt(chileParts.hour),
                parseInt(chileParts.minute),
                parseInt(chileParts.second)
            ));

            // The difference in milliseconds.
            // If base (UTC) is 12:00 and Chile says it's 09:00, diff is 3 hours.
            // This means Chile is UTC-3.
            const offsetMs = baseDate.getTime() - chileTimeAsUTC.getTime();

            // 4. Apply this offset to our desired target time.
            // We want the result to be: "A timestamp T such that T in Chile is YYYY-MM-DD HH:mm"
            // So T = UTC_Target + Offset (inverted? no).
            // Let's think: We want T.
            // T in Chile = TargetTime.
            // T in UTC = TargetTime + (UTC - Chile).
            // We found (UTC - Chile) = offsetMs.
            // So T = TargetTime (as UTC timestamp) + offsetMs.

            const targetTimestamp = baseDate.getTime() + offsetMs;
            const startTime = new Date(targetTimestamp);

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + duration);

            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    pcId: selectedPC,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    gameId: wantGame ? selectedGame : null
                }),
            });

            if (res.ok) {
                setStep(4);
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

        // Get "Today" in Chile for highlighting
        const chileToday = getChileDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate?.getDate() === i && selectedDate?.getMonth() === currentDate.getMonth();
            const isToday = chileToday.getDate() === i && chileToday.getMonth() === currentDate.getMonth();

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

    if (step === 4) {
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
                    onClick={() => { setStep(1); setSelectedDate(getChileDate()); setSelectedTime(null); setSelectedPC(null); }}
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

                    {/* Timezone Warning */}
                    <div className="mt-4 p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded flex items-center gap-2 text-xs text-neon-cyan">
                        <Clock className="w-4 h-4" />
                        <span>Todos los horarios corresponden a <strong>Hora de Chile</strong>.</span>
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

                            {/* Duration Selector */}
                            <div className="mb-6">
                                <label className="block text-xs font-orbitron text-gray-400 mb-2">DURACIÓN</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setDuration(h)}
                                            className={`flex-1 py-2 text-sm font-mono border rounded-sm transition-all
                                                ${duration === h
                                                    ? 'border-neon-magenta bg-neon-magenta/20 text-white'
                                                    : 'border-white/10 hover:border-white/30 text-gray-400'}
                                            `}
                                        >
                                            {h}H
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {timeSlots.map(time => {
                                    const [hours, minutes] = time.split(':').map(Number);
                                    const slotDate = new Date(selectedDate);
                                    slotDate.setHours(hours, minutes, 0, 0);

                                    // If slot is for today, check if it's in the past
                                    const now = new Date();
                                    const isPast = selectedDate.toDateString() === now.toDateString() && slotDate < now;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => !isPast && setSelectedTime(time)}
                                            disabled={isPast}
                                            className={`py-2 text-sm font-mono border rounded-sm transition-all
                                                ${selectedTime === time
                                                    ? 'border-neon-cyan bg-neon-cyan/20 text-white shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                                    : isPast
                                                        ? 'border-white/5 text-gray-600 cursor-not-allowed opacity-50'
                                                        : 'border-white/10 hover:border-white/30 text-gray-400'}
                                            `}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                disabled={!selectedTime}
                                onClick={() => setStep(2)}
                                className="mt-auto w-full py-3 bg-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold font-orbitron hover:bg-white transition-colors"
                            >
                                CONTINUAR ({duration} {duration === 1 ? 'Hora' : 'Horas'})
                            </button>
                        </>
                    ) : step === 2 ? (
                        <div className="flex flex-col h-full">
                            <h4 className="font-orbitron text-neon-cyan mb-6">SELECCIONA TU PC</h4>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {pcs.map(pc => (
                                    <button
                                        key={pc.id}
                                        onClick={() => setSelectedPC(pc.id)}
                                        className={`p-4 border rounded-lg transition-all text-left group relative overflow-hidden
                                            ${selectedPC === pc.id
                                                ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                                        `}
                                    >
                                        <div className="font-orbitron font-bold text-white mb-1">{pc.name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${pc.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {pc.status === 'AVAILABLE' ? 'Disponible' : 'Ocupado'}
                                        </div>
                                        {selectedPC === pc.id && (
                                            <div className="absolute top-2 right-2 text-neon-cyan">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-auto flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-white/10 text-gray-400 font-orbitron hover:bg-white/5"
                                >
                                    VOLVER
                                </button>
                                <button
                                    disabled={!selectedPC}
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold font-orbitron hover:bg-white transition-colors"
                                >
                                    CONTINUAR
                                </button>
                            </div>
                        </div>
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
                                        <span className="text-white">{selectedTime} ({duration}h)</span>
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
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3 border border-white/10 text-gray-400 font-orbitron hover:bg-white/5"
                                >
                                    VOLVER
                                </button>
                                {/* Game Selection Step */}
                                {selectedPC && (
                                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                        <div className="glass p-4 rounded-lg border border-white/10">
                                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${wantGame ? 'bg-neon-cyan border-neon-cyan' : 'border-gray-500'}`}>
                                                    {wantGame && <Check className="w-3 h-3 text-black" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={wantGame}
                                                    onChange={(e) => {
                                                        setWantGame(e.target.checked);
                                                        if (!e.target.checked) setSelectedGame(null);
                                                    }}
                                                />
                                                <span className="text-gray-300 font-orbitron text-sm">¿Quieres jugar algo específico?</span>
                                            </label>

                                            {wantGame && (
                                                <div className="animate-in fade-in zoom-in-95 duration-300">
                                                    {loadingGames ? (
                                                        <div className="text-center py-2 text-gray-400 text-sm">Cargando juegos...</div>
                                                    ) : games.length === 0 ? (
                                                        <div className="text-center py-2 text-gray-500 italic text-sm">No hay juegos disponibles.</div>
                                                    ) : (
                                                        <select
                                                            value={selectedGame || ""}
                                                            onChange={(e) => setSelectedGame(e.target.value)}
                                                            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white font-orbitron text-sm focus:border-neon-cyan focus:outline-none"
                                                        >
                                                            <option value="" disabled>Selecciona un juego</option>
                                                            {games.map((game) => (
                                                                <option key={game.id} value={game.id} className="bg-gray-900">
                                                                    {game.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={!user || loading || (wantGame && !selectedGame)}
                                    className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron text-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed clip-path-slant"
                                >
                                    {loading ? "CONFIRMANDO..." : "CONFIRMAR RESERVA"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
