"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, animate } from "motion/react";
import {
  StarIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  UtensilsCrossedIcon,
  BuildingIcon,
  SparklesIcon,
  MessageSquareIcon,
} from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import { restaurantsData, companyLogos } from "@/data/restaurants";

const statIcons = [
  UtensilsCrossedIcon,
  BuildingIcon,
  SparklesIcon,
  MessageSquareIcon,
];

function CountUpStat({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numericMatch = value.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const suffix = value.replace(/[\d.]+/, "");
  const isDecimal = value.includes(".");

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, numericValue, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = isDecimal
            ? v.toFixed(1)
            : Math.round(v).toString();
        }
      },
    });
    return () => controls.stop();
  }, [isInView, numericValue, isDecimal]);

  return (
    <div className="group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-fuchsia-100 bg-white/70 backdrop-blur-sm py-6 shadow-sm hover:shadow-lg hover:shadow-fuchsia-100 hover:-translate-y-1 hover:border-fuchsia-200 transition-all duration-300">
      <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-pink-50 to-purple-50 mb-1 group-hover:scale-110 transition-transform duration-300">
        <Icon size={15} className="text-fuchsia-500" />
      </div>
      <span className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tabular-nums">
        <span ref={ref}>0</span>
        {suffix}
      </span>
      <span className="text-xs sm:text-sm text-slate-500">{label}</span>
    </div>
  );
}

export default function RestaurantsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stats = [
    { label: "Restaurants", value: "12+" },
    { label: "Cities", value: "6" },
    { label: "Avg. rating", value: "4.8" },
    { label: "Reviews collected", value: "18k+" },
  ];

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 320;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });

    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return restaurantsData.length - 1;
      if (next >= restaurantsData.length) return 0;
      return next;
    });
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      scrollByCard(1);
    }, 3500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, activeIndex]);

  return (
    <div id="restaurants" className="px-4 md:px-16 lg:px-24 xl:px-32 py-24">
      <SectionTitle
        text1="Our Restaurants"
        text2="One group, many kitchens"
        text3="Every location under Big Banana Group, reviewed by real guests and tracked in one place."
      />

      {/* ---- Stats bar ---- */}
      <motion.div
        className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 60 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 60,
            }}
          >
            <CountUpStat
              value={stat.value}
              label={stat.label}
              icon={statIcons[i]}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ---- Logo marquee ---- */}
      <div className="mt-20">
        <p className="text-center text-xs font-medium tracking-wider text-slate-400 uppercase mb-6">
          Brands under our group
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <motion.div
            className="flex items-center gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...companyLogos, ...companyLogos].map((logo, i) => (
              <div
                key={i}
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo}
                  alt="restaurant brand logo"
                  width={110}
                  height={40}
                  className="h-8 w-auto object-contain grayscale"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ---- Restaurant carousel ---- */}
      <div
        className="relative mt-20 max-w-6xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
              Featured locations
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Swipe or use the arrows to explore
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous restaurant"
              className="size-9 flex items-center justify-center rounded-full border border-fuchsia-200 bg-white hover:bg-fuchsia-50 hover:border-fuchsia-300 transition active:scale-90"
            >
              <ChevronLeftIcon size={18} className="text-fuchsia-600" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next restaurant"
              className="size-9 flex items-center justify-center rounded-full border border-fuchsia-200 bg-white hover:bg-fuchsia-50 hover:border-fuchsia-300 transition active:scale-90"
            >
              <ChevronRightIcon size={18} className="text-fuchsia-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {restaurantsData.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              className="group snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-fuchsia-100 bg-white shadow-sm hover:shadow-xl hover:shadow-fuchsia-100/60 hover:-translate-y-1.5 hover:border-fuchsia-200 transition-all duration-300"
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 60,
              }}
            >
              <div className="relative h-40 w-full bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 overflow-hidden flex items-center justify-center p-6">
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-contain drop-shadow-sm"
                  />
                </motion.div>

                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-black/5">
                  <StarIcon
                    size={12}
                    className="text-amber-500 fill-amber-500"
                  />
                  {restaurant.rating}
                </div>
              </div>

              <div className="p-5">
                <h4 className="text-base font-semibold text-slate-800 leading-snug">
                  {restaurant.name}
                </h4>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                  <MapPinIcon size={14} className="shrink-0 text-fuchsia-400" />
                  <span className="truncate">{restaurant.location}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    {restaurant.reviews.toLocaleString()} reviews
                  </span>
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-1 text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 transition"
                  >
                    View
                    <ArrowUpRightIcon
                      size={14}
                      className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {restaurantsData.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to restaurant ${i + 1}`}
              className="p-1.5 -m-1.5"
              onClick={() => {
                const el = scrollerRef.current;
                if (!el) return;
                const card = el.children[i] as HTMLElement;
                el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
                setActiveIndex(i);
              }}
            >
              <motion.div
                className="h-1.5 rounded-full bg-fuchsia-200"
                animate={{
                  width: i === activeIndex ? 24 : 6,
                  backgroundColor: i === activeIndex ? "#c026d3" : "#fbcfe8",
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
