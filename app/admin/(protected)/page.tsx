"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface DashboardStats {
  activeUsers: number;
  reservationsToday: number;
  monthlyIncome: number;
  activity: {
    type: string;
    user: string;
    detail: string;
    time: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  if (loading) return <div className="text-white p-8">Cargando dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-orbitron font-bold text-white mb-8">DASHBOARD</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 border-l-4 border-neon-cyan">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">USUARIOS ACTIVOS</p>
              <h3 className="text-3xl font-bold text-white">{stats?.activeUsers || 0}</h3>
            </div>
            <Users className="w-8 h-8 text-neon-cyan" />
          </div>
          <div className="text-xs text-green-400">Total registrados</div>
        </div>

        <div className="glass p-6 border-l-4 border-neon-magenta">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">RESERVAS HOY</p>
              <h3 className="text-3xl font-bold text-white">{stats?.reservationsToday || 0}</h3>
            </div>
            <Calendar className="w-8 h-8 text-neon-magenta" />
          </div>
          <div className="text-xs text-gray-400">Reservas para hoy</div>
        </div>

        <div className="glass p-6 border-l-4 border-neon-purple">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">INGRESOS MES</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(stats?.monthlyIncome || 0)}</h3>
            </div>
            <BarChart3 className="w-8 h-8 text-neon-purple" />
          </div>
          <div className="text-xs text-green-400">Acumulado del mes</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass p-8 rounded-lg">
        <h2 className="text-xl font-orbitron font-bold text-white mb-6">ACTIVIDAD RECIENTE</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-white/5 text-gray-300 font-orbitron">
              <tr>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Acción</th>
                <th className="px-6 py-3">Detalle</th>
                <th className="px-6 py-3">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {stats?.activity.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.user}</td>
                  <td className={`px-6 py-4 ${item.type === 'Reserva' ? 'text-neon-cyan' : 'text-neon-magenta'}`}>{item.type}</td>
                  <td className="px-6 py-4">{item.detail}</td>
                  <td className="px-6 py-4">{getTimeAgo(item.time)}</td>
                </tr>
              ))}
              {stats?.activity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No hay actividad reciente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
