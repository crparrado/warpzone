"use client";

import { Gamepad2 } from "lucide-react";

export default function AdminJuegos() {
    return (
        <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">JUEGOS</h1>

            <div className="glass p-8 rounded-lg text-center">
                <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Catálogo de juegos próximamente.</p>
            </div>
        </div>
    );
}
