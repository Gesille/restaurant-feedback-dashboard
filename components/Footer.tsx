'use client'

import { footerData } from "@/data/footer";
import { FaDribbble, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { IFooterLink } from "@/types";

export default function Footer() {
    return (
        <footer className="relative mt-32 px-4 pb-6 md:px-16 lg:px-24 xl:px-32">
            <motion.div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-xl"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 70, mass: 1 }}
            >
                {/* CTA strip */}
                <div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 px-6 py-10 text-center md:flex-row md:px-12 md:text-left">
                    <div>
                        <h3 className="text-2xl font-semibold text-white">Ready to simplify HR?</h3>
                        <p className="mt-2 text-sm text-[#8891A4]">
                            Onboarding, payroll, and time off, live in one place by next payroll cycle.
                        </p>
                    </div>
                    <Link
                        href="/demo"
                        className="group inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#C9A227] px-6 py-3 text-sm font-semibold text-[#0B0E14] transition hover:bg-[#E0BB4A]"
                    >
                        Book a demo
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Links */}
                <div className="flex flex-wrap items-start justify-between gap-14 px-6 py-12 text-[13px] text-[#8891A4] md:gap-10 md:px-12">
                    <div className="max-w-xs">
                        <Link href="/">
                            <Image src="/logo/NextID-Logo-CMYK.png" alt="NextID logo" width={40} height={40} className="h-10 w-auto" priority />
                        </Link>
                        <p className="mt-5 max-w-[220px] text-[#8891A4]">
                            One dashboard for onboarding, payroll, and time off — built for teams, not spreadsheets.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <a href="https://dribbble.com/prebuiltui" target="_blank" rel="noreferrer">
                                <FaDribbble className="size-4 text-[#8891A4] transition hover:text-white" />
                            </a>
                            <a href="https://www.linkedin.com/company/prebuiltui" target="_blank" rel="noreferrer">
                                <FaLinkedin className="size-4 text-[#8891A4] transition hover:text-white" />
                            </a>
                            <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer">
                                <FaXTwitter className="size-4 text-[#8891A4] transition hover:text-white" />
                            </a>
                            <a href="https://www.youtube.com/@prebuiltui" target="_blank" rel="noreferrer">
                                <FaYoutube className="size-4 text-[#8891A4] transition hover:text-white" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-16 gap-y-10">
                        {footerData.map((section, index) => (
                            <div key={index}>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-100">{section.title}</p>
                                <ul className="mt-4 space-y-3">
                                    {section.links.map((link: IFooterLink, index: number) => (
                                        <li key={index}>
                                            <Link href={link.href} className="transition hover:text-white">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="relative flex flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-center text-[13px] text-[#8891A4] sm:flex-row sm:text-left md:px-12">
                    <p>&copy; {new Date().getFullYear()}  NEXT International Ltd. All rights reserved.</p>
                    
                </div>
            </motion.div>
        </footer>
    );
}