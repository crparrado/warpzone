import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
    title: "Warpzone | Tu Portal Gamer",
    description: "La mejor tienda de videojuegos y tecnología de Chile.",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
                <div className="fixed inset-0 z-[-1] bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
