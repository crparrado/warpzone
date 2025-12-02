"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle, AlertTriangle } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    if (!token) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-orbitron font-bold text-white mb-4">ENLACE INVÁLIDO</h1>
                <p className="text-gray-400 mb-6">El enlace de recuperación no es válido o ha expirado.</p>
                <Link href="/forgot-password" className="text-neon-cyan hover:text-white font-bold font-orbitron">
                    INTENTAR DE NUEVO
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage(data.error || "Error al restablecer contraseña.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error de conexión.");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-neon-cyan" />
                </div>
                <h1 className="text-2xl font-orbitron font-bold text-white mb-4">¡CONTRASEÑA ACTUALIZADA!</h1>
                <p className="text-gray-400 mb-6">
                    Tu contraseña ha sido cambiada exitosamente.
                </p>
                <Link href="/login" className="px-6 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors rounded-sm">
                    INICIAR SESIÓN
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-neon-cyan" />
                </div>
                <h1 className="text-2xl font-orbitron font-bold text-white">NUEVA CONTRASEÑA</h1>
                <p className="text-gray-400 text-sm mt-2">Ingresa tu nueva contraseña.</p>
            </div>

            {status === "error" && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 text-sm mb-6 text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-orbitron text-gray-400 mb-1">NUEVA CONTRASEÑA</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-orbitron text-gray-400 mb-1">CONFIRMAR CONTRASEÑA</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none transition-colors"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors mt-4 disabled:opacity-50"
                >
                    {status === "loading" ? "ACTUALIZANDO..." : "CAMBIAR CONTRASEÑA"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="glass p-8 w-full max-w-md border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-blue"></div>
                <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
