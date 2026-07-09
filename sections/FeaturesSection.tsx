'use client'

import Image from "next/image";
import { motion } from "motion/react";

import { IFeature } from "@/types";
import SectionTitle from "@/components/SectionTitle";
import BadgeCard from "@/components/BadgeCard";
import { featuresData } from "@/data/features";

export default function FeaturesSection() {
    return (
        <div id="features" className="relative  px-4 py-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle
                text1="Feature roster"
                text2="Run HR without the busywork"
                text3="Onboarding, payroll, time off, and reviews — handled from one dashboard, not six spreadsheets."
            />

            <div className="mt-24 flex flex-wrap items-start justify-center gap-x-6 gap-y-14 px-6">
                {featuresData.map((feature: IFeature, index: number) => (
                    <div key={feature.code} className={index % 2 === 1 ? "md:translate-y-5" : ""}>
                        <BadgeCard feature={feature} index={index} />
                    </div>
                ))}
            </div>

         <div className="relative mx-auto mt-32 max-w-5xl">
    <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            See it in action
        </span>
        <motion.p
            className="mt-4 text-left text-lg text-[#8891A4]"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            Every hire, paycheck, and review lands in the{" "}
            <span className="text-white">same place</span> — so your team
            spends less time updating spreadsheets and more time with people.
        </motion.p>
    </div>

    <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Hero shot with overlapping caption card */}
        <motion.div
            className="relative lg:col-span-3"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
            <div className="overflow-hidden rounded-xl border border-white/10">
                <Image
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                    src="/features-showcase-1.png"
                    alt="HR dashboard showcase"
                    width={1000}
                    height={650}
                />
            </div>

            <div className="absolute -bottom-6 left-6 right-6 rounded-lg border border-white/10 bg-[#0B0E14]/90 p-4 backdrop-blur-md sm:left-8 sm:right-auto sm:max-w-xs">
                <p className="text-sm font-semibold text-white">One dashboard, every department</p>
                <p className="mt-1 text-xs text-[#8891A4]">
                    Onboarding, payroll, and time off stay in sync without anyone re-entering data.
                </p>
            </div>
        </motion.div>

        {/* Secondary proof panel */}
        <motion.div
            className="lg:col-span-2"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <div className="overflow-hidden rounded-xl border border-white/10">
                <Image
                    src="/features-showcase-2.jpg"
                    alt="HR reports showcase"
                    width={1000}
                    height={650}
                    className="w-full object-cover transition duration-300 hover:-translate-y-1"
                />
            </div>

            <h3 className="mt-8 text-xl font-semibold text-white">Reports that get read</h3>
            <p className="mt-3 text-sm text-[#8891A4]">
                Headcount, turnover, and time-off trends, laid out clearly enough to bring to a Monday standup.
            </p>

            <ul className="mt-5 space-y-2.5">
                {[
                    "Exports straight to PDF or CSV",
                    "Refreshes automatically each pay cycle",
                    "Filters by department, location, or role",
                ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#8891A4]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-[#C9A227]" />
                        {item}
                    </li>
                ))}
            </ul>

            <a
                href="#"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#C9A227] transition hover:text-[#E0BB4A]"
            >
                See a sample report
                <span className="transition group-hover:translate-x-1">→</span>
            </a>
        </motion.div>
    </div>
</div>
        </div>
    );
}