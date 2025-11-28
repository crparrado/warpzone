"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Save, DollarSign, Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (id: string, newPrice: string) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, price: parseInt(newPrice) || 0 } : p
        ));
    };

    const savePrice = async (id: string, price: number) => {
        setSaving(id);
        try {
            await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, price }),
            });
        } catch (error) {
            console.error("Error updating price:", error);
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-cyan selection:text-black">
            <AdminSidebar />

            <main className="ml-0 md:ml-64 p-8 pt-24">
                <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-8">
                    GESTIÓN DE PRECIOS
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="glass p-6 border border-white/10 hover:border-neon-cyan transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${product.type === 'Pase' ? 'bg-neon-magenta/20 text-neon-magenta' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                                            {product.type.toUpperCase()}
                                        </span>
                                        <h3 className="text-xl font-bold mt-2">{product.name}</h3>
                                    </div>
                                    <DollarSign className="w-6 h-6 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs text-gray-400 mb-1 block">PRECIO (CLP)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                            className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-neon-cyan outline-none font-mono text-lg"
                                        />
                                        <button
                                            onClick={() => savePrice(product.id, product.price)}
                                            disabled={saving === product.id}
                                            className="bg-neon-cyan text-black p-2 hover:bg-white transition-colors disabled:opacity-50"
                                        >
                                            {saving === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
