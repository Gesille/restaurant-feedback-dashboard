"use client";
import { useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import {
    ArrowRightIcon,
    MailIcon,
    UserIcon,
    PhoneIcon,
    CheckIcon,
    Loader2Icon,
} from "lucide-react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";


// Replace these with your real numbers/handles
const CHANNELS = [
    {
        icon: PhoneIcon,
        label: "Call us",
        value: "+1 268 555 0142",
        sub: "Mon–Fri, 9am–5pm AST",
        href: "tel:+12685550142",
        iconBg: "bg-blue-500/15",
        iconBorder: "border-blue-500/20",
        iconColor: "text-blue-400",
        hoverShadow: "hover:shadow-[0_0_40px_-15px] hover:shadow-blue-500/30",
    },
    {
        icon: MailIcon,
        label: "Email",
        value: "hr@yourcompany.com",
        sub: "For applications and documents",
        href: "mailto:hr@yourcompany.com",
        iconBg: "bg-pink-500/15",
        iconBorder: "border-pink-500/20",
        iconColor: "text-pink-400",
        hoverShadow: "hover:shadow-[0_0_40px_-15px] hover:shadow-pink-500/30",
    },
];

function ChannelCard({ channel, index }: { channel: (typeof CHANNELS)[number]; index: number }) {
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const sx = useSpring(rotateX, { stiffness: 300, damping: 24 });
    const sy = useSpring(rotateY, { stiffness: 300, damping: 24 });
    const Icon = channel.icon;

    const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotateY.set(px * 8);
        rotateX.set(-py * 8);
    };
    const onLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.a
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX: sx, rotateY: sy, transformPerspective: 700 }}
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 26, delay: index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className={`group relative flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm transition-shadow duration-300 hover:border-slate-700 ${channel.hoverShadow}`}
        >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${channel.iconBg} ${channel.iconBorder}`}>
                <Icon className={`size-5 ${channel.iconColor}`} />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{channel.label}</p>
                <p className="truncate font-medium text-slate-100">{channel.value}</p>
                <p className="text-xs text-slate-500">{channel.sub}</p>
            </div>
            <ArrowRightIcon className="ml-auto size-4 shrink-0 text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-300" />
        </motion.a>
    );
}

export default function ContactSection() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        // TODO: wire this to your actual submit endpoint
        setTimeout(() => setStatus("sent"), 1100);
    };

    return (
        <div className="relative px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle
                text1="Contact"
                text2="Reach out to us"
                text3="Ready to grow your brand? Let's connect and build something exceptional together."
            />

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-5">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <p className="text-sm font-medium text-slate-400">Prefer to talk directly?</p>
                    {CHANNELS.map((c, i) => (
                        <ChannelCard key={c.label} channel={c} index={i} />
                    ))}
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 220, damping: 28 }}
                    className="relative grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm sm:grid-cols-2 lg:col-span-3"
                >
                    <div>
                        <p className="mb-2 font-medium text-slate-300">Your name</p>
                        <div className="flex items-center rounded-lg border border-slate-700 pl-3 transition-colors focus-within:border-pink-500">
                            <UserIcon className="size-5 text-slate-500" />
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Enter your name"
                                className="w-full bg-transparent p-3 text-slate-200 outline-none placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 font-medium text-slate-300">Email id</p>
                        <div className="flex items-center rounded-lg border border-slate-700 pl-3 transition-colors focus-within:border-pink-500">
                            <MailIcon className="size-5 text-slate-500" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full bg-transparent p-3 text-slate-200 outline-none placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="mb-2 font-medium text-slate-300">Message</p>
                        <textarea
                            name="message"
                            rows={6}
                            required
                            placeholder="Enter your message"
                            className="w-full resize-none rounded-lg border border-slate-700 bg-transparent p-3 text-slate-200 outline-none placeholder:text-slate-600 focus:border-pink-500"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={status !== "idle"}
                        whileTap={{ scale: 0.97 }}
                        className="flex w-max items-center gap-2 rounded-full bg-pink-600 px-10 py-3 text-white transition-colors hover:bg-pink-700 disabled:opacity-80 sm:col-span-2"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {status === "idle" && (
                                <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Submit
                                    <ArrowRightIcon className="size-5" />
                                </motion.span>
                            )}
                            {status === "sending" && (
                                <motion.span key="sending" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Sending
                                    <Loader2Icon className="size-5 animate-spin" />
                                </motion.span>
                            )}
                            {status === "sent" && (
                                <motion.span key="sent" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                    Sent
                                    <CheckIcon className="size-5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}