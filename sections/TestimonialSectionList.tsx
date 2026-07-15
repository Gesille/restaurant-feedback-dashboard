"use client";

import { testimonialsData } from "@/data/testimonial";
import { ITestimonial } from "@/types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
import SectionTitle from "@/components/SectionTitle";

const VerifiedBadge = () => (
    <svg className="mt-px shrink-0" width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#C9A227" />
    </svg>
);

// Deterministic "barcode" so it doesn't shift between renders/hydration
function barWidths(seed: string, count = 22) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
    const widths: number[] = [];
    for (let i = 0; i < count; i++) {
        h = (h * 48271) % 2147483647;
        widths.push(1 + (h % 3));
    }
    return widths;
}

function TicketCard({ testimonial, index }: { testimonial: ITestimonial; index: number }) {
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 300, damping: 22 });
    const springY = useSpring(rotateY, { stiffness: 300, damping: 22 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 14);
        rotateX.set(-py * 14);
    };
    const handleLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    const bars = barWidths(testimonial.name);

    return (
        <motion.div
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            whileHover={{ scale: 1.045, y: -8, zIndex: 10 }}
            style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
            className="relative w-[280px] shrink-0 select-none bg-[#FBF9F2] px-5 pb-4 pt-7 shadow-[0_4px_16px_rgba(0,0,0,0.09)]"
        >
            {/* torn top edge */}
            <div
                className="absolute -top-2 left-0 right-0 h-2"
                style={{
                    backgroundImage:
                        "linear-gradient(-45deg, #FBF9F2 50%, transparent 50%), linear-gradient(45deg, #FBF9F2 50%, transparent 50%)",
                    backgroundSize: "12px 12px",
                    backgroundPosition: "bottom",
                    backgroundRepeat: "repeat-x",
                }}
            />

            {/* ink stamp */}
            <div className="absolute right-4 top-5 rotate-[-10deg] rounded-sm border border-[#C9A227]/60 px-1.5 py-0.5 font-mono text-[8px] font-medium uppercase tracking-[0.15em] text-[#C9A227]/80">
                Verified
            </div>

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400">
                Guest check · No. {String(index + 1).padStart(3, "0")}
            </p>

            <div className="my-3 border-t border-dashed border-gray-300" />

            <div className="flex items-center gap-2.5">
                <Image
                    className="size-8 shrink-0 rounded-full ring-1 ring-black/10"
                    src={testimonial.image}
                    alt={testimonial.name}
                    height={32}
                    width={32}
                />
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-medium text-gray-900">{testimonial.name}</p>
                        <VerifiedBadge />
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">{testimonial.handle}</span>
                </div>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                {testimonial.quote}
            </p>

            <div className="my-3 border-t border-dashed border-gray-300" />

        
            <p className="mt-1 text-center font-mono text-[8px] tracking-[0.3em] text-gray-400">
                THANK YOU
            </p>

            {/* torn bottom edge */}
            <div
                className="absolute -bottom-2 left-0 right-0 h-2"
                style={{
                    backgroundImage:
                        "linear-gradient(-135deg, #FBF9F2 50%, transparent 50%), linear-gradient(135deg, #FBF9F2 50%, transparent 50%)",
                    backgroundSize: "12px 12px",
                    backgroundPosition: "top",
                    backgroundRepeat: "repeat-x",
                }}
            />
        </motion.div>
    );
}

function Marquee({ children }: { children: React.ReactNode }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useRef<ReturnType<typeof animate> | null>(null);

    useEffect(() => {
        const node = trackRef.current;
        if (!node) return;
        const distance = node.scrollWidth / 2;
        controls.current = animate(x, [0, -distance], {
            duration: distance / 32,
            ease: "linear",
            repeat: Infinity,
        });
        return () => controls.current?.stop();
    }, [x]);

    return (
        <div
            className="overflow-hidden py-4"
            style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
            onMouseEnter={() => controls.current?.pause()}
            onMouseLeave={() => controls.current?.play()}
        >
            <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6">
                {children}
            </motion.div>
        </div>
    );
}

export default function TestimonialSectionList() {
    const doubled = [...testimonialsData, ...testimonialsData];

    return (
        <div id="testimonials">
            <div className="px-4 md:px-16 lg:px-24 xl:px-32">
               <SectionTitle
            text1="Track Application"
            text2="Don't just take our word for it"
            text3="Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review."
        />
            </div>

            <div className="mt-11">
                <Marquee>
                    {doubled.map((testimonial: ITestimonial, i) => (
                        <TicketCard key={`${testimonial.name}-${i}`} testimonial={testimonial} index={i % testimonialsData.length} />
                    ))}
                </Marquee>
            </div>
        </div>
    );
}
