"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Si el correo existe, recibirás un enlace de recuperación.");
            } else {
                setStatus("error");
                setMessage(data.error || "Error al enviar solicitud.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error de conexión.");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
                <div className="glass p-8 w-full max-w-md border border-neon-cyan/30 text-center">
                    <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h1 className="text-2xl font-orbitron font-bold text-white mb-4">¡ENLACE ENVIADO!</h1>
                    <p className="text-gray-400 mb-6">
                        Revisa tu bandeja de entrada (y spam). Hemos enviado las instrucciones a <strong>{email}</strong>.
                    </p>
                    <Link href="/login" className="text-neon-cyan hover:text-white font-bold font-orbitron transition-colors">
                        VOLVER AL LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="glass p-8 w-full max-w-md border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-blue"></div>

                <Link href="/login" className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h1 className="text-2xl font-orbitron font-bold text-white">RECUPERAR CONTRASEÑA</h1>
                    <p className="text-gray-400 text-sm mt-2">Ingresa tu email para recibir un enlace de restablecimiento.</p>
                </div>

                {status === "error" && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 text-sm mb-6 text-center">
                        {message}
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

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors mt-4 disabled:opacity-50"
                    >
                        {status === "loading" ? "ENVIANDO..." : "ENVIAR ENLACE"}
                    </button>
                </form>
            </div>
        </div>
    );
}
