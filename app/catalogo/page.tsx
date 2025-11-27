import Link from "next/link";
import { Filter, ShoppingCart } from "lucide-react";

const products = [
    { id: 1, name: "PlayStation 5 Slim", price: "$499.990", category: "Consolas", image: "https://warpzone.cl/wp-content/uploads/2023/11/ps5-slim.jpg" },
    { id: 2, name: "Nintendo Switch OLED", price: "$349.990", category: "Consolas", image: "https://warpzone.cl/wp-content/uploads/2021/10/switch-oled.jpg" },
    { id: 3, name: "Xbox Series X", price: "$529.990", category: "Consolas", image: "https://warpzone.cl/wp-content/uploads/2020/11/xbox-series-x.jpg" },
    { id: 4, name: "Elden Ring", price: "$49.990", category: "Juegos", image: "https://warpzone.cl/wp-content/uploads/2022/02/elden-ring.jpg" },
    { id: 5, name: "DualSense Edge", price: "$199.990", category: "Accesorios", image: "https://warpzone.cl/wp-content/uploads/2023/01/dualsense-edge.jpg" },
    { id: 6, name: "RTX 4090", price: "$1.899.990", category: "PC Gaming", image: "https://warpzone.cl/wp-content/uploads/2022/10/rtx-4090.jpg" },
];

export default function Catalogo() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                            CATÁLOGO
                        </h1>
                        <p className="text-gray-400">Explora nuestro arsenal de tecnología.</p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors font-orbitron text-sm">
                        <Filter className="w-4 h-4" /> FILTRAR
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group glass p-4 relative overflow-hidden hover:border-neon-magenta/50 transition-all duration-300">
                            <div className="aspect-video bg-gray-900 mb-4 relative overflow-hidden">
                                {/* Placeholder for image if external images fail */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-orbitron">
                                    NO IMAGE
                                </div>
                                {/* Simulated Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                <span className="absolute top-2 right-2 bg-neon-cyan text-black text-xs font-bold px-2 py-1 font-orbitron">
                                    {product.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold font-orbitron mb-2 group-hover:text-neon-cyan transition-colors">
                                {product.name}
                            </h3>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-neon-magenta">{product.price}</span>
                                <button className="p-2 bg-white/5 hover:bg-neon-cyan hover:text-black transition-colors rounded-full">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
