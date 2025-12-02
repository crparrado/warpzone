"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/reservas"); // Redirect to booking after login
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error || "Error al iniciar sesión");
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="glass p-8 w-full max-w-md border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h1 className="text-2xl font-orbitron font-bold text-white">INICIAR SESIÓN</h1>
                    <p className="text-gray-400 text-sm mt-2">Accede a tu cuenta Warpzone</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">EMAIL</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">CONTRASEÑA</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="text-right mt-2">
                            <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-neon-cyan transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors mt-4"
                    >
                        ENTRAR
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-400">
                    ¿No tienes cuenta? <Link href="/signup" className="text-neon-magenta hover:text-white transition-colors">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
}
