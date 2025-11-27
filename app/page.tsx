import Link from "next/link";
import { ArrowRight, Globe, Users, MonitorPlay, CalendarClock } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">

            {/* Hero Section */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-neon-purple/20 via-transparent to-transparent opacity-50"></div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    <h2 className="text-neon-cyan font-orbitron tracking-[0.5em] text-sm md:text-base mb-4 animate-pulse">
                        CYBER GAMER DEL FUTURO
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-orbitron font-black mb-6 tracking-tighter text-white leading-tight">
                        JUEGA EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">ULTRA</span><br />
                        DESDE CUALQUIER LUGAR
                    </h1>

                    <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
                        Arrienda un PC Gamer de alto rendimiento por horas y juega vía streaming con baja latencia.
                        Tu notebook básico ahora es una bestia.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link href="/reservas" className="group relative px-8 py-4 bg-neon-cyan text-black font-bold font-orbitron tracking-widest overflow-hidden hover:scale-105 transition-transform">
                            <span className="relative z-10 flex items-center gap-2">
                                JUGAR AHORA <MonitorPlay className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>

                        <Link href="/servicios" className="px-8 py-4 border border-white/20 hover:border-neon-magenta hover:text-neon-magenta transition-colors font-orbitron tracking-widest glass">
                            ORGANIZAR EVENTO
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="w-full py-24 bg-black/50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-center mb-16">
                        ¿CÓMO FUNCIONA?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "COMPRA FICHAS",
                                desc: "Adquiere créditos en nuestra web de forma segura.",
                                icon: CalendarClock
                            },
                            {
                                step: "02",
                                title: "RESERVA TU PC",
                                desc: "Elige el horario que más te acomode en nuestra agenda.",
                                icon: Globe
                            },
                            {
                                step: "03",
                                title: "CONÉCTATE",
                                desc: "Recibe el link, conéctate vía Parsec y juega sin lag.",
                                icon: MonitorPlay
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 glass border-l-4 border-neon-cyan hover:bg-white/5 transition-colors">
                                <div className="absolute -top-6 -right-6 text-8xl font-black text-white/5 font-orbitron">
                                    {item.step}
                                </div>
                                <item.icon className="w-12 h-12 text-neon-magenta mb-6" />
                                <h3 className="text-2xl font-orbitron font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="w-full py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-neon-purple/5"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-8">
                            WARPZONE <span className="text-neon-purple">EVENTS</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-6">
                            Llevamos la experiencia gamer a tu colegio, empresa o evento comunitario.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3">
                                <Users className="text-neon-cyan" />
                                <span>Torneos de FC 24, Tekken y más.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MonitorPlay className="text-neon-cyan" />
                                <span>Montaje de 4 PCs Gamer de última generación.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Globe className="text-neon-cyan" />
                                <span>Catálogo de +350 juegos incluidos.</span>
                            </li>
                        </ul>
                        <Link href="/contacto" className="inline-block px-8 py-4 border border-neon-purple text-neon-purple font-orbitron hover:bg-neon-purple hover:text-white transition-all">
                            COTIZAR EVENTO
                        </Link>
                    </div>
                    <div className="relative h-[400px] glass rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                        {/* Placeholder for Event Image */}
                        <div className="text-center">
                            <Users className="w-24 h-24 text-white/20 mx-auto mb-4" />
                            <p className="font-orbitron text-white/40">IMAGEN DE EVENTO</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-transparent"></div>
                    </div>
                </div>
            </section>

        </main>
    );
}
