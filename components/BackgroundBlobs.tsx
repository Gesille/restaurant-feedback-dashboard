"use client";
import { motion } from "motion/react";

export default function BackgroundBlobs({
    variant = "default",
    animate = false,
    fixed = false,
}: {
    variant?: "default" | "muted" | "warm";
    animate?: boolean;
    fixed?: boolean;
}) {
    const palettes = {
        default: [
            { cls: "top-[-4rem] left-[8%] size-72 bg-pink-600", move: { x: [0, 40, 0], y: [0, 20, 0] }, duration: 12 },
            { cls: "top-24 right-[4%] size-72 bg-purple-600", move: { x: [0, -30, 0], y: [0, 30, 0] }, duration: 14 },
            { cls: "top-64 left-[35%] size-64 bg-blue-600 opacity-70", move: { x: [0, 20, 0], y: [0, -20, 0] }, duration: 16 },
            { cls: "top-10 right-[28%] size-56 bg-orange-500 opacity-60", move: { x: [0, -20, 0], y: [0, 15, 0] }, duration: 13 },
        ],
        muted: [
            { cls: "top-0 left-[10%] size-64 bg-purple-700 opacity-40", move: { x: [0, 20, 0], y: [0, 20, 0] }, duration: 12 },
            { cls: "top-40 right-[10%] size-64 bg-blue-700 opacity-40", move: { x: [0, -20, 0], y: [0, -20, 0] }, duration: 14 },
        ],
        warm: [
            { cls: "top-0 left-[15%] size-72 bg-orange-500 opacity-60", move: { x: [0, 20, 0], y: [0, 20, 0] }, duration: 12 },
            { cls: "top-32 right-[15%] size-72 bg-pink-600 opacity-50", move: { x: [0, -20, 0], y: [0, -20, 0] }, duration: 14 },
        ],
    };

    return (
        <div
            className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden`}
        >
            {palettes[variant].map((blob, i) =>
                animate ? (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full blur-[280px] ${blob.cls}`}
                        animate={blob.move}
                        transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                ) : (
                    <div key={i} className={`absolute rounded-full blur-[280px] ${blob.cls}`} />
                )
            )}
        </div>
    );
}