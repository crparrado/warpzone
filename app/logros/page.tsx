"use client";

import { useState, useEffect } from "react";
import { Trophy, Award, Star, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Achievement {
    id: string;
    name: string;
    description: string;
    milestone: number;
    reward: number;
    icon: string | null;
}

interface UserAchievementData {
    level: number;
    totalHoursPurchased: number;
    currentMinutes: number;
    unlockedAchievements: Achievement[];
    nextAchievement: Achievement | null;
    totalAchievements: number;
}

export default function LogrosPage() {
    const [data, setData] = useState<UserAchievementData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Get user from session
            const userRes = await fetch("/api/auth/me");
            const userData = await userRes.json();

            if (!userData) {
                router.push("/login");
                return;
            }

            const res = await fetch(`/api/users/${userData.id}/achievements`);
            const achievementData = await res.json();
            setData(achievementData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-white text-xl">Error al cargar datos</div>
            </div>
        );
    }

    const progressToNext = data.nextAchievement
        ? (data.totalHoursPurchased / data.nextAchievement.milestone) * 100
        : 100;

    return (
        <div className="min-h-screen pt-24 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-orbitron font-bold text-white mb-4">
                        MIS LOGROS
                    </h1>
                    <p className="text-gray-400">Nivel, logros y progreso</p>
                </div>

                {/* Level Card */}
                <div className="glass p-8 mb-8 border border-neon-cyan/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="text-sm text-gray-400 font-orbitron mb-2">NIVEL ACTUAL</div>
                                <div className="text-7xl font-bold text-neon-cyan font-orbitron">{data.level}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 font-orbitron mb-2">HORAS COMPRADAS</div>
                                <div className="text-4xl font-bold text-white font-mono">{data.totalHoursPurchased}h</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 font-orbitron mb-2">SALDO ACTUAL</div>
                                <div className="text-4xl font-bold text-neon-magenta font-mono">{Math.floor(data.currentMinutes / 60)}h {data.currentMinutes % 60}m</div>
                            </div>
                        </div>

                        {data.nextAchievement && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400 font-orbitron">
                                        PRÓXIMO LOGRO: {data.nextAchievement.name}
                                    </span>
                                    <span className="text-sm text-neon-cyan font-mono">
                                        {data.totalHoursPurchased}/{data.nextAchievement.milestone}h
                                    </span>
                                </div>
                                <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-500"
                                        style={{ width: `${Math.min(progressToNext, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Unlocked Achievements */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Award className="w-6 h-6 text-neon-cyan" />
                            <h2 className="text-2xl font-orbitron font-bold text-white">
                                LOGROS DESBLOQUEADOS
                            </h2>
                            <span className="text-neon-cyan font-mono">
                                {data.unlockedAchievements.length}/{data.totalAchievements}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {data.unlockedAchievements.length > 0 ? (
                                data.unlockedAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="glass p-4 border border-neon-cyan/30 hover:border-neon-cyan transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl">{achievement.icon || "🏆"}</div>
                                            <div className="flex-1">
                                                <h3 className="font-orbitron font-bold text-white">{achievement.name}</h3>
                                                <p className="text-sm text-gray-400">{achievement.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">RECOMPENSA</div>
                                                <div className="text-lg font-bold text-neon-magenta font-mono">+{achievement.reward}h</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass p-8 text-center border border-white/10">
                                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400">Aún no has desbloqueado logros</p>
                                    <p className="text-sm text-gray-500 mt-2">Compra horas para empezar a subir de nivel</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Achievement */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Star className="w-6 h-6 text-neon-magenta" />
                            <h2 className="text-2xl font-orbitron font-bold text-white">
                                PRÓXIMO OBJETIVO
                            </h2>
                        </div>
                        {data.nextAchievement ? (
                            <div className="glass p-6 border border-neon-magenta/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-magenta/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-5xl">{data.nextAchievement.icon || "🎯"}</div>
                                        <div>
                                            <h3 className="text-xl font-orbitron font-bold text-white">{data.nextAchievement.name}</h3>
                                            <p className="text-sm text-gray-400">{data.nextAchievement.description}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="text-center p-3 bg-black/30 rounded">
                                            <div className="text-xs text-gray-500 mb-1">HITO</div>
                                            <div className="text-2xl font-bold text-neon-cyan font-mono">{data.nextAchievement.milestone}h</div>
                                        </div>
                                        <div className="text-center p-3 bg-black/30 rounded">
                                            <div className="text-xs text-gray-500 mb-1">RECOMPENSA</div>
                                            <div className="text-2xl font-bold text-neon-magenta font-mono">+{data.nextAchievement.reward}h</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="text-sm text-gray-400">Te faltan</div>
                                        <div className="text-3xl font-bold text-white font-mono">
                                            {data.nextAchievement.milestone - data.totalHoursPurchased}h
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass p-8 text-center border border-white/10">
                                <Trophy className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
                                <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                                    ¡COMPLETASTE TODOS LOS LOGROS!
                                </h3>
                                <p className="text-gray-400">Eres un verdadero Dios del Gaming 👾</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
