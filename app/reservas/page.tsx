import { Clock, CreditCard, Calendar } from "lucide-react";
import BookingCalendar from "@/components/BookingCalendar";

export default function Reservas() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4">
                        RESERVA TU <span className="text-neon-cyan">PC GAMER</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Compra fichas, elige tu horario y recibe tu link de conexión. Así de simple.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Step 1: Buy Tokens */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-neon-cyan text-black flex items-center justify-center font-bold font-orbitron">1</div>
                            <h2 className="text-2xl font-orbitron font-bold">COMPRA FICHAS</h2>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { hours: 1, price: "$2.000", label: "Partida Rápida" },
                                { hours: 3, price: "$5.000", label: "Tarde de Gaming", popular: true },
                                { hours: 5, price: "$8.000", label: "Maratón" },
                            ].map((plan, i) => (
                                <div key={i} className={`glass p-6 flex justify-between items-center cursor-pointer hover:border-neon-cyan transition-all ${plan.popular ? 'border-neon-cyan/50 bg-neon-cyan/5' : ''}`}>
                                    <div>
                                        <h3 className="text-xl font-bold font-orbitron text-white">{plan.hours} HORA{plan.hours > 1 ? 'S' : ''}</h3>
                                        <p className="text-sm text-gray-400">{plan.label}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-neon-cyan">{plan.price}</p>
                                        <button className="text-xs text-white underline hover:text-neon-magenta">COMPRAR</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Book Slot */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-neon-magenta text-black flex items-center justify-center font-bold font-orbitron">2</div>
                            <h2 className="text-2xl font-orbitron font-bold">AGENDA TU HORA</h2>
                        </div>

                        <BookingCalendar />
                    </div>

                </div>
            </div>
        </div>
    );
}
