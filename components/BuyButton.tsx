"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Globe } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
    minutes: number;
}

export default function BuyButton({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"MERCADOPAGO" | "ONE">("MERCADOPAGO");
    const router = useRouter();

    const handleBuy = async () => {
        setLoading(true);
        try {
            // 1. Check if user is logged in
            const authRes = await fetch("/api/auth/me");
            const user = await authRes.json();

            if (!user) {
                // Redirect to login with return url
                router.push("/login?redirect=/fichas-y-pases");
                return;
            }

            if (paymentMethod === "MERCADOPAGO") {
                // 2a. Create Preference Mercado Pago
                const res = await fetch("/api/payments/create-preference", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: product.name,
                        quantity: 1,
                        price: product.price,
                        userId: user.id,
                        minutes: product.minutes,
                    }),
                });

                const data = await res.json();

                if (data.init_point) {
                    window.location.href = data.init_point;
                } else {
                    alert("Error al iniciar el pago con Mercado Pago");
                    setLoading(false);
                }
            } else {
                // 2b. Create Preference One.lat
                const res = await fetch("/api/payments/one/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: product.id,
                        userId: user.id,
                    }),
                });

                const data = await res.json();

                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                } else {
                    console.error("One.lat error:", data);
                    const errorMessage = data.message || (data.details ? JSON.stringify(data.details) : (data.error || "Error desconocido"));
                    alert(`Error al iniciar el pago con One.lat: ${errorMessage}`);
                    setLoading(false);
                }
            }

        } catch (error) {
            console.error("Error buying:", error);
            alert("Ocurrió un error inesperado");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setPaymentMethod("MERCADOPAGO")}
                    className={`p-2 text-xs font-bold border rounded flex flex-col items-center gap-1 transition-all ${paymentMethod === "MERCADOPAGO"
                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                        : "bg-black/30 border-white/10 text-gray-500 hover:bg-white/5"
                        }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Mercado Pago
                </button>
                <button
                    onClick={() => setPaymentMethod("ONE")}
                    className={`p-2 text-xs font-bold border rounded flex flex-col items-center gap-1 transition-all ${paymentMethod === "ONE"
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-black/30 border-white/10 text-gray-500 hover:bg-white/5"
                        }`}
                >
                    <Globe className="w-4 h-4" />
                    Internacional
                </button>
            </div>

            <button
                onClick={handleBuy}
                disabled={loading}
                className={`w-full py-3 font-bold font-orbitron transition-colors flex items-center justify-center gap-2 ${product.type === "Pase"
                    ? "bg-neon-magenta text-black hover:bg-white"
                    : "bg-neon-cyan text-black hover:bg-white"
                    }`}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `COMPRAR CON ${paymentMethod === "MERCADOPAGO" ? "MERCADO PAGO" : "ONE.LAT"}`}
            </button>
        </div>
    );
}
