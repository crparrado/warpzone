"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Plus, Upload, Power, PowerOff } from "lucide-react";
import Image from "next/image";

interface Game {
    id: string;
    name: string;
    imageUrl: string;
    active: boolean;
}

export default function AdminJuegos() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newGameName, setNewGameName] = useState("");
    const [newGameImage, setNewGameImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const res = await fetch("/api/games");
            const data = await res.json();
            setGames(data);
        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleGameStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/games/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (res.ok) {
                setGames(games.map(g => g.id === id ? { ...g, active: !currentStatus } : g));
            }
        } catch (error) {
            console.error("Error updating game:", error);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGameName) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("name", newGameName);
        if (newGameImage) {
            formData.append("image", newGameImage);
        }

        try {
            const res = await fetch("/api/games", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setShowModal(false);
                setNewGameName("");
                setNewGameImage(null);
                fetchGames();
            }
        } catch (error) {
            console.error("Error uploading game:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white">JUEGOS</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center gap-2 rounded-sm"
                >
                    <Plus className="w-4 h-4" /> AGREGAR JUEGO
                </button>
            </div>

            {loading ? (
                <div className="text-white text-center py-12">Cargando juegos...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className={`glass rounded-lg overflow-hidden border transition-all ${game.active ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}>
                            <div className="relative aspect-[3/4] group bg-gray-900 flex items-center justify-center">
                                {game.imageUrl ? (
                                    <Image
                                        src={game.imageUrl}
                                        alt={game.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <Gamepad2 className="w-12 h-12 text-gray-600 group-hover:scale-110 transition-transform duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => toggleGameStatus(game.id, game.active)}
                                        className={`p-3 rounded-full ${game.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} hover:scale-110 transition-transform`}
                                        title={game.active ? "Deshabilitar" : "Habilitar"}
                                    >
                                        {game.active ? <PowerOff className="w-6 h-6" /> : <Power className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-white font-orbitron text-sm truncate" title={game.name}>{game.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${game.active ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
                                    <span className="text-xs text-gray-400">{game.active ? 'Disponible' : 'Deshabilitado'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 md:p-8 w-full max-w-md border border-white/10">
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Agregar Juego</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Nombre del Juego</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newGameName}
                                    onChange={(e) => setNewGameName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Imagen (Opcional)</label>
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-neon-cyan/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setNewGameImage(e.target.files?.[0] || null)}
                                    />
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-300">
                                        {newGameImage ? newGameImage.name : "Click para subir imagen"}
                                    </p>
                                </div>
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
                                    disabled={uploading}
                                    className="flex-1 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white disabled:opacity-50"
                                >
                                    {uploading ? "SUBIENDO..." : "GUARDAR"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
