/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/analytics/analyticsApi.ts
import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";

export type Recommendation =
  | "Very Likely"
  | "Likely"
  | "Neutral"
  | "Unlikely"
  | "Very Unlikely";

export type Rating = 1 | 2 | 3 | 4 | 5;

export type RatingAverages = {
  friendliness_rating: number;
  attentiveness_rating: number;
  menu_knowledge_rating: number;
  service_speed_rating: number;
  food_quality_rating: number;
  cleanliness_rating: number;
  overall_rating: number;
  bartender_friendliness_rating: number;
  bartender_drink_knowledge_rating: number;
  bartender_speed_rating: number;
  bartender_welcome_rating: number;
  bartender_overall_rating: number;
  hostess_friendliness_rating: number;
  hostess_seating_rating: number;
  hostess_welcome_rating: number;
  hostess_communication_rating: number;
  hostess_overall_rating: number;
};

export type OverviewStats = {
  totalFeedbacks: number;
  averages: RatingAverages;
  recommendationBreakdown: Record<Recommendation, number>;
  recommendationPercentage: Record<Recommendation, number>;
  firstFeedbackAt: string | null;
  lastFeedbackAt: string | null;
};

export type WaiterPerformance = {
  waiter_name: string;
  feedbackCount: number;
  averages: Pick<
    RatingAverages,
    | "friendliness_rating"
    | "attentiveness_rating"
    | "menu_knowledge_rating"
    | "service_speed_rating"
    | "food_quality_rating"
    | "cleanliness_rating"
    | "overall_rating"
  >;
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

export type TrendGranularity = "day" | "week" | "month";

export type TrendPoint = {
  bucket: string;
  feedbackCount: number;
  averageOverallRating: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getFeedbackOverview: builder.query<ApiEnvelope<OverviewStats>, void>({
      query: () => ({
        url: `analytics/overview`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getWaiterPerformance: builder.query<ApiEnvelope<WaiterPerformance[]>, void>({
      query: () => ({
        url: `analytics/waiters`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getRatingDistribution: builder.query<ApiEnvelope<RatingDistributionEntry[]>, void>({
      query: () => ({
        url: `analytics/distribution`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

       getEvaluators: builder.query<
      ApiEnvelope<EvaluatorsPage>,
      { page?: number; pageSize?: number } | void
    >({
      query: (arg) => {
        const { page = 1, pageSize = 20 } = arg ?? {};
        return {
          url: `analytics/evaluators?page=${page}&pageSize=${pageSize}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
    }),
getFeedbackTrend: builder.query<
      ApiEnvelope<TrendPoint[]>,
      { granularity?: TrendGranularity } | void
    >({
      query: (arg) => {
        const { granularity = "day" } = arg ?? {};
        return {
          url: `analytics/trend?granularity=${granularity}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useGetFeedbackOverviewQuery,
  useLazyGetFeedbackOverviewQuery,
  useGetWaiterPerformanceQuery,
  useLazyGetWaiterPerformanceQuery,
  useGetRatingDistributionQuery,
  useLazyGetRatingDistributionQuery,
  useGetEvaluatorsQuery,
  useLazyGetEvaluatorsQuery,
  useGetFeedbackTrendQuery,
  useLazyGetFeedbackTrendQuery,
} = analyticsApi;