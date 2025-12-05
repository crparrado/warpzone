"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Save, DollarSign, Loader2, Plus, Tag, Trash2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
    active: boolean;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [savingDiscount, setSavingDiscount] = useState(false);

    // New Product State
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        minutes: "60",
        type: "Ficha",
        description: "",
        popular: false
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchSettings();
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

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setDiscount(data.generalDiscount || 0);
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleDiscountChange = async (newDiscount: number) => {
        setDiscount(newDiscount);
        setSavingDiscount(true);
        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ generalDiscount: newDiscount }),
            });
        } catch (error) {
            console.error("Error saving discount:", error);
        } finally {
            setSavingDiscount(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (res.ok) {
                setShowModal(false);
                setNewProduct({
                    name: "",
                    price: "",
                    minutes: "60",
                    type: "Ficha",
                    description: "",
                    popular: false
                });
                fetchProducts();
            }
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setCreating(false);
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

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

        try {
            const res = await fetch("/api/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error al eliminar el producto");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white">PRODUCTOS</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center gap-2 rounded-sm"
                >
                    <Plus className="w-4 h-4" /> CREAR PRODUCTO
                </button>
            </div>

            {/* Discount Slider */}
            <div className="glass p-6 border border-neon-magenta/30 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-neon-magenta" />
                        DESCUENTO GENERAL (BLACK FRIDAY)
                    </h3>
                    <span className="text-2xl font-bold text-neon-magenta">{discount}% OFF</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="5"
                    value={discount}
                    onChange={(e) => handleDiscountChange(parseInt(e.target.value))}
                    className="w-full accent-neon-magenta cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                    <span>0%</span>
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                    <span>20%</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="glass p-6 border border-white/10 hover:border-neon-cyan transition-all group relative overflow-hidden">
                            {discount > 0 && (
                                <div className="absolute top-0 right-0 bg-neon-magenta text-black text-xs font-bold px-2 py-1">
                                    -{discount}%
                                </div>
                            )}
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
                                <label className="text-xs text-gray-400 mb-1 block">PRECIO BASE (CLP)</label>
                                <div className="flex gap-2 mb-4">
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

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-400">DISPONIBILIDAD</span>
                                    <button
                                        onClick={async () => {
                                            const newStatus = !product.active;
                                            // Optimistic update
                                            setProducts(products.map(p => p.id === product.id ? { ...p, active: newStatus } : p));
                                            try {
                                                await fetch("/api/products", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ id: product.id, active: newStatus }),
                                                });
                                            } catch (error) {
                                                console.error("Error updating status", error);
                                                // Revert on error
                                                setProducts(products.map(p => p.id === product.id ? { ...p, active: !newStatus } : p));
                                            }
                                        }}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${product.active ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${product.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="text-right text-xs mb-2">
                                    {product.active ? <span className="text-green-400">VISIBLE</span> : <span className="text-gray-500">OCULTO</span>}
                                </div>

                                {discount > 0 && (
                                    <div className="mt-2 text-right text-sm">
                                        <span className="text-gray-500 line-through mr-2">${product.price}</span>
                                        <span className="text-neon-magenta font-bold">${Math.round(product.price * (1 - discount / 100))}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="mt-4 w-full py-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-orbitron"
                            >
                                <Trash2 className="w-4 h-4" /> ELIMINAR PRODUCTO
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 md:p-8 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Crear Producto</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-orbitron text-gray-400 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-orbitron text-gray-400 mb-1">Minutos</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                        value={newProduct.minutes}
                                        onChange={(e) => setNewProduct({ ...newProduct, minutes: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Tipo</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newProduct.type}
                                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                >
                                    <option value="Ficha">Ficha</option>
                                    <option value="Pase">Pase</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Descripción</label>
                                <textarea
                                    required
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none h-24"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="popular"
                                    checked={newProduct.popular}
                                    onChange={(e) => setNewProduct({ ...newProduct, popular: e.target.checked })}
                                    className="w-4 h-4 accent-neon-cyan"
                                />
                                <label htmlFor="popular" className="text-sm text-gray-300">Marcar como Popular</label>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-white/10 text-gray-400 font-orbitron hover:bg-white/5"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white disabled:opacity-50"
                                >
                                    {creating ? "CREANDO..." : "CREAR"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
