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
    const [discount, setDiscount] = useState(0);
    const router = useRouter();

    // Fetch discount on mount
    useState(() => {
        fetch("/api/settings/discount")
            .then(res => res.json())
            .then(data => setDiscount(data.discount))
            .catch(err => console.error("Error fetching discount:", err));
    });

    const plans: Plan[] = [
        { hours: 1, price: 2000, label: "Partida Rápida" },
        { hours: 3, price: 5000, label: "Tarde de Gaming", popular: true },
        { hours: 5, price: 8000, label: "Maratón" },
    ];

    const handleBuy = async (plan: Plan) => {
        try {
            setLoading(plan.label);

            const userRes = await fetch("/api/auth/me");
            const user = await userRes.json();

            if (!user || !user.id) {
                router.push("/login?callbackUrl=/reservas");
                return;
            }

            // Calculate discounted price
            const finalPrice = Math.round(plan.price * (1 - discount / 100));

            const response = await fetch("/api/payments/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `${plan.hours} Horas Warpzone`,
                    quantity: 1,
                    price: finalPrice,
                    userId: user.id,
                    minutes: plan.hours * 60
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
            {plans.map((plan, i) => {
                const discountedPrice = Math.round(plan.price * (1 - discount / 100));

                return (
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
                            {discount > 0 && (
                                <span className="inline-block mt-2 bg-neon-magenta text-black text-xs font-bold px-2 py-0.5 rounded">
                                    -{discount}% OFF
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            {discount > 0 ? (
                                <>
                                    <p className="text-sm text-gray-500 line-through">${plan.price.toLocaleString('es-CL')}</p>
                                    <p className="text-2xl font-bold text-neon-magenta">${discountedPrice.toLocaleString('es-CL')}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-neon-cyan">${plan.price.toLocaleString('es-CL')}</p>
                            )}

                            <button
                                disabled={!!loading}
                                className="text-xs text-white underline hover:text-neon-magenta flex items-center justify-end gap-2 ml-auto mt-1"
                            >
                                {loading === plan.label ? <Loader2 className="w-4 h-4 animate-spin" /> : "COMPRAR"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
