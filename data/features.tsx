import { UserPlus, Wallet, Clock, CalendarCheck, TrendingUp, Users } from "lucide-react";
import { IFeature } from "@/types";

const iconClass = "size-5 text-[#C9A227]";

export const featuresData: IFeature[] = [
    { icon: <UserPlus className={iconClass} />, code: "ONB", title: "Onboarding",
        description: "New hires get a checklist, a start date, and everything signed before day one.",
        detail: "Avg. time to first login: 4 min" },
    { icon: <Wallet className={iconClass} />, code: "PAY", title: "Payroll",
        description: "Taxes calculated, deposits sent, payslips ready — every cycle, on time.",
        detail: "Runs automatically, every cycle" },
    { icon: <Clock className={iconClass} />, code: "TIME", title: "Time & Attendance",
        description: "Clock-ins, shifts, and overtime tracked automatically, with a live view of who's on the clock.",
        detail: "Live clock-in view, always current" },
    { icon: <CalendarCheck className={iconClass} />, code: "LEAVE", title: "Leave",
        description: "Employees request time off in seconds. Managers approve it in one tap.",
        detail: "Approvals average under 1 hour" },
    { icon: <TrendingUp className={iconClass} />, code: "PERF", title: "Performance",
        description: "Set goals, collect feedback, and run review cycles that end in a real conversation.",
        detail: "Cycles that end in a real 1:1" },
    { icon: <Users className={iconClass} />, code: "DIR", title: "Directory",
        description: "Every employee, role, and department, searchable and always current.",
        detail: "Updates the moment something changes" },
];