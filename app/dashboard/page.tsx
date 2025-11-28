"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Monitor, Trash2, LogOut, Trophy, Gamepad2 } from "lucide-react";

interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  pc: { name: string };
  game?: { name: string };
  status: string;
}

interface User {
  name: string;
  email: string;
  minutes: number;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Check session
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();

      if (!userData) {
        router.push("/login");
        return;
      }
      setUser(userData);

      // Fetch reservations
      const res = await fetch("/api/reservations/me");
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;

    const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReservations(reservations.filter(r => r.id !== id));
    } else {
      alert("Error al cancelar");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) return <div className="min-h-screen pt-24 text-center text-white font-orbitron">Cargando...</div>;

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">MI CUENTA</h1>
            <p className="text-gray-400">Bienvenido, <span className="text-neon-cyan">{user?.name}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> CERRAR SESIÓN
          </button>
        </div>

        {/* Stats / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass p-6 border border-white/10">
            <div className="text-gray-400 text-xs font-orbitron mb-2">RESERVAS ACTIVAS</div>
            <div className="text-4xl font-bold text-white">{reservations.length}</div>
          </div>
          <div className="glass p-6 border border-white/10">
            <div className="text-gray-400 text-xs font-orbitron mb-2">TIEMPO DISPONIBLE</div>
            <div className="text-4xl font-bold text-neon-magenta">
              {user ? (user.minutes / 60).toFixed(1) : "0.0"} <span className="text-lg">hrs</span>
            </div>
          </div>
          <Link href="/logros" className="glass p-6 border border-neon-magenta/30 hover:bg-neon-magenta/10 transition-colors flex flex-col justify-center items-center text-center group">
            <Trophy className="w-8 h-8 text-neon-magenta mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-orbitron font-bold text-white">MIS LOGROS</span>
          </Link>
          <Link href="/reservas" className="glass p-6 border border-neon-cyan/30 hover:bg-neon-cyan/10 transition-colors flex flex-col justify-center items-center text-center group">
            <Calendar className="w-8 h-8 text-neon-cyan mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-orbitron font-bold text-white">NUEVA RESERVA</span>
          </Link>
        </div>

        {/* Reservations List */}
        <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-neon-cyan" /> MIS RESERVAS
        </h2>

        {reservations.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded border border-white/10">
            <p className="text-gray-400 mb-4">No tienes reservas activas.</p>
            <Link href="/reservas" className="text-neon-cyan hover:underline">¡Reserva tu PC ahora!</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="glass p-6 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-white text-lg">{res.pc.name}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(res.startTime).toLocaleDateString()} • {new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {res.game && (
                      <div className="flex items-center gap-2 mt-1 text-neon-cyan text-sm">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="font-bold">{res.game.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                    CONFIRMADA
                  </span>
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                    title="Cancelar Reserva"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
