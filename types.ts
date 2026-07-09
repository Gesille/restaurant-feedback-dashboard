/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { BrandColor } from "./lib/colors";

export interface SectionTitleProps {
    text1: string;
    text2: string;
    text3: string;
}

export interface TestimonialCardProps {
    testimonial: ITestimonial;
    index: number;
}

export interface ITestimonial {
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
}



export interface IFeature {
  icon: ReactNode;
  title: string;
  description: string;
  code: string;
  detail: string;
}

export interface IFooter {
    title: string;
    links: IFooterLink[];
}

export interface IFooterLink {
    name: string;
    href: string;
}

export interface NavbarProps {
    navlinks: INavLink[];
}

export interface INavLink {
    name: string;
    href: string;
}

export interface PricingCardProps {
    pricing: IPricing;
    index: number;
}

export interface IPricing {
    name: string;
    price: number;
    period: string;
    features: string[];
    mostPopular: boolean;
}

export interface SectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}

export type TableQR = {
  tableNumber: number;
  scans: number;
  lastScan: string;
};


export type ActivityEvent = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  color: BrandColor;
  type: "scan" | "menu_view" | "feedback";
  detail: string;
  time: string;
};

export interface IRestaurant {
  scansTrend: any;
  avgRating: ReactNode;
  totalScans: any;
  id: string | number;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  website: string;
  qrValue?: string;
  status: "active" | "paused";
  color: BrandColor;
  tables: number;
  menuViews: number;
  scansToday: number;
}

export type ScanPoint = {
  date: string;
  scans: number;
};

