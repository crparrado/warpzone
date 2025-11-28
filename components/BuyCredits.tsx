"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Plan {
    hours: number;
    price: number;
    label: string;
    popular?: boolean;
}

export default function BuyCredits() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const plans: Plan[] = [
        { hours: 1, price: 2000, label: "Partida Rápida" },
        { hours: 3, price: 5000, label: "Tarde de Gaming", popular: true },
        { hours: 5, price: 8000, label: "Maratón" },
    ];

    const handleBuy = async (plan: Plan) => {
        try {
            setLoading(plan.label);

            // We need a user ID for the preference. 
            // Ideally this comes from auth context, but for now we'll check if we can get it or handle it in the backend.
            // The existing create-preference route expects userId.
            // Let's fetch the user first.

            const userRes = await fetch("/api/auth/me");
            const user = await userRes.json();

            if (!user || !user.id) {
                // Redirect to login if not logged in
                // Encode the return URL to come back here
                router.push("/login?callbackUrl=/reservas");
                return;
            }

            const response = await fetch("/api/payments/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `${plan.hours} Horas Warpzone`,
                    quantity: 1,
                    price: plan.price,
                    userId: user.id,
                    minutes: plan.hours * 60 // Convert hours to minutes for the backend logic
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear preferencia de pago");
            }

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert("Error al iniciar pago");
            }

        } catch (error) {
            console.error("Error buying credits:", error);
            alert("Ocurrió un error al procesar tu solicitud.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid gap-6">
            {plans.map((plan, i) => (
                <div
                    key={i}
                    onClick={() => !loading && handleBuy(plan)}
                    className={`glass p-6 flex justify-between items-center cursor-pointer hover:border-neon-cyan transition-all 
                        ${plan.popular ? 'border-neon-cyan/50 bg-neon-cyan/5' : ''}
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <div>
                        <h3 className="text-xl font-bold font-orbitron text-white">{plan.hours} HORA{plan.hours > 1 ? 'S' : ''}</h3>
                        <p className="text-sm text-gray-400">{plan.label}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-neon-cyan">${plan.price.toLocaleString('es-CL')}</p>
                        <button
                            disabled={!!loading}
                            className="text-xs text-white underline hover:text-neon-magenta flex items-center justify-end gap-2 ml-auto"
                        >
                            {loading === plan.label ? <Loader2 className="w-4 h-4 animate-spin" /> : "COMPRAR"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
