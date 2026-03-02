"use client";

import {motion} from "framer-motion";

interface DeputyCardProps {
    nom: string;
    parti: string;
    image: string;
    onClick?: () => void;
}

export default function DeputyCard({
                                            nom,
                                            parti,
                                            image,
                                            onClick,
                                        }: DeputyCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{scale: 1.02}}
            className="cursor-pointer relative w-37.5 h-75 bg-transparent p-0 border-0"
            aria-label={`${nom} - ${parti}`}
        >
            {/* CARD BACKGROUND */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: `
                        polygon(
                          12% 0%,
                          88% 0%,
                          100% 8%,
                          100% 90%,
                          85% 100%,
                          15% 100%,
                          0% 90%,
                          0% 8%
                        )
                      `,
                    background: `
                                radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 60%),
                                linear-gradient(180deg, var(--card-grad-start, var(--bg-card)), var(--card-grad-end, var(--bg-elevated)) 70%)
                              `,
                }}
            >
                {/* IMAGE CONTAINER */}
                <div className="translate-y-4 absolute inset-0 flex justify-center p-4">
                    <img
                        src={image}
                        alt={nom}
                        className="max-h-[75%] object-contain select-none pointer-events-none"
                        draggable={false}
                    />
                </div>

                {/* Soft bottom shadow */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"/>
            </div>

            {/* SVG FRAME */}
            <svg
                viewBox="0 0 300 600"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--card-border-1, var(--border-accent-1))"/>
                        <stop offset="50%" stopColor="var(--card-border-2, var(--border-accent-2))"/>
                        <stop offset="100%" stopColor="var(--card-border-3, var(--border-accent-3))"/>
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <polygon
                    points="36,0 264,0 300,48 300,540 255,600 45,600 0,540 0,48"
                    fill="none"
                    stroke="url(#borderGradient)"
                    strokeWidth="3"
                    filter="url(#glow)"
                />
            </svg>

            {/* TOP BAR (PARTI) */}
            <div className="absolute top-2 w-full flex justify-center">
                <div
                    className="px-5 py-2 font-bold tracking-widest text-main border border-main bg-accent"
                    style={{
                        clipPath: "polygon(0 0,100% 0,95% 100%,5% 100%)",
                        background:
                            "linear-gradient(90deg, var(--card-plate-1, var(--bg-accent)), var(--card-plate-2, var(--bg-elevated)), var(--card-plate-3, var(--bg-accent)))",
                    }}
                >
                    {parti}
                </div>
            </div>

            {/* BOTTOM (NOM) */}
            <div className="absolute bottom-10 w-full text-center text-xs tracking-[3px] text-muted">
                {nom}
            </div>
        </motion.button>
    );
}
