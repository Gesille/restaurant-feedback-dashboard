import { apiSlice } from "../api/apiSlice";

export interface DashboardStats {
  restaurants: { value: number; newThisMonth: number };
  feedback: { value: number; delta: string; trend: "up" | "down"; data: number[] };
  avgRating: { value: number };
  openJobs: { value: number };
  applicants: { value: number; newToday: number; data: number[] };
  newContacts: { value: number };
  pendingQuestions: { value: number };
  scansToday: { value: number; delta: string; trend: "up" | "down" };
  activeQRs: { value: number };
}

export interface ScanTrendPoint {
  date: string;
  scans: number;
}

export interface ActivityEvent {
  id: string;
  type: "scan" | "feedback" | "applicant";
  restaurantName: string;
  detail: string;
  time: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}
export interface ApplicantFunnelStage {
  stage: string;
  count: number;
  percentOfTotal: number;
}
export interface ApplicantFunnel {
  total: number;
  funnel: ApplicantFunnelStage[];
}
 
export interface RestaurantConversion {
  restaurantId: string;
  restaurantName: string;
  scans: number;
  feedback: number;
  conversionRate: number;
}
 
export interface ConversionRate {
  days: number;
  overall: { scans: number; feedback: number; conversionRate: number };
  perRestaurant: RestaurantConversion[];
}
 
export interface RestaurantNeedingQr {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}
 
export interface RestaurantsNeedingQr {
  count: number;
  restaurants: RestaurantNeedingQr[];
}

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiSuccess<DashboardStats>, void>({
      query: () => "stats",
      providesTags: ["Dashboard"],
    }),
    getScanTrend: builder.query<ApiSuccess<ScanTrendPoint[]>, void>({
      query: () => "scan-trend",
      providesTags: ["Dashboard"],
    }),
    getRecentActivity: builder.query<ApiSuccess<ActivityEvent[]>, { limit?: number } | void>({
      query: (params) => ({ url: "recent-activity", params: params ?? undefined }),
      providesTags: ["Dashboard"],
    }),
    getApplicantFunnel: builder.query<ApiSuccess<ApplicantFunnel>, { days?: number } | void>({
      query: (params) => ({ url: "applicant-funnel", params: params ?? undefined }),
      providesTags: ["Dashboard"],
    }),
     getConversionRate: builder.query<ApiSuccess<ConversionRate>, { days?: number } | void>({
      query: (params) => ({ url: "conversion-rate", params: params ?? undefined }),
      providesTags: ["Dashboard"],
    }),
    getRestaurantsNeedingQr: builder.query<ApiSuccess<RestaurantsNeedingQr>, void>({
      query: () => "setup-needed",
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const { 
    useGetDashboardStatsQuery, 
    useGetScanTrendQuery,
     useGetRecentActivityQuery ,
    useGetRestaurantsNeedingQrQuery,
useGetApplicantFunnelQuery,
useGetConversionRateQuery
} = dashboardApiSlice;