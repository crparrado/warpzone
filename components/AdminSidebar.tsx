"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Monitor, ShoppingBag, Gamepad2, Trophy, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Usuarios", href: "/admin/usuarios", icon: Users },
        { name: "Agendamientos", href: "/admin/agendamientos", icon: Calendar },
        { name: "PCs", href: "/admin/pcs", icon: Monitor },
        { name: "Productos", href: "/admin/productos", icon: ShoppingBag },
        { name: "Compras", href: "/admin/compras", icon: ShoppingBag },
        { name: "Juegos", href: "/admin/juegos", icon: Gamepad2 },
        { name: "Logros", href: "/admin/logros", icon: Trophy },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 border border-white/20 rounded text-white"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/95 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="p-6 border-b border-white/10 mt-12 lg:mt-0">
                    <h2 className="text-xl font-orbitron font-bold text-gray-400">ADMINISTRACIÓN</h2>
                    {user && (
                        <p className="text-neon-cyan text-sm mt-2 font-bold">Hola, {user.name}</p>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors font-orbitron text-sm ${isActive
                                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded transition-colors font-orbitron text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
