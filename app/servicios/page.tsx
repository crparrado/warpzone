import { Monitor, Users, Shield, Gamepad2 } from "lucide-react";

export default function Servicios() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">
                    NUESTROS SERVICIOS
                </h1>

                <div className="space-y-20">

                    {/* Remote Gaming */}
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="w-16 h-16 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan mb-6">
                                <Monitor className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-orbitron font-bold mb-4 text-white">Arriendo Remoto</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Accede a nuestra granja de PCs de alto rendimiento desde la comodidad de tu casa.
                                Ideal para juegos competitivos, renderizado o simplemente disfrutar títulos AAA en ultra.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Conexión vía Parsec (Baja latencia)</li>
                                <li>• Hardware: RTX 3060 / 4060 o superior</li>
                                <li>• Catálogo de juegos pre-instalados</li>
                            </ul>
                        </div>
                        <div className="flex-1 h-64 glass rounded-lg flex items-center justify-center bg-gradient-to-br from-neon-cyan/5 to-transparent">
                            <span className="font-orbitron text-neon-cyan/30 text-4xl font-bold">REMOTE PLAY</span>
                        </div>
                    </div>

                    {/* Events */}
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="flex-1">
                            <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-orbitron font-bold mb-4 text-white">Eventos y Torneos</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Llevamos la arena de esports a tu ubicación. Montamos estaciones de juego completas
                                para colegios, ferias, empresas y centros comunitarios.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li>• 4 PCs Gamer completos + Periféricos</li>
                                <li>• Organización de torneos (Brackets, Premios)</li>
                                <li>• Animación y soporte técnico en sitio</li>
                            </ul>
                        </div>
                        <div className="flex-1 h-64 glass rounded-lg flex items-center justify-center bg-gradient-to-bl from-neon-purple/5 to-transparent">
                            <span className="font-orbitron text-neon-purple/30 text-4xl font-bold">EVENTS</span>
                        </div>
                    </div>

                    {/* Cyber Software */}
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="w-16 h-16 rounded-full bg-neon-magenta/10 flex items-center justify-center text-neon-magenta mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-orbitron font-bold mb-4 text-white">Software Cyber Gamer</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                ¿Tienes un local? Utiliza nuestro software de gestión especializado para cybers y zonas gamer.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Control de tiempo y sesiones</li>
                                <li>• Interfaz personalizada Warpzone</li>
                                <li>• Bloqueo y desbloqueo remoto</li>
                            </ul>
                        </div>
                        <div className="flex-1 h-64 glass rounded-lg flex items-center justify-center bg-gradient-to-br from-neon-magenta/5 to-transparent">
                            <span className="font-orbitron text-neon-magenta/30 text-4xl font-bold">SOFTWARE</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
