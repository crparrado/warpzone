"use client";

import { Trophy } from "lucide-react";

export default function AdminLogros() {
    return (
        <div>

            <div className="flex-1">
                <h1 className="text-3xl font-orbitron font-bold text-white mb-8">LOGROS</h1>

                <div className="glass p-8 rounded-lg text-center">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Sistema de logros próximamente.</p>
                </div>
            </div>
        </div>
    );
}
