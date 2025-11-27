import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full fixed top-0 z-50 glass px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 border-b border-white/10">
            <Link href="/" className="text-2xl font-orbitron font-bold text-neon-cyan tracking-wider hover:text-neon-magenta transition-colors">
                WARPZONE
            </Link>

            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 font-orbitron">
                <Link href="/" className="hover:text-neon-cyan transition-colors">INICIO</Link>
                <Link href="/reservas" className="hover:text-neon-cyan transition-colors text-neon-magenta">RESERVAS</Link>
                <Link href="/fichas-y-pases" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">FICHAS Y PASES</Link>
                <Link href="/servicios" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">SERVICIOS</Link>
                <Link href="/contacto" className="text-sm font-bold hover:text-neon-cyan transition-colors tracking-widest">CONTACTO</Link>
                <Link href="/dashboard" className="text-sm font-bold text-neon-magenta hover:text-white transition-colors tracking-widest border border-neon-magenta/50 px-3 py-1 rounded hover:bg-neon-magenta/10">MI CUENTA</Link>
            </div>

            <div className="flex gap-4">
                <Link href="/reservas" className="hidden md:block px-6 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-orbitron text-sm hover:bg-neon-cyan hover:text-black transition-all duration-300 clip-path-slant">
                    COMPRAR FICHAS
                </Link>
            </div>
        </nav>
    );
}
