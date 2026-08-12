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



// types/employee.ts
// Mirrors src/services/employee.service.ts + src/models/employee.model.ts on the backend.
// Add `export * from './employee';` to your central "@/types" barrel file
// (or paste these directly into your existing types file).

export type SelfServiceAccess = "full_access" | "no_access";

// ── Effective-dated table entries (Job tab "Add Entry" rows) ─────────────

export interface EmploymentStatusEntry {
  _id?: string;
  effective_date: string;
  employment_status: string;
  comment?: string;
}

export interface CompensationEntry {
  _id?: string;
  effective_date: string;
  pay_schedule: string;
  pay_type: string;
  pay_rate_amount: number;
  pay_rate_currency: string;
  pay_rate_per: string;
  overtime?: string;
  change_reason?: string;
  comment?: string;
}

export interface AllowanceEntry {
  _id?: string;
  effective_date: string;
  phone?: number;
  travel?: number;
  housing?: number;
  electricity?: number;
  acting?: number;
  additional_duties?: number;
  shift_leader?: number;
  call_out?: number;
  other?: number;
  currency: string;
}

export interface JobInformationEntry {
  _id?: string;
  effective_date: string;
  location?: string;
  division?: string;
  department?: string;
  teams?: string;
  job_title: string;
  reports_to?: string; // Employee id
}

export interface AirportSecurityPassEntry {
  _id?: string;
  issue_date: string;
  expiration_date: string;
  comments?: string;
}

export interface BonusEntry {
  _id?: string;
  date: string;
  amount: number;
  reason?: string;
  comment?: string;
}

export interface CommissionEntry {
  _id?: string;
  date: string;
  amount: number;
  comment?: string;
}

export interface EquityEntry {
  _id?: string;
  grant_type: string;
  custom_grant_type_name?: string;
  grant_date: string;
  vesting_start_date?: string;
  equity_granted: number;
  strike_price?: number;
  vesting_schedule?: string;
  vesting_months?: number;
  cliff_months?: number;
}

export interface PayRates {
  daily?: number;
  holiday?: number;
  sick?: number;
  vacation_pay_in_lieu_rate?: number;
}

export interface PotentialBonus {
  annual_percentage?: number;
  annual_amount?: number;
  annual_amount_currency?: string;
}

// current/history/future split returned for every effective-dated table
export interface EffectiveDatedResult<T> {
  current?: T;
  history: T[];
  future: T[];
}

// ── List row (GET /employees) ─────────────────────────────────────────────

export interface EmployeeSummary {
  id: string;
  employee_number?: string;
  full_name: string;
  preferred_name?: string;
  job_title?: string;
  department?: string;
  division?: string;
  location?: string;
  employment_status?: string;
  work_email?: string;
  hire_date?: string;
  self_service_access: SelfServiceAccess;
}

// ── Single profile (GET /employees/:id) ────────────────────────────────────

export interface EmployeeVitals {
  mobile_phone?: string;
  work_email?: string;
  address?: string;
  job_title?: string;
  employment_status?: string;
  department?: string;
  company_name?: string;
  hire_date?: string;
  tenure_days?: number;
  manager?: { id: string; name: string; job_title?: string } | null;
}

export interface EmployeeJobTab {
  job: {
    hire_date?: string;
    job_code?: string;
    direct_reports_count: number;
    probation_end_date?: string;
    contract_end_date?: string;
    contracted_hours_per_week?: number;
    contracted_days_per_week?: number;
  };
  employment_status: EffectiveDatedResult<EmploymentStatusEntry>;
  compensation: EffectiveDatedResult<CompensationEntry>;
  allowances: EffectiveDatedResult<AllowanceEntry>;
  job_information: EffectiveDatedResult<JobInformationEntry>;
  pay_rates?: PayRates;
  airport_security_pass_history: AirportSecurityPassEntry[];
  potential_bonus?: PotentialBonus;
  bonus_history: BonusEntry[];
  commission_history: CommissionEntry[];
  equity_history: EquityEntry[];
}

export interface EmployeeProfile {
  id: string;
  full_name: string;
  vitals: {
    employee_number?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    preferred_name?: string;
    birth_date?: string;
    gender?: string;
    marital_status?: string;

    street1?: string;
    street2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
    address?: string;

    work_phone?: string;
    work_phone_ext?: string;
    mobile_phone?: string;
    home_phone?: string;
    work_email?: string;
    home_email?: string;

    self_service_access: "full_access" | "no_access";

    job_title?: string;
    employment_status?: string;
    department?: string;
    company_name?: string;
    hire_date?: string;
    tenure_days?: number;
    manager?: { id: string; name: string; job_title?: string } | null;
  };
  job_tab: {
    job: {
      hire_date?: string;
      job_code?: string;
      direct_reports_count: number;
      probation_end_date?: string;
      probation_pending?: boolean;
      contract_end_date?: string;
      contracted_hours_per_week?: number;
      contracted_days_per_week?: number;
    };
    employment_status: { current?: any; history: any[]; future: any[] };
    compensation: { current?: any; history: any[]; future: any[] };
    allowances: { current?: any; history: any[]; future: any[] };
    job_information: { current?: any; history: any[]; future: any[] };
    pay_rates?: any;
    airport_security_pass_history: any[];
    potential_bonus?: any;
    bonus_history: any[];
    commission_history: any[];
    equity_history: any[];
  };
}

// ── Create ("New Employee" form) ────────────────────────────────────────

export interface CreateEmployeeRequest {
  employee_number?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  preferred_name?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;

  street1?: string;
  street2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;

  hire_date?: string;

  work_phone?: string;
  work_phone_ext?: string;
  mobile_phone?: string;
  home_phone?: string;
  work_email?: string;
  home_email?: string;

  employment_status?: string;

  job_title?: string;
  reports_to?: string;
  department?: string;
  division?: string;
  location?: string;

  pay_schedule?: string;
  pay_type?: string;
  pay_rate_amount?: number;
  pay_rate_currency?: string;
  pay_rate_per?: string;

  self_service_access?: SelfServiceAccess;
}