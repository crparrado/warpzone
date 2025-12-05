import { Ticket, Clock, Zap } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import BuyButton from "@/components/BuyButton";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getData() {
  try {
    const [products, settings] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        orderBy: { price: 'asc' }
      }),
      prisma.systemSettings.findFirst()
    ]);
    return { products, discount: settings?.generalDiscount || 0 };
  } catch (error) {
    return { products: [], discount: 0 };
  }
}

export default async function FichasYPases() {
  const { products, discount } = await getData();

  // Helper to get icon based on type/name (since we can't store functions in DB)
  const getIcon = (name: string, type: string) => {
    if (name.includes("Day")) return Ticket;
    if (name.includes("Night")) return Zap;
    return Clock;
  };

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
          {discount > 0 && (
            <div className="mt-4 inline-block bg-neon-magenta text-black font-bold px-4 py-2 rounded-full animate-pulse">
              ¡{discount}% DE DESCUENTO EN TODO! 🔥
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => {
            const Icon = getIcon(product.name, product.type);
            const discountedPrice = Math.round(product.price * (1 - discount / 100));

            return (
              <div key={product.id} className={`group glass p-8 relative overflow-hidden hover:border-neon-cyan transition-all duration-300 flex flex-col ${product.popular ? 'border-neon-cyan/50 bg-neon-cyan/5' : ''}`}>
                {product.popular && (
                  <div className="absolute top-0 right-0 bg-neon-cyan text-black text-xs font-bold px-3 py-1 font-orbitron">
                    POPULAR
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-0 left-0 bg-neon-magenta text-black text-xs font-bold px-3 py-1 font-orbitron">
                    -{discount}%
                  </div>
                )}

                <div className="mb-6">
                  <Icon className={`w-12 h-12 ${product.type === 'Pase' ? 'text-neon-magenta' : 'text-neon-cyan'} mb-4`} />
                  <h3 className="text-2xl font-bold font-orbitron text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                </div>

                <div className="mt-auto">
                  {discount > 0 ? (
                    <div className="mb-6">
                      <div className="text-gray-500 line-through text-lg">${product.price.toLocaleString('es-CL')}</div>
                      <div className="text-3xl font-bold text-neon-magenta">${discountedPrice.toLocaleString('es-CL')}</div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white mb-6">${product.price.toLocaleString('es-CL')}</div>
                  )}
                  <BuyButton product={{ ...product, price: discount > 0 ? discountedPrice : product.price }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
