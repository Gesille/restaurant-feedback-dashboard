// features/feedback/feedbackAnalyticsApi.ts
import { apiSlice } from "../api/apiSlice";

export type OverviewStats = {
  totalFeedbacks: number;
  averages: Record<string, number>;
  recommendationBreakdown: Record<Recommendation, number>;
  recommendationPercentage: Record<Recommendation, number>;
  firstFeedbackAt: string | null;
  lastFeedbackAt: string | null;
};
export type Rating = 1 | 2 | 3 | 4 | 5;
export type WaiterPerformance = {
  waiter_name: string;
  feedbackCount: number;
  averages: Record<string, number>;
};
export type Recommendation =
  | "Very Likely"
  | "Likely"
  | "Neutral"
  | "Unlikely"
  | "Very Unlikely";

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
export type DailyReportEntry = {
  date: string; // YYYY-MM-DD
  feedbackCount: number;
  averageOverallRating: number;
};

export type MonthlyReportEntry = {
  month: string; // YYYY-MM
  feedbackCount: number;
  averageOverallRating: number;
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

export interface RestaurantLeaderboardEntry {
  restaurantId: string;
  name: string;
  location: string | null;
  feedbackCount: number;
  averageOverallRating: number;
}

// ── Appends /:restaurantId only when it's actually provided ──
const withRestaurant = (base: string, restaurantId?: string) =>
  restaurantId ? `${base}/${restaurantId}` : base;

export const feedbackAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<
      { success: boolean; data: OverviewStats },
      string | undefined
    >({
      query: (restaurantId) => ({
        url: withRestaurant("analytics/overview", restaurantId),
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [
        { type: "FeedbackAnalytics", id: id ?? "global" },
      ],
    }),

    getWaiterPerformance: builder.query<
      { success: boolean; data: WaiterPerformance[] },
      string | undefined
    >({
      query: (restaurantId) => ({
        url: withRestaurant("analytics/waiters", restaurantId),
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [
        { type: "FeedbackAnalytics", id: `waiters-${id ?? "global"}` },
      ],
    }),

    getRatingDistribution: builder.query<
      { success: boolean; data: RatingDistributionEntry[] },
      string | undefined
    >({
      query: (restaurantId) => ({
        url: withRestaurant("analytics/distribution", restaurantId),
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, id) => [
        { type: "FeedbackAnalytics", id: `dist-${id ?? "global"}` },
      ],
    }),

    getEvaluators: builder.query<
      { success: boolean; data: EvaluatorsPage },
      { restaurantId?: string; page?: number; pageSize?: number }
    >({
      query: ({ restaurantId, page = 1, pageSize = 20 }) => ({
        url: `${withRestaurant("analytics/evaluators", restaurantId)}?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [
        {
          type: "FeedbackAnalytics",
          id: `evals-${arg.restaurantId ?? "global"}`,
        },
      ],
    }),

    getTrend: builder.query<
      { success: boolean; data: TrendPoint[] },
      { restaurantId?: string; granularity?: "day" | "week" | "month" }
    >({
      query: ({ restaurantId, granularity = "day" }) => ({
        url: `${withRestaurant("analytics/trend", restaurantId)}?granularity=${granularity}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [
        {
          type: "FeedbackAnalytics",
          id: `trend-${arg.restaurantId ?? "global"}`,
        },
      ],
    }),
 getDailyReport: builder.query<
      { success: boolean; data: DailyReportEntry[] },
      { restaurantId: string; year: number; month: number }
    >({
      query: ({ restaurantId, year, month }) => ({
        url: `analytics/daily/${restaurantId}?year=${year}&month=${month}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [
        { type: "FeedbackAnalytics", id: `daily-${arg.restaurantId}-${arg.year}-${arg.month}` },
      ],
    }), 

    getRestaurantLeaderboard: builder.query<
      { success: boolean; data: RestaurantLeaderboardEntry[] },
      void
    >({
      query: () => ({
        url: "analytics/leaderboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "FeedbackAnalytics", id: "leaderboard" }],
    }),
    getMonthlyReport: builder.query<
      { success: boolean; data: MonthlyReportEntry[] },
      { restaurantId: string; year: number }
    >({
      query: ({ restaurantId, year }) => ({
        url: `analytics/monthly/${restaurantId}?year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_r, _e, arg) => [
        { type: "FeedbackAnalytics", id: `monthly-${arg.restaurantId}-${arg.year}` },
      ],
    }),
  }),
});
  

export const {
  useGetOverviewQuery,
  useGetWaiterPerformanceQuery,
  useGetRatingDistributionQuery,
  useGetEvaluatorsQuery,
  useGetTrendQuery,
  useGetRestaurantLeaderboardQuery,
  useGetDailyReportQuery,
  useGetMonthlyReportQuery
} = feedbackAnalyticsApi;
