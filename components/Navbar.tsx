"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";

interface User {
    name: string;
    minutes: number;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        fetchUser();
    }, [pathname]);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    if (pathname.startsWith("/admin")) return null;

    return (
        <nav className="w-full fixed top-0 z-50 glass px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-white/10">
            <Link href="/" className="text-3xl font-orbitron font-bold text-neon-cyan tracking-wider hover:text-neon-magenta transition-colors">
                WARPZONE
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 font-orbitron items-center">
                <Link href="/" className="hover:text-neon-cyan transition-colors">INICIO</Link>
                <Link href="/reservas" className="hover:text-neon-cyan transition-colors text-neon-magenta">RESERVAS</Link>
                <Link href="/logros" className="hover:text-neon-cyan transition-colors">LOGROS</Link>
                <Link href="/fichas-y-pases" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">FICHAS Y PASES</Link>
                <Link href="/servicios" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">SERVICIOS</Link>
                <Link href="/contacto" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">CONTACTO</Link>

                {user ? (
                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                        <div className="text-right">
                            <div className="text-neon-cyan font-bold text-xs">{user.name}</div>
                            <div className="text-neon-magenta text-xs">{(user.minutes / 60).toFixed(1)} hrs</div>
                            <Link href="/dashboard" className="text-xs font-bold text-white hover:text-neon-cyan transition-colors border border-white/20 px-3 py-1 rounded hover:bg-white/10">
                                MI CUENTA
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="text-sm font-bold text-neon-magenta hover:text-white transition-colors tracking-widest border border-neon-magenta/50 px-3 py-1 rounded hover:bg-neon-magenta/10">
                        INICIAR SESIÓN
                    </Link>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <Link href="/fichas-y-pases" className="hidden md:block px-6 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-orbitron text-sm hover:bg-neon-cyan hover:text-black transition-all duration-300 clip-path-slant">
                    COMPRAR FICHAS
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-neon-cyan transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-gray-300 hover:text-neon-cyan transition-colors">INICIO</Link>
                    <Link href="/reservas" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-neon-magenta hover:text-neon-cyan transition-colors">RESERVAS</Link>
                    <Link href="/logros" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-gray-300 hover:text-neon-cyan transition-colors">LOGROS</Link>
                    <Link href="/fichas-y-pases" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-gray-300 hover:text-neon-cyan transition-colors">FICHAS Y PASES</Link>
                    <Link href="/servicios" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-gray-300 hover:text-neon-cyan transition-colors">SERVICIOS</Link>
                    <Link href="/contacto" onClick={() => setIsOpen(false)} className="text-lg font-orbitron text-gray-300 hover:text-neon-cyan transition-colors">CONTACTO</Link>

                    <div className="h-px bg-white/10 my-2"></div>

                    {user ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-neon-cyan font-bold">{user.name}</span>
                                <span className="text-neon-magenta font-bold">{(user.minutes / 60).toFixed(1)} hrs</span>
                            </div>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-center py-2 border border-white/20 rounded hover:bg-white/10 text-white font-bold">
                                MI CUENTA
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-center py-2 border border-neon-magenta/50 rounded hover:bg-neon-magenta/10 text-neon-magenta font-bold">
                            INICIAR SESIÓN
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
