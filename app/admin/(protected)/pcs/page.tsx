"use client";

import { useState, useEffect } from "react";
import { Monitor, Save, RefreshCw } from "lucide-react";

interface PC {
    id: string;
    name: string;
    status: string;
    parsecLink: string;
}

import AdminSidebar from "@/components/AdminSidebar";

export default function AdminPCs() {
    const [pcs, setPcs] = useState<PC[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        const res = await fetch("/api/pcs");
        const data = await res.json();
        setPcs(data);
        setLoading(false);
    };

    const handleUpdate = async (id: string, name: string, parsecLink: string, status: string) => {
        await fetch("/api/pcs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name, parsecLink, status }),
        });
        alert("PC Actualizado");
        fetchPCs();
    };

    return (
        <div>

            <div className="flex-1 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-orbitron font-bold text-white">GESTIÓN DE PCs</h1>
                    <button onClick={fetchPCs} className="p-2 bg-white/5 hover:bg-white/10 rounded-full">
                        <RefreshCw className={`w-5 h-5 text-neon-cyan ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="grid gap-6">
                    {pcs.map((pc) => (
                        <div key={pc.id} className="glass p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${pc.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    <Monitor className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 font-orbitron mb-1 block">NOMBRE</label>
                                    <input
                                        type="text"
                                        defaultValue={pc.name}
                                        id={`name-${pc.id}`}
                                        className="w-full bg-black/50 border border-white/10 p-2 text-sm text-white focus:border-neon-cyan outline-none font-orbitron"
                                    />
                                    <span className="text-xs text-gray-400">{pc.id.slice(0, 8)}...</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <label className="text-xs text-gray-500 font-orbitron mb-1 block">LINK DE PARSEC (Diario)</label>
                                <input
                                    type="text"
                                    defaultValue={pc.parsecLink}
                                    id={`link-${pc.id}`}
                                    className="w-full bg-black/50 border border-white/10 p-3 text-sm text-neon-cyan focus:border-neon-cyan outline-none font-mono"
                                />
                            </div>

                            <div className="flex gap-4">
                                <select
                                    defaultValue={pc.status}
                                    id={`status-${pc.id}`}
                                    className="bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-neon-cyan outline-none"
                                >
                                    <option value="AVAILABLE">DISPONIBLE</option>
                                    <option value="MAINTENANCE">MANTENCIÓN</option>
                                    <option value="BUSY">OCUPADO</option>
                                </select>

                                <button
                                    onClick={() => {
                                        const nameInput = document.getElementById(`name-${pc.id}`) as HTMLInputElement;
                                        const linkInput = document.getElementById(`link-${pc.id}`) as HTMLInputElement;
                                        const statusInput = document.getElementById(`status-${pc.id}`) as HTMLSelectElement;
                                        handleUpdate(pc.id, nameInput.value, linkInput.value, statusInput.value);
                                    }}
                                    className="px-6 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> GUARDAR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
