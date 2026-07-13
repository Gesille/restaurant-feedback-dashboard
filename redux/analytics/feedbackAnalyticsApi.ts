// features/feedback/feedbackAnalyticsApi.ts
import { apiSlice } from "../api/apiSlice";
import { Rating, Recommendation } from "./analyticsApi";


export type OverviewStats = {
  totalFeedbacks: number;
  averages: Record<string, number>;
  recommendationBreakdown: Record<Recommendation, number>;
  recommendationPercentage: Record<Recommendation, number>;
  firstFeedbackAt: string | null;
  lastFeedbackAt: string | null;
};

export type WaiterPerformance = {
  waiter_name: string;
  feedbackCount: number;
  averages: Record<string, number>;
};

export type RatingDistributionEntry = {
  field: string;
  distribution: Record<Rating, number>;
};

export type Evaluator = {
  id: string;
  customer_name: string;
  customer_email: string;
  waiter_name: string;
  overall_rating: Rating;
  recommendation: Recommendation;
  comment?: string;
  date: string;
};

export type EvaluatorsPage = {
  total: number;
  page: number;
  pageSize: number;
  data: Evaluator[];
};

export type TrendPoint = {
  bucket: string;
  feedbackCount: number;
  averageOverallRating: number;
};


export const feedbackAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<{ success: boolean; data: OverviewStats }, string>({
      query: (restaurantId) => ({
        url: `analytics/overview/${restaurantId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [{ type: "FeedbackAnalytics", id }],
    }),

    getWaiterPerformance: builder.query<{ success: boolean; data: WaiterPerformance[] }, string>({
      query: (restaurantId) => ({
        url: `analytics/waiters/${restaurantId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [{ type: "FeedbackAnalytics", id: `waiters-${id}` }],
    }),

    getRatingDistribution: builder.query<{ success: boolean; data: RatingDistributionEntry[] }, string>({
      query: (restaurantId) => ({
        url: `analytics/distribution/${restaurantId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [{ type: "FeedbackAnalytics", id: `dist-${id}` }],
    }),

    getEvaluators: builder.query<
      { success: boolean; data: EvaluatorsPage },
      { restaurantId: string; page?: number; pageSize?: number }
    >({
      query: ({ restaurantId, page = 1, pageSize = 20 }) => ({
        url: `analytics/evaluators/${restaurantId}?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [{ type: "FeedbackAnalytics", id: `evals-${arg.restaurantId}` }],
    }),

    getTrend: builder.query<
      { success: boolean; data: TrendPoint[] },
      { restaurantId: string; granularity?: "day" | "week" | "month" }
    >({
      query: ({ restaurantId, granularity = "day" }) => ({
        url: `analytics/trend/${restaurantId}?granularity=${granularity}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [{ type: "FeedbackAnalytics", id: `trend-${arg.restaurantId}` }],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetWaiterPerformanceQuery,
  useGetRatingDistributionQuery,
  useGetEvaluatorsQuery,
  useGetTrendQuery,
} = feedbackAnalyticsApi;