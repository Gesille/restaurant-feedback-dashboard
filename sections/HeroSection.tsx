"use client";
import {
  Briefcase,
  CheckIcon,
  ChevronRightIcon,
  UploadCloudIcon,
  FileTextIcon,
  SparklesIcon,
  UsersIcon,
  TrendingUpIcon,
  StarIcon,
  BuildingIcon,
  ClockIcon,
  TargetIcon,
} from "lucide-react";

import { motion } from "motion/react";

export default function HeroSection() {
  const specialFeatures = [
    "Simple application process",
    "Quick response from our team",
    "Exciting career opportunities",
  ];

  const matchedTags = ["React", "Remote", "5+ yrs"];

  const particles = [
    { left: "8%", size: 3, duration: 9, delay: 0 },
    { left: "18%", size: 2, duration: 12, delay: 1.5 },
    { left: "30%", size: 4, duration: 10, delay: 0.5 },
    { left: "45%", size: 2, duration: 14, delay: 3 },
    { left: "62%", size: 3, duration: 11, delay: 2 },
    { left: "74%", size: 2, duration: 13, delay: 0.8 },
    { left: "85%", size: 4, duration: 9.5, delay: 2.6 },
    { left: "93%", size: 2, duration: 12.5, delay: 1.2 },
  ];

  const scrollToUpload = () => {
    document
      .getElementById("cv-upload")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      {/* Light dot-grid texture + rising particles only — global BackgroundBlobs (in layout) handles color */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(244,114,182,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 rounded-full bg-pink-300/40"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{ y: ["0%", "-120%"], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative w-full flex flex-col items-center">

        {/* ---- Top scattered cards — pushed below the navbar ---- */}

        <motion.div
          className="hidden lg:block absolute z-10"
          style={{ top: "17%", left: "2%", rotate: "-6deg" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="flex flex-col gap-1 w-36 rounded-2xl border border-pink-300/20 bg-white/70 backdrop-blur-sm p-3.5 shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingUpIcon size={15} className="text-pink-500" />
            <span className="text-lg font-medium text-slate-800">24</span>
            <span className="text-[11px] text-slate-500">new roles today</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden lg:block absolute z-10"
          style={{ top: "22%", right: "2%", rotate: "5deg" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="flex flex-col gap-1 w-36 rounded-2xl border border-pink-300/20 bg-white/70 backdrop-blur-sm p-3.5 shadow-lg"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <UsersIcon size={15} className="text-purple-500" />
            <span className="text-lg font-medium text-slate-800">500+</span>
            <span className="text-[11px] text-slate-500">hires this month</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden lg:block absolute z-10"
          style={{ top: "46%", left: "-1%", rotate: "-4deg" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-2xl border border-pink-300/20 bg-white/70 backdrop-blur-sm px-3.5 py-2.5 shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <StarIcon size={15} className="text-amber-500 fill-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none text-slate-800">4.9</span>
              <span className="text-[10px] text-slate-500">candidate rating</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden lg:block absolute z-10"
          style={{ top: "54%", right: "-1%", rotate: "6deg" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-2xl border border-pink-300/20 bg-white/70 backdrop-blur-sm px-3.5 py-2.5 shadow-lg"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            <BuildingIcon size={15} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none text-slate-800">200+</span>
              <span className="text-[10px] text-slate-500">companies hiring</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ---- Main hero content ---- */}

        <motion.a
          href="/careers"
          className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-24 sm:mt-32 md:mt-44 text-pink-50 bg-pink-200/15 border border-pink-300/10"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <span className="bg-gradient-to-r from-pink-600 to-orange-500 text-white text-xs px-3.5 py-1 rounded-full">
            HIRING NOW
          </span>
          <p className="flex items-center gap-1 text-sm text-amber-500">
            <span>50+ open roles across 12 teams</span>
            <ChevronRightIcon size={16} className="group-hover:translate-x-0.5 transition duration-300" />
          </p>
        </motion.a>

        <motion.h1
          className="text-4xl leading-[1.15] sm:text-5xl md:text-6xl font-medium max-w-3xl text-center mt-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
        >
          Your next hire is one{" "}
          <span className="move-gradient px-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-nowrap">
            CV away.
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-center max-w-2xl mt-6 px-2"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          We connect ambitious talent with teams that are actually hiring. Upload
          your CV once, and our team — plus every employer on the platform — can
          find you for roles that match your skills, experience, and career goals.
          No spam, no recruiters cold-calling you about jobs you&apos;d never
          take. Just relevant opportunities, reviewed by real humans.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 w-full sm:w-auto px-4 sm:px-0"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <a href="/CvUploadSection">
            <button
              onClick={scrollToUpload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 active:scale-95 transition-all text-white rounded-full px-7 h-11 shadow-lg shadow-pink-600/30"
            >
              <UploadCloudIcon size={18} />
              Upload your CV
            </button>
          </a>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-pink-900 hover:bg-pink-950/50 active:scale-95 transition rounded-full px-6 h-11">
            <Briefcase size={18} strokeWidth={1.5} />
            <span>View Open Positions</span>
          </button>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-10 md:gap-x-14 mt-10 md:mt-12 px-4">
          {specialFeatures.map((feature, index) => (
            <motion.p
              className="flex items-center gap-2"
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
            >
              <CheckIcon className="size-5 text-pink-500 shrink-0" />
              <span className="text-slate-400 text-sm sm:text-base whitespace-nowrap">
                {feature}
              </span>
            </motion.p>
          ))}
        </div>

        {/* ---- Bottom cluster ---- */}
        <div className="relative w-full flex justify-center mt-1 mb-0" style={{ minHeight: "200px" }}>

          <motion.div
            className="hidden lg:block absolute z-10"
            style={{ top: "10%", left: "18%", rotate: "-7deg" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="flex items-center gap-2 rounded-2xl border border-pink-300/100 bg-white/70 backdrop-blur-sm px-3.5 py-2.5 shadow-lg"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <ClockIcon size={15} className="text-teal-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none text-slate-800">24h</span>
                <span className="text-[10px] text-slate-500">avg response time</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden lg:block absolute z-10"
            style={{ top: "55%", right: "16%", rotate: "8deg" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="flex items-center gap-2 rounded-2xl border border-pink-300/100 bg-white/70 backdrop-blur-sm px-3.5 py-2.5 shadow-lg"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            >
              <TargetIcon size={15} className="text-green-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none text-slate-800">98%</span>
                <span className="text-[10px] text-slate-500">match rate</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative w-56 h-32 rounded-2xl border border-pink-300/100 backdrop-blur-sm p-4 shadow-xl"
            style={{ rotate: "-2deg" }}
            initial={{ y: 10, opacity: 0, rotate: -2 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileTextIcon size={16} className="text-pink-500" />
              <span className="text-xs text-slate-600">your_cv.pdf</span>
            </div>

            <div className="space-y-1.5">
              {[1, 0.8, 0.9, 0.6].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-slate-300" style={{ width: `${w * 100}%` }} />
              ))}
            </div>

            <motion.div
              className="absolute left-0 right-0 h-8 bg-gradient-to-b from-pink-400/0 via-pink-400/20 to-pink-400/0"
              initial={{ top: 0 }}
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute -top-3 -right-3 flex items-center gap-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[11px] px-2.5 py-1 rounded-full shadow-lg"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.1, 1], rotate: [0, -10, 0] }}
              transition={{ delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
            >
              <SparklesIcon size={12} />
              Matched
            </motion.div>

            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2">
              {matchedTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [0, -16, -16, -24] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 + i * 0.3, repeatDelay: 1.7 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}