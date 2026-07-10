import { apiSlice } from "../api/apiSlice";

export type Recommendation =
  | "Very Likely"
  | "Likely"
  | "Neutral"
  | "Unlikely"
  | "Very Unlikely";

export type Rating = 1 | 2 | 3 | 4 | 5;

export type Feedback = {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_email: string;
  waiter_name: string;
  // Waiter / Waitress
  friendliness_rating: Rating;
  attentiveness_rating: Rating;
  menu_knowledge_rating: Rating;
  service_speed_rating: Rating;
  food_quality_rating: Rating;
  cleanliness_rating: Rating;
  overall_rating: Rating;
  // Bartender
  bartender_friendliness_rating: Rating;
  bartender_drink_knowledge_rating: Rating;
  bartender_speed_rating: Rating;
  bartender_welcome_rating: Rating;
  bartender_overall_rating: Rating;
  // Hostess
  hostess_friendliness_rating: Rating;
  hostess_seating_rating: Rating;
  hostess_welcome_rating: Rating;
  hostess_communication_rating: Rating;
  hostess_overall_rating: Rating;
  // Common
  recommendation: Recommendation;
  comment?: string;
  createdAt: string;
};

type CreateFeedbackData = {
  restaurant_id?: string;
  qr_token?: string;
  customer_name: string;
  customer_email: string;
  waiter_name: string;
  // Waiter / Waitress
  friendliness_rating: Rating;
  attentiveness_rating: Rating;
  menu_knowledge_rating: Rating;
  service_speed_rating: Rating;
  food_quality_rating: Rating;
  cleanliness_rating: Rating;
  overall_rating: Rating;
  // Bartender
  bartender_friendliness_rating: Rating;
  bartender_drink_knowledge_rating: Rating;
  bartender_speed_rating: Rating;
  bartender_welcome_rating: Rating;
  bartender_overall_rating: Rating;
  // Hostess
  hostess_friendliness_rating: Rating;
  hostess_seating_rating: Rating;
  hostess_welcome_rating: Rating;
  hostess_communication_rating: Rating;
  hostess_overall_rating: Rating;
  // Common
  recommendation: Recommendation;
  comment?: string;
};

type CreateFeedbackResponse = {
  success: boolean;
  message?: string;
  data: { id: string };
};

type GetFeedbacksResponse = {
  success: boolean;
  message?: string;
  data: Feedback[];
};

export type FeedbackStats = {
  totalFeedbacks: number;
  averageOverallRating: number;
  recommendationBreakdown: Record<Recommendation, number>;
  [key: string]: unknown;
};

type GetStatsResponse = {
  success: boolean;
  message?: string;
  data: FeedbackStats;
};

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbacksByRestaurant: builder.query<GetFeedbacksResponse, string>({
      query: (restaurantId) => ({
        url: `feedbacks/restaurant/${restaurantId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_result, _error, restaurantId) => [
        { type: "Feedback", id: restaurantId },
      ],
    }),

    getFeedbackStats: builder.query<GetStatsResponse, string>({
      query: (restaurantId) => ({
        url: `feedbacks/stats/${restaurantId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_result, _error, restaurantId) => [
        { type: "FeedbackStats", id: restaurantId },
      ],
    }),

    createFeedback: builder.mutation<CreateFeedbackResponse, CreateFeedbackData>({
      query: (data) => ({
        url: "feedbacks",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, arg) =>
        arg.restaurant_id
          ? [
              { type: "Feedback", id: arg.restaurant_id },
              { type: "FeedbackStats", id: arg.restaurant_id },
            ]
          : ["Feedback", "FeedbackStats"],
    }),
  }),
});

export const {
  useGetFeedbacksByRestaurantQuery,
  useLazyGetFeedbacksByRestaurantQuery,
  useGetFeedbackStatsQuery,
  useLazyGetFeedbackStatsQuery,
  useCreateFeedbackMutation,
} = feedbackApi;