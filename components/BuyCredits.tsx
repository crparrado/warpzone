"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    minutes: number;
    type: string;
    description?: string;
    popular?: boolean;
}

interface BuyCreditsProps {
    discount?: number;
    products: Product[];
}

export default function BuyCredits({ discount = 0, products = [] }: BuyCreditsProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleBuy = async (product: Product) => {
        try {
            setLoading(product.name);

            const userRes = await fetch("/api/auth/me");
            const user = await userRes.json();

            if (!user || !user.id) {
                router.push("/login?callbackUrl=/reservas");
                return;
            }

            // Calculate discounted price
            const finalPrice = Math.round(product.price * (1 - discount / 100));

            const response = await fetch("/api/payments/create-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: product.name,
                    quantity: 1,
                    price: finalPrice,
                    userId: user.id,
                    minutes: product.minutes,
                    productId: product.id
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

    // Filter to only show "Ficha" type products if we want to mimic the original "Buy Credits" section,
    // OR show all. The user said "should be the same", implying full catalog.
    // However, the section is titled "COMPRA FICHAS".
    // Let's show all for consistency as requested, but maybe sort by price.
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);

    return (
        <div className="grid gap-6">
            {sortedProducts.map((product) => {
                const discountedPrice = Math.round(product.price * (1 - discount / 100));

                return (
                    <div
                        key={product.id}
                        onClick={() => !loading && handleBuy(product)}
                        className={`glass p-6 flex justify-between items-center cursor-pointer hover:border-neon-cyan transition-all 
                            ${product.popular ? 'border-neon-cyan/50 bg-neon-cyan/5' : ''}
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <div>
                            <h3 className="text-xl font-bold font-orbitron text-white">{product.name}</h3>
                            <p className="text-sm text-gray-400">{product.description || `${product.minutes / 60} Horas`}</p>
                            {discount > 0 && (
                                <span className="inline-block mt-2 bg-neon-magenta text-black text-xs font-bold px-2 py-0.5 rounded">
                                    -{discount}% OFF
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            {discount > 0 ? (
                                <>
                                    <p className="text-sm text-gray-500 line-through">${product.price.toLocaleString('es-CL')}</p>
                                    <p className="text-2xl font-bold text-neon-magenta">${discountedPrice.toLocaleString('es-CL')}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-neon-cyan">${product.price.toLocaleString('es-CL')}</p>
                            )}

                            <button
                                disabled={!!loading}
                                className="text-xs text-white underline hover:text-neon-magenta flex items-center justify-end gap-2 ml-auto mt-1"
                            >
                                {loading === product.name ? <Loader2 className="w-4 h-4 animate-spin" /> : "COMPRAR"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
