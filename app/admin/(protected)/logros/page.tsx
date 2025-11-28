"use client";

import { useState, useEffect } from "react";
import { Trophy, Edit, Save, Plus, Trash2, Award } from "lucide-react";

interface Achievement {
    id: string;
    name: string;
    description: string;
    milestone: number;
    reward: number;
    icon: string | null;
}

export default function AdminLogros() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Achievement>>({});

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await fetch("/api/achievements");
            const data = await res.json();
            setAchievements(data);
        } catch (error) {
            console.error("Error fetching achievements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (achievement: Achievement) => {
        setEditingId(achievement.id);
        setEditForm(achievement);
    };

    const handleSave = async (id: string) => {
        try {
            await fetch("/api/achievements", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...editForm }),
            });
            setEditingId(null);
            fetchAchievements();
        } catch (error) {
            console.error("Error updating achievement:", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white">LOGROS Y RECOMPENSAS</h1>
                <div className="flex items-center gap-2 text-neon-cyan">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-mono">{achievements.length} logros configurados</span>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-12">Cargando logros...</div>
            ) : (
                <div className="grid gap-4">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="glass p-6 border border-white/10 hover:border-neon-cyan/50 transition-all">
                            {editingId === achievement.id ? (
                                // Edit Mode
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">NOMBRE</label>
                                        <input
                                            type="text"
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-neon-cyan outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">HITO (HORAS)</label>
                                        <input
                                            type="number"
                                            value={editForm.milestone || 0}
                                            onChange={(e) => setEditForm({ ...editForm, milestone: parseInt(e.target.value) })}
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-neon-cyan outline-none text-sm font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">RECOMPENSA (HORAS)</label>
                                        <input
                                            type="number"
                                            value={editForm.reward || 0}
                                            onChange={(e) => setEditForm({ ...editForm, reward: parseInt(e.target.value) })}
                                            className="w-full bg-black/50 border border-white/10 p-2 text-neon-magenta focus:border-neon-magenta outline-none text-sm font-mono font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">ICONO</label>
                                        <input
                                            type="text"
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-neon-cyan outline-none text-sm text-center text-2xl"
                                        />
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <button
                                            onClick={() => handleSave(achievement.id)}
                                            className="flex-1 px-4 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> GUARDAR
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                                        >
                                            CANCELAR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="text-5xl">{achievement.icon || "🏆"}</div>
                                        <div>
                                            <h3 className="text-xl font-orbitron font-bold text-white">{achievement.name}</h3>
                                            <p className="text-sm text-gray-400">{achievement.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 font-orbitron mb-1">HITO</div>
                                            <div className="text-2xl font-bold text-neon-cyan font-mono">{achievement.milestone}h</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 font-orbitron mb-1">RECOMPENSA</div>
                                            <div className="text-2xl font-bold text-neon-magenta font-mono">+{achievement.reward}h</div>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(achievement)}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded transition-colors"
                                        >
                                            <Edit className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 glass p-6 border border-neon-cyan/30">
                <div className="flex items-start gap-4">
                    <Trophy className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-orbitron font-bold text-white mb-2">Cómo funciona el sistema de logros</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Cada hora comprada = 1 nivel</li>
                            <li>• Al alcanzar un hito, el usuario desbloquea el logro automáticamente</li>
                            <li>• Las horas de recompensa se suman inmediatamente a su cuenta</li>
                            <li>• Los logros solo se desbloquean una vez (no son repetibles)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
