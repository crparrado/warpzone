"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";

interface Purchase {
    id: string;
    user: {
        name: string | null;
        email: string;
    };
    product: {
        name: string;
    };
    amount: number;
    createdAt: string;
}

export default function AdminPurchases() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/purchases")
            .then(res => res.json())
            .then(data => setPurchases(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">HISTORIAL DE COMPRAS</h1>

            {loading ? (
                <div className="text-white text-center py-12">Cargando compras...</div>
            ) : (
                <div className="glass p-8 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-300 font-orbitron">
                                <tr>
                                    <th className="px-6 py-3">Usuario</th>
                                    <th className="px-6 py-3">Producto</th>
                                    <th className="px-6 py-3">Monto</th>
                                    <th className="px-6 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {purchases.map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {purchase.user.name || purchase.user.email}
                                            {purchase.user.name && <div className="text-xs text-gray-500">{purchase.user.email}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-neon-cyan flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            {purchase.product.name}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">{formatCurrency(purchase.amount)}</td>
                                        <td className="px-6 py-4">{new Date(purchase.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No hay compras registradas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
