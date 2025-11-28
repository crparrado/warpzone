"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DynamicHeroText() {
    const words = ["JUEGA", "TRABAJA", "EDITA", "DISEÑA", "SIMULA"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="inline-block relative min-w-[300px] text-left">
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                    animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        textShadow: [
                            "0 0 0px #fff",
                            "0 0 10px #00f3ff",
                            "0 0 20px #00f3ff",
                            "0 0 40px #00f3ff",
                            "0 0 80px #00f3ff"
                        ]
                    }}
                    exit={{
                        opacity: 0,
                        filter: "blur(20px)",
                        scale: 0.9,
                        position: "absolute"
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                    }}
                    className="block text-white"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>

            {/* Electric Glitch Overlay Effect */}
            <motion.span
                key={`glitch-${words[index]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0] }}
                transition={{ duration: 0.2, times: [0, 0.2, 0.4, 0.6, 1] }}
                className="absolute top-0 left-0 text-neon-cyan mix-blend-screen pointer-events-none"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)", transform: "translate(-2px, 2px)" }}
            >
                {words[index]}
            </motion.span>
        </div>
    );
}
