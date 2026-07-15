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
 
  menuViews: number;
  scansToday: number;
x_qr_generated?: boolean;
}

export type ScanPoint = {
  date: string;
  scans: number;
};


export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Seasonal' | 'Internship';
export type JobStatus = 'open' | 'closed' | 'draft';



export interface Job {
  id: string;
  restaurant_id: string;
  restaurant_name?: string;
  position: string;
  title: string;  
  department?: string;
  employment_type: EmploymentType;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
  contact_email: string;
  contact_phone: string;
  location?: string;
 
  status: JobStatus;
  closing_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  restaurant_id: string;
  position: string;
  title: string;  
  department?: string;
  employment_type?: EmploymentType;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  keywords?: string[];
  contact_email: string;
  contact_phone: string;
  location?: string;
  
  status?: JobStatus;
  closing_date?: string;
}


export type UpdateJobRequest = Partial<CreateJobRequest> & { id: string };


export interface JobFilters {
  restaurant_id?: string;
  status?: JobStatus;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface JobListResult {
  jobs: Job[];
  total: number;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
