"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, Monitor, Gamepad2, Trophy, BarChart3, DollarSign } from "lucide-react";

const menuItems = [
    { name: "Dashboard", icon: BarChart3, href: "/admin" },
    { name: "Usuarios", icon: Users, href: "/admin/usuarios" },
    { name: "Agendamientos", icon: Calendar, href: "/admin/agendamientos" },
    { name: "PCs", icon: Monitor, href: "/admin/pcs" },
    { name: "Productos", icon: DollarSign, href: "/admin/productos" },
    { name: "Juegos", icon: Gamepad2, href: "/admin/juegos" },
    { name: "Logros", icon: Trophy, href: "/admin/logros" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 glass h-[calc(100vh-8rem)] sticky top-24 rounded-lg p-6 flex flex-col gap-2">
            <div className="text-xs font-orbitron text-gray-500 mb-4 uppercase tracking-widest">Administración</div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md font-orbitron text-sm transition-colors
                ${isActive
                                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
                        >
                            <item.icon className="w-4 h-4" /> {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
