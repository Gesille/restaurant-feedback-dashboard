'use client'
import { SectionTitleProps } from "@/types";
import { motion } from "motion/react";

export default function SectionTitle({ text1, text2, text3 }: SectionTitleProps) {
    return (
        <>
            <motion.p
                className="mx-auto mt-28 w-max rounded-full border border-[#C9A227]/40 bg-[#131B2E] px-4 py-1.5 text-center font-mono text-[11px] tracking-[0.15em] text-[#C9A227]"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                {text1.toUpperCase()}
            </motion.p>
            <motion.h3
                className="mx-auto mt-4 max-w-xl text-center text-3xl font-semibold tracking-tight text-amber-500"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                {text2}
            </motion.h3>
            <motion.p
                className="mx-auto mt-3 max-w-xl text-center text-[#8891A4]"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                {text3}
            </motion.p>
        </>
    );
}