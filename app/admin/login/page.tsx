"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    setError("No tienes permisos de administrador.");
                }
            } else {
                const data = await res.json();
                setError(data.error || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-purple/5"></div>

            <div className="relative z-10 w-full max-w-md p-8 glass border border-white/10 rounded-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">ADMIN ACCESS</h1>
                    <p className="text-gray-400 mt-2">Warpzone Command Center</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                            placeholder="admin@warpzone.cl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm rounded text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-neon-cyan text-black font-bold font-orbitron py-3 rounded hover:bg-white transition-colors"
                    >
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
}
