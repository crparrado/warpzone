"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
    minutes: number;
}

export default function BuyButton({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false);
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

            // 2. Create Preference
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
                // 3. Redirect to MercadoPago
                window.location.href = data.init_point;
            } else {
                alert("Error al iniciar el pago");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error buying:", error);
            alert("Ocurrió un error inesperado");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={loading}
            className={`w-full py-3 font-bold font-orbitron transition-colors flex items-center justify-center gap-2 ${product.type === "Pase"
                    ? "bg-neon-magenta text-black hover:bg-white"
                    : "bg-neon-cyan text-black hover:bg-white"
                }`}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "COMPRAR"}
        </button>
    );
}
