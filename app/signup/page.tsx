"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
            router.push("/reservas"); // Redirect to booking after signup
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error || "Error al crear cuenta");
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="glass p-8 w-full max-w-md border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-magenta to-neon-purple"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-neon-magenta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-neon-magenta" />
                    </div>
                    <h1 className="text-2xl font-orbitron font-bold text-white">CREAR CUENTA</h1>
                    <p className="text-gray-400 text-sm mt-2">Únete a la comunidad Warpzone</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">NOMBRE DE USUARIO</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-magenta outline-none transition-colors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">EMAIL</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-magenta outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">CONTRASEÑA</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-magenta outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-orbitron text-gray-400 mb-1">CONFIRMAR CONTRASEÑA</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-magenta outline-none transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-neon-magenta text-black font-bold font-orbitron hover:bg-white transition-colors mt-4"
                    >
                        REGISTRARSE
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-400">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-neon-cyan hover:text-white transition-colors">Inicia sesión aquí</Link>
                </div>
            </div>
        </div>
    );
}
