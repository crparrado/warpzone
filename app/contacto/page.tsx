import { Mail, MapPin, Phone } from "lucide-react";

export default function Contacto() {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

                <div>
                    <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-8 text-white">
                        CONTACTO
                    </h1>
                    <p className="text-xl text-gray-400 mb-12">
                        ¿Tienes dudas? ¿Quieres cotizar? Estamos listos para ayudarte.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan border border-neon-cyan/30">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-orbitron font-bold text-lg">Ubicación</h3>
                                <p className="text-gray-400">Santiago de Chile</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-neon-magenta/10 flex items-center justify-center text-neon-magenta border border-neon-magenta/30">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-orbitron font-bold text-lg">Teléfono</h3>
                                <p className="text-gray-400">+56984647819</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/30">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-orbitron font-bold text-lg">Email</h3>
                                <p className="text-gray-400">contacto@warpzone.cl</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="glass p-8 md:p-12 space-y-6">
                    <div>
                        <label className="block text-sm font-orbitron text-gray-400 mb-2">NOMBRE</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 p-4 focus:border-neon-cyan focus:outline-none transition-colors text-white" placeholder="Tu nombre" />
                    </div>

                    <div>
                        <label className="block text-sm font-orbitron text-gray-400 mb-2">EMAIL</label>
                        <input type="email" className="w-full bg-black/50 border border-white/10 p-4 focus:border-neon-cyan focus:outline-none transition-colors text-white" placeholder="tucorreo@ejemplo.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-orbitron text-gray-400 mb-2">MENSAJE</label>
                        <textarea className="w-full bg-black/50 border border-white/10 p-4 h-32 focus:border-neon-cyan focus:outline-none transition-colors text-white" placeholder="¿En qué podemos ayudarte?"></textarea>
                    </div>

                    <button type="button" className="w-full py-4 bg-neon-cyan text-black font-bold font-orbitron hover:bg-white transition-colors">
                        ENVIAR MENSAJE
                    </button>
                </form>

            </div>
        </div>
    );
}
