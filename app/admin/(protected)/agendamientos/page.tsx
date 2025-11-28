"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Calendar as CalendarIcon, List, RefreshCw, Send, Monitor, User, Clock, X } from "lucide-react";

interface Reservation {
    id: string;
    user: { name: string; email: string };
    pc: { name: string };
    startTime: string;
    endTime: string;
    status: string;
}

export default function AdminReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

    useEffect(() => {
        fetch("/api/reservations")
            .then((res) => res.json())
            .then((data) => setReservations(data));
    }, []);

    const handleResendLink = async (id: string) => {
        if (!confirm("¿Reenviar link de conexión al usuario?")) return;

        const res = await fetch(`/api/reservations/${id}/resend`, { method: "POST" });
        if (res.ok) {
            alert("Link reenviado correctamente.");
        } else {
            alert("Error al reenviar.");
        }
    };

    // Calendar Logic
    const renderCalendar = () => {
        // Simplified Calendar: Just showing upcoming 7 days for demo purposes
        // In a real app, this would be a full monthly/weekly grid logic
        const today = new Date();
        const days = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toLocaleDateString();

            const dayReservations = reservations.filter(r =>
                new Date(r.startTime).toLocaleDateString() === dateStr
            );

            days.push(
                <div key={i} className="bg-white/5 border border-white/10 p-4 min-h-[200px]">
                    <h3 className="font-orbitron text-neon-cyan mb-4 border-b border-white/10 pb-2">
                        {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-2">
                        {dayReservations.map(res => (
                            <button
                                key={res.id}
                                onClick={() => setSelectedRes(res)}
                                className="w-full text-left p-2 bg-neon-magenta/10 border border-neon-magenta/30 hover:bg-neon-magenta/20 rounded text-xs transition-colors group"
                            >
                                <div className="font-bold text-white group-hover:text-neon-magenta">{new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div className="text-gray-400 truncate">{res.user.name}</div>
                                <div className="text-gray-500 truncate text-[10px]">{res.pc.name}</div>
                            </button>
                        ))}
                        {dayReservations.length === 0 && (
                            <div className="text-gray-600 text-xs text-center py-4">Sin reservas</div>
                        )}
                    </div>
                </div>
            );
        }
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{days}</div>;
    };

    return (
        <div>

            <main className="flex-1 p-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-orbitron font-bold tracking-wider">GESTIÓN DE AGENDAMIENTOS</h1>

                    <div className="flex gap-2 bg-white/5 p-1 rounded">
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:text-white'}`}
                            title="Vista Lista"
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`p-2 rounded transition-colors ${view === 'calendar' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:text-white'}`}
                            title="Vista Calendario"
                        >
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="Recargar"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {view === 'list' ? (
                    <div className="glass border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs font-orbitron text-gray-400 uppercase">
                                <tr>
                                    <th className="p-4">Usuario</th>
                                    <th className="p-4">PC</th>
                                    <th className="p-4">Fecha y Hora</th>
                                    <th className="p-4">Duración</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{res.user.name}</div>
                                            <div className="text-xs text-gray-500">{res.user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-neon-magenta">
                                                <Monitor className="w-4 h-4" /> {res.pc.name}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <CalendarIcon className="w-4 h-4 text-gray-500" /> {new Date(res.startTime).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                <Clock className="w-3 h-3 text-gray-600" /> {new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {Math.round((new Date(res.endTime).getTime() - new Date(res.startTime).getTime()) / (1000 * 60 * 60))} Horas
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                                                CONFIRMED
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleResendLink(res.id)}
                                                className="p-2 bg-white/5 hover:bg-neon-cyan hover:text-black text-gray-400 rounded transition-colors inline-flex items-center gap-2 text-xs font-bold"
                                                title="Reenviar Link"
                                            >
                                                <Send className="w-3 h-3" /> REENVIAR
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {renderCalendar()}
                    </div>
                )}

                {/* Reservation Detail Modal */}
                {selectedRes && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass border border-neon-cyan/30 p-8 max-w-md w-full relative">
                            <button
                                onClick={() => setSelectedRes(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">DETALLE RESERVA</h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-neon-cyan" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 font-orbitron">USUARIO</div>
                                        <div className="text-white font-bold">{selectedRes.user.name}</div>
                                        <div className="text-sm text-gray-500">{selectedRes.user.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neon-magenta/20 rounded-full flex items-center justify-center">
                                        <Monitor className="w-6 h-6 text-neon-magenta" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 font-orbitron">EQUIPO</div>
                                        <div className="text-white font-bold">{selectedRes.pc.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 font-orbitron">HORARIO</div>
                                        <div className="text-white font-bold">
                                            {new Date(selectedRes.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(selectedRes.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedRes.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleResendLink(selectedRes.id)}
                                    className="w-full py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center justify-center gap-2 mt-4"
                                >
                                    <Send className="w-4 h-4" /> REENVIAR LINK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
