"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus("error");
            setErrorMessage("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setStatus("error");
            setErrorMessage("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al restablecer contraseña");
            }

            setStatus("success");
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 mb-6">
                    Token inválido o faltante.
                </div>
                <Link href="/auth/forgot-password" className="text-neon-cyan hover:underline">
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/50">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-2">¡Contraseña Actualizada!</h3>
                    <p className="text-gray-400">
                        Tu clave ha sido cambiada exitosamente. Redirigiendo al login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-orbitron text-gray-400 mb-2">NUEVA CONTRASEÑA</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-4 pl-12 focus:border-neon-cyan focus:outline-none transition-colors text-white"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-orbitron text-gray-400 mb-2">CONFIRMAR CONTRASEÑA</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 p-4 pl-12 focus:border-neon-cyan focus:outline-none transition-colors text-white"
                        placeholder="Repite tu contraseña"
                    />
                </div>
            </div>

            {status === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "loading" ? "ACTUALIZANDO..." : "CAMBIAR CONTRASEÑA"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="mb-8">
                    <Link href="/login" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al Login
                    </Link>
                </div>

                <div className="glass p-8 md:p-12">
                    <h1 className="text-3xl font-orbitron font-bold mb-2 text-white text-center">
                        NUEVA CLAVE
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        Ingresa tu nueva contraseña para recuperar el acceso.
                    </p>

                    <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
