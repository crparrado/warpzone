"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, Plus, Search, RefreshCw } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminUsuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'USER' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });
        setShowModal(false);
        setNewUser({ name: '', email: '', role: 'USER' });
        fetchUsers();
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex gap-8">
            <AdminSidebar />

            <div className="flex-1">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-orbitron font-bold text-white">USUARIOS</h1>
                    <div className="flex gap-4">
                        <button onClick={fetchUsers} className="p-2 bg-white/5 hover:bg-white/10 rounded-full">
                            <RefreshCw className={`w-5 h-5 text-neon-cyan ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center gap-2 rounded-sm"
                        >
                            <Plus className="w-4 h-4" /> NUEVO USUARIO
                        </button>
                    </div>
                </div>

                <div className="glass p-6 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs uppercase bg-white/5 text-gray-300 font-orbitron">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.name || 'Sin nombre'}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-neon-magenta/20 text-neon-magenta' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="glass p-8 w-full max-w-md border border-white/10">
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Crear Usuario</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-1">Rol</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-neon-cyan outline-none"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="USER">Usuario</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
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
                                    className="flex-1 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white"
                                >
                                    CREAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
