'use client'
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <motion.div className="relative max-w-5xl py-16 mt-40 md:pl-20 md:w-full max-md:mx-4 md:mx-auto flex flex-col md:flex-row max-md:gap-6 items-center justify-between text-left overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-900 p-6 text-white"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            {/* ambient glow accents, matching the site's blob palette */}
            <div className="pointer-events-none absolute -top-24 -left-10 size-64 rounded-full bg-pink-600 opacity-30 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 size-64 rounded-full bg-purple-600 opacity-30 blur-[120px]" />

            <div className="relative">
                <motion.h1 className="text-4xl md:text-[46px] md:leading-15 font-semibold bg-linear-to-r from-white to-pink-300 text-transparent bg-clip-text"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Ready to try-out this app?
                </motion.h1>
                <motion.p className="text-pink-100/80 text-lg"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                >
                    Your next favourite tool is just one click away.
                </motion.p>
            </div>
            <motion.button className="relative px-12 py-3 text-slate-900 bg-white hover:bg-pink-50 rounded-full text-sm mt-4 font-medium transition-colors"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                Get Started
            </motion.button>
        </motion.div>
    );
}