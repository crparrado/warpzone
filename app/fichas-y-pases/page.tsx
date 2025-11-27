import Link from "next/link";
import { Ticket, Clock, Zap } from "lucide-react";

const products = [
  { 
    id: 1, 
    name: "Ficha 1 Hora", 
    price: "$2.000", 
    type: "Ficha", 
    desc: "Acceso por 1 hora a cualquier PC.",
    icon: Clock
  },
  { 
    id: 2, 
    name: "Ficha 3 Horas", 
    price: "$5.000", 
    type: "Ficha", 
    desc: "Ahorra y juega más tiempo.",
    icon: Clock,
    popular: true
  },
  { 
    id: 3, 
    name: "Ficha 5 Horas", 
    price: "$8.000", 
    type: "Ficha", 
    desc: "Para sesiones intensivas.",
    icon: Clock
  },
  { 
    id: 4, 
    name: "Day Pass", 
    price: "$15.000", 
    type: "Pase", 
    desc: "Acceso ilimitado por un día (10:00 - 22:00).",
    icon: Ticket
  },
  { 
    id: 5, 
    name: "Night Pass (Coruja)", 
    price: "$12.000", 
    type: "Pase", 
    desc: "Acceso nocturno exclusivo (22:00 - 06:00).",
    icon: Zap
  },
];

export default function FichasYPases() {
  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
            FICHAS Y PASES
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Adquiere tiempo de juego y accede a nuestros equipos de alto rendimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className={`group glass p-8 relative overflow-hidden hover:border-neon-cyan transition-all duration-300 flex flex-col ${product.popular ? 'border-neon-cyan/50 bg-neon-cyan/5' : ''}`}>
              {product.popular && (
                <div className="absolute top-0 right-0 bg-neon-cyan text-black text-xs font-bold px-3 py-1 font-orbitron">
                  POPULAR
                </div>
              )}
              
              <div className="mb-6">
                <product.icon className={`w-12 h-12 ${product.type === 'Pase' ? 'text-neon-magenta' : 'text-neon-cyan'} mb-4`} />
                <h3 className="text-2xl font-bold font-orbitron text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm">{product.desc}</p>
              </div>
              
              <div className="mt-auto">
                <div className="text-3xl font-bold text-white mb-6">{product.price}</div>
                <button className={`w-full py-3 font-bold font-orbitron transition-colors ${product.type === 'Pase' ? 'bg-neon-magenta text-black hover:bg-white' : 'bg-neon-cyan text-black hover:bg-white'}`}>
                  COMPRAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
