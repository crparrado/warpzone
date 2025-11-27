import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a",
                foreground: "#ededed",
                neon: {
                    cyan: "#00f3ff",
                    magenta: "#ff00ff",
                    purple: "#bc13fe",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                orbitron: ["var(--font-orbitron)"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "cyber-grid": "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                glow: {
                    "0%": { boxShadow: "0 0 5px #00f3ff, 0 0 10px #00f3ff" },
                    "100%": { boxShadow: "0 0 20px #ff00ff, 0 0 30px #ff00ff" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
