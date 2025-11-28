"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
    name: string;
    minutes: number;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
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
            <Link href="/" className="text-2xl font-orbitron font-bold text-neon-cyan tracking-wider hover:text-neon-magenta transition-colors">
                WARPZONE
            </Link>

            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 font-orbitron items-center">
                <Link href="/" className="hover:text-neon-cyan transition-colors">INICIO</Link>
                <Link href="/reservas" className="hover:text-neon-cyan transition-colors text-neon-magenta">RESERVAS</Link>
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

            <div className="flex gap-4">
                <Link href="/fichas-y-pases" className="hidden md:block px-6 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-orbitron text-sm hover:bg-neon-cyan hover:text-black transition-all duration-300 clip-path-slant">
                    COMPRAR FICHAS
                </Link>
            </div>
        </nav>
    );
}
