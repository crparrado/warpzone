"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, Plus, Search, RefreshCw } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    minutes: number;
    createdAt: string;
}

export default function AdminUsuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState(0);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'USER' });

    const [search, setSearch] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
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

    const handleAddCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        await fetch(`/api/users/${selectedUser.id}/credits`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ minutes: creditAmount }),
        });
        setShowCreditModal(false);
        setCreditAmount(0);
        setSelectedUser(null);
        fetchUsers();
    };

    const openCreditModal = (user: User) => {
        setSelectedUser(user);
        setCreditAmount(60); // Default to 1 hour
        setShowCreditModal(true);
    };

    return (
        <div>

            <div className="flex-1 w-full overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white">USUARIOS</h1>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-neon-cyan outline-none transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <button onClick={fetchUsers} className="p-2 bg-white/5 hover:bg-white/10 rounded-full">
                                <RefreshCw className={`w-5 h-5 text-neon-cyan ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex-1 md:flex-none px-4 py-2 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-sm"
                            >
                                <Plus className="w-4 h-4" /> <span className="hidden md:inline">NUEVO USUARIO</span><span className="md:hidden">NUEVO</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block glass p-6 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs uppercase bg-white/5 text-gray-300 font-orbitron">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Créditos</th>
                                <th className="px-6 py-3">Acciones</th>
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
                                    <td className="px-6 py-4 font-orbitron text-white">
                                        {(user.minutes / 60).toFixed(1)} hrs
                                        <span className="text-xs text-gray-500 ml-1">({user.minutes} min)</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openCreditModal(user)}
                                            className="text-neon-cyan hover:text-white transition-colors text-xs font-bold border border-neon-cyan/30 px-2 py-1 rounded hover:bg-neon-cyan/10"
                                        >
                                            GESTIONAR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="glass p-4 border border-white/10 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-white text-lg">{user.name || 'Sin nombre'}</div>
                                    <div className="text-gray-400 text-sm">{user.email}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-neon-magenta/20 text-neon-magenta' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                <div>
                                    <div className="text-xs text-gray-500 font-orbitron">CRÉDITOS</div>
                                    <div className="text-white font-orbitron">{(user.minutes / 60).toFixed(1)} hrs</div>
                                </div>
                                <button
                                    onClick={() => openCreditModal(user)}
                                    className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 px-3 py-2 rounded text-sm font-bold hover:bg-neon-cyan hover:text-black transition-colors"
                                >
                                    GESTIONAR HORAS
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {users.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">
                        No hay usuarios registrados.
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 md:p-8 w-full max-w-md border border-white/10">
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

            {/* Credit Management Modal */}
            {showCreditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 md:p-8 w-full max-w-md border border-white/10">
                        <h2 className="text-xl font-orbitron font-bold text-white mb-2">Gestionar Horas</h2>
                        <p className="text-gray-400 text-sm mb-6">Usuario: <span className="text-neon-cyan">{selectedUser.name}</span></p>

                        <form onSubmit={handleAddCredits} className="space-y-6">
                            <div>
                                <label className="block text-xs font-orbitron text-gray-400 mb-2">GESTIONAR CRÉDITOS (MINUTOS)</label>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Add Credits */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-green-400 font-bold text-center">AGREGAR</p>
                                        <div className="flex flex-col gap-2">
                                            {[60, 180, 300].map(mins => (
                                                <button
                                                    key={`add-${mins}`}
                                                    type="button"
                                                    onClick={() => setCreditAmount(mins)}
                                                    className={`py-2 text-xs font-bold border transition-colors ${creditAmount === mins ? 'bg-green-500 text-black border-green-500' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}
                                                >
                                                    +{mins / 60} hrs
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subtract Credits */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-red-400 font-bold text-center">RESTAR</p>
                                        <div className="flex flex-col gap-2">
                                            {[-60, -180, -300].map(mins => (
                                                <button
                                                    key={`sub-${mins}`}
                                                    type="button"
                                                    onClick={() => setCreditAmount(mins)}
                                                    className={`py-2 text-xs font-bold border transition-colors ${creditAmount === mins ? 'bg-red-500 text-black border-red-500' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}
                                                >
                                                    {mins / 60} hrs
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <label className="block text-xs font-orbitron text-gray-400 mb-2">VALOR MANUAL</label>
                                <input
                                    type="number"
                                    required
                                    className={`w-full bg-black/50 border p-3 text-white outline-none text-center font-orbitron text-xl ${creditAmount >= 0 ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500'}`}
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Valor positivo suma, valor negativo resta.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreditModal(false)}
                                    className="flex-1 py-3 border border-white/10 text-gray-400 font-orbitron hover:bg-white/5"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white"
                                >
                                    GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
