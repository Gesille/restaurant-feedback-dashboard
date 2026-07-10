"use client";
import { motion } from "motion/react";

export default function BackgroundBlobs({
    variant = "default",
    animate = false,
    fixed = false,
}: {
    variant?: "default" | "muted" | "warm" | "dossier";
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
        // Low-saturation ink/rust/brass wash — sits quietly behind a paper/dossier layout
        // instead of competing with it. Kept subtle on purpose: this variant is meant to
        // read as depth, not decoration.
        dossier: [
            { cls: "top-[-6rem] left-[6%] size-80 bg-[#B23A2E] opacity-[0.08]", move: { x: [0, 25, 0], y: [0, 15, 0] }, duration: 18 },
            { cls: "top-40 right-[2%] size-96 bg-[#A6822C] opacity-[0.10]", move: { x: [0, -20, 0], y: [0, 20, 0] }, duration: 20 },
            { cls: "top-[28rem] left-[30%] size-72 bg-[#1B1B18] opacity-[0.05]", move: { x: [0, 15, 0], y: [0, -15, 0] }, duration: 22 },
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