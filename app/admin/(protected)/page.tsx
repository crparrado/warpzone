import { Users, Calendar, BarChart3 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-orbitron font-bold text-white mb-8">DASHBOARD</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 border-l-4 border-neon-cyan">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">USUARIOS ACTIVOS</p>
              <h3 className="text-3xl font-bold text-white">1,245</h3>
            </div>
            <Users className="w-8 h-8 text-neon-cyan" />
          </div>
          <div className="text-xs text-green-400">+12% vs mes anterior</div>
        </div>

        <div className="glass p-6 border-l-4 border-neon-magenta">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">RESERVAS HOY</p>
              <h3 className="text-3xl font-bold text-white">28</h3>
            </div>
            <Calendar className="w-8 h-8 text-neon-magenta" />
          </div>
          <div className="text-xs text-gray-400">85% de ocupación</div>
        </div>

        <div className="glass p-6 border-l-4 border-neon-purple">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-orbitron">INGRESOS MES</p>
              <h3 className="text-3xl font-bold text-white">$4.2M</h3>
            </div>
            <BarChart3 className="w-8 h-8 text-neon-purple" />
          </div>
          <div className="text-xs text-green-400">+5% vs mes anterior</div>
        </div>
      </div>

      {/* Recent Activity Table (Mock) */}
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
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">cparrado</td>
                <td className="px-6 py-4 text-neon-cyan">Reserva</td>
                <td className="px-6 py-4">PC-01 (2 Horas)</td>
                <td className="px-6 py-4">Hace 5 min</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">gamer_pro</td>
                <td className="px-6 py-4 text-neon-magenta">Compra</td>
                <td className="px-6 py-4">Ficha 5 Horas</td>
                <td className="px-6 py-4">Hace 12 min</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">guest_01</td>
                <td className="px-6 py-4 text-gray-300">Login</td>
                <td className="px-6 py-4">Inicio de sesión</td>
                <td className="px-6 py-4">Hace 25 min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
