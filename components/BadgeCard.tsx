'use client'

import { useRef, useState, useEffect } from "react";
import { motion, useAnimate, useInView } from "motion/react";
import { IFeature } from "@/types";

const FAN_ANGLES = [-6, 3, -3, 5, -4, 2];
const SWAY_DURATIONS = [4.2, 5.1, 3.8, 4.7, 5.4, 4.0]; // different per card so sway isn't synced

export default function BadgeCard({ feature, index }: { feature: IFeature; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [scope, animate] = useAnimate();
    const inView = useInView(scope, { once: true, margin: "-40px" });
    const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
    const [hovered, setHovered] = useState(false);
    const resting = FAN_ANGLES[index % FAN_ANGLES.length];
    const swayDuration = SWAY_DURATIONS[index % SWAY_DURATIONS.length];

    useEffect(() => {
        if (!inView) return;
        let cancelled = false;
        (async () => {
            // drop in
            await animate(scope.current, { y: [-120, 0], opacity: [0, 1] }, { duration: 0.5, delay: index * 0.09, ease: "easeOut" });
            if (cancelled) return;
            // swing and settle, like a badge finding its resting angle on the lanyard
            await animate(scope.current, { rotate: [0, resting * 2.4, resting * -1.3, resting * 0.6, resting] }, { duration: 0.7, ease: "easeOut" });
            if (cancelled) return;
            // gentle idle sway, forever
            animate(scope.current, { rotate: [resting - 1.5, resting + 1.5, resting - 1.5] }, { duration: swayDuration, repeat: Infinity, ease: "easeInOut" });
        })();
        return () => { cancelled = true; };
    }, [inView]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        setTilt({ rx: (0.5 - py) * 18, ry: (px - 0.5) * 18, mx: px * 100, my: py * 100 });
    }

    function handleMouseLeave() {
        setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
        setHovered(false);
    }

    return (
        <div ref={scope} className="relative opacity-0">
            {/* lanyard clip */}
            <div className="absolute -top-3 left-1/2 z-10 h-4 w-8 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-[#78839B]/50 bg-[#131B2E]" />

            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="relative w-64 rounded-2xl bg-[#ECEEF3] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-transform duration-150 ease-out will-change-transform"
                style={{ transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.03 : 1})` }}
            >
                <div className="mx-auto mb-4 h-3 w-3 rounded-full bg-[#131B2E]" />

                {/* foil shine, follows cursor */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-150"
                    style={{ opacity: hovered ? 1 : 0, background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(201,162,39,0.35), transparent 55%)` }}
                />

                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#131B2E]">
                        {feature.icon}
                    </div>
                    <span className="font-mono text-[11px] tracking-wider text-[#78839B]">{feature.code}</span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#131B2E]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5468]">{feature.description}</p>

                <div className="mt-5 border-t border-dashed border-[#78839B]/40 pt-3">
                    <div className="h-1 w-full bg-[repeating-linear-gradient(90deg,#131B2E_0px,#131B2E_2px,transparent_2px,transparent_5px)] opacity-30" />
                </div>

                {/* flip-up detail, like turning the badge over */}
                <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    <p className="mt-3 font-mono text-[11px] text-[#C9A227]">{feature.detail}</p>
                </motion.div>
            </div>
        </div>
    );
}