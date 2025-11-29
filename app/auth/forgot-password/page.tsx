"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al solicitar recuperación");
            }

            setStatus("success");
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

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
                        RECUPERAR CLAVE
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>

                    {status === "success" ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/50">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">¡Correo Enviado!</h3>
                                <p className="text-gray-400">
                                    Revisa tu bandeja de entrada (y spam). Si el correo existe en nuestro sistema, recibirás las instrucciones.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="block w-full py-4 bg-white/5 border border-white/10 text-white font-bold font-orbitron hover:bg-white/10 transition-colors text-center"
                            >
                                VOLVER AL LOGIN
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-orbitron text-gray-400 mb-2">EMAIL</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 p-4 pl-12 focus:border-neon-cyan focus:outline-none transition-colors text-white"
                                        placeholder="tucorreo@ejemplo.com"
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
                                {status === "loading" ? "ENVIANDO..." : "ENVIAR ENLACE"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
