/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { INavLink } from "@/types";
import { navlinks } from "@/data/navlinks";
import BackgroundBlobs from "@/components/BackgroundBlobs"; 

import Login from "@/components/Auth/Login";

import Verification from "@/components/Auth/Verification";
import Signup from "./Auth/SignUp";
import { useSelector } from "react-redux";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authRoute, setAuthRoute] = useState<"Login" | "Sign-Up" | "Verification">("Login");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen || authOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen, authOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const openAuth = (route: "Login" | "Sign-Up" | "Verification" = "Login") => {
        setAuthRoute(route);
        setAuthOpen(true);
        setIsOpen(false);
    };

    const { user } = useSelector((state: any) => state.auth);

    return (
        <>
            <motion.nav
                className={`fixed top-0 z-50 flex items-center justify-between w-full py-2.5 sm:py-3 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 transition-colors duration-300 ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-md shadow-md border-b border-fuchsia-100"
                        : "bg-gradient-to-b from-white/70 to-transparent backdrop-blur-sm"
                }`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 30, mass: 1 }}
            >
                <Link href="/" className="shrink-0">
                    <Image
                        className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
                        src="/logo/NextID-Logo-CMYK.png"
                        alt="NextID logo"
                        width={220}
                        height={60}
                        priority
                    />
                </Link>

                <div className="hidden md:flex items-center gap-5 lg:gap-8">
                    {navlinks.map((link: INavLink) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm lg:text-[15px] font-semibold text-gray-700 hover:text-fuchsia-600 transition-colors whitespace-nowrap after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-pink-500 after:to-fuchsia-600 after:transition-all hover:after:w-full"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <button
                            onClick={() => openAuth("Login")}
                            className="px-5 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 active:scale-95 transition-all rounded-full shadow-lg shadow-fuchsia-500/30 whitespace-nowrap"
                        >
                            Get Started
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="md:hidden p-1.5 -mr-1.5"
                >
                    <MenuIcon size={24} className="text-fuchsia-700 active:scale-90 transition" />
                </button>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 32 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-0 h-full w-[85%] xs:w-4/5 max-w-sm bg-gradient-to-b from-white to-fuchsia-50 flex flex-col items-start justify-start gap-1 p-6 sm:p-8 pt-20 sm:pt-24 shadow-xl overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close menu"
                                className="absolute top-4 right-4 sm:top-5 sm:right-5 aspect-square size-9 sm:size-10 flex items-center justify-center bg-gradient-to-r from-pink-500 to-fuchsia-600 transition text-white rounded-md active:ring-3 active:ring-fuchsia-200"
                            >
                                <XIcon size={18} />
                            </button>

                            {user && (
                                <div className="w-full mb-2">
                                    <UserMenu user={user} />
                                </div>
                            )}

                            {navlinks.map((link: INavLink) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 text-base sm:text-lg font-semibold text-gray-800 border-b border-fuchsia-100 hover:text-fuchsia-600 transition"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {!user && (
                                <button
                                    onClick={() => openAuth("Login")}
                                    className="mt-4 w-full px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 active:scale-95 transition-all rounded-full font-semibold text-sm sm:text-base"
                                >
                                    Get Started
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

          {/* Auth modal */}
<AnimatePresence>
    {authOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setAuthOpen(false)}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md max-h-[92vh] overflow-hidden rounded-3xl border border-fuchsia-100 shadow-2xl shadow-fuchsia-900/20 bg-gradient-to-b from-white via-fuchsia-50/60 to-white"
            >
                {/* Decorative background */}
                <BackgroundBlobs variant="muted" animate />

                {/* Close button */}
                <button
                    onClick={() => setAuthOpen(false)}
                    aria-label="Close auth modal"
                    className="absolute top-4 right-4 z-20 aspect-square size-9 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:brightness-110 transition text-white active:scale-90 shadow-md shadow-fuchsia-500/30"
                >
                    <XIcon size={16} />
                </button>

                {/* Scrollable content */}
                <div className="relative z-10 max-h-[92vh] overflow-y-auto px-6 sm:px-8 py-8">
                    <div className="mb-6 flex items-center justify-center">
                        <Image
                            src="/logo/NextID-Logo-CMYK.png"
                            alt="NextID logo"
                            width={190}
                            height={90}
                            className="h-15 w-auto"
                        />
                    </div>

                    <div className="rounded-2xl bg-white/90 backdrop-blur-xl p-6 sm:p-7 shadow-lg shadow-fuchsia-500/10 border border-fuchsia-100">
                        {authRoute === "Login" && (
                            <Login
                                setRoute={(r) => setAuthRoute(r as any)}
                                setOpen={setAuthOpen}
                                refetch={() => {}}
                            />
                        )}
                        {authRoute === "Sign-Up" && (
                            <Signup setRoute={(r) => setAuthRoute(r as any)} />
                        )}
                        {authRoute === "Verification" && (
                            <Verification setRoute={(r) => setAuthRoute(r as any)} />
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>
        </>
    );
}