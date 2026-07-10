import { apiSlice } from "../api/apiSlice";

export type Restaurant = {
  id: string;
  x_name: string;
  x_location: string;
  x_manager_email: string;
};

type CreateRestaurantData = {
  x_name: string;
  x_location: string;
  x_manager_email: string;
};

type CreateRestaurantResponse = {
  success: boolean;
  message?: string;
  data: { id: string };
};

type GetAllRestaurantsResponse = {
  success: boolean;
  message?: string;
  data: Restaurant[];
};

type GetRestaurantResponse = {
  success: boolean;
  message?: string;
  data: Restaurant;
};

export type ResolvedQrRestaurant = {
  id: string;
  name: string;
  location: string;
};

type ResolveQrTokenResponse = {
  success: boolean;
  message?: string;
  data: ResolvedQrRestaurant;
};

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRestaurants: builder.query<GetAllRestaurantsResponse, void>({
      query: () => ({
        url: "restaurants",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Restaurant"],
    }),

    getRestaurantById: builder.query<GetRestaurantResponse, string>({
      query: (id) => ({
        url: `restaurants/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_result, _error, id) => [{ type: "Restaurant", id }],
    }),

    createRestaurant: builder.mutation<CreateRestaurantResponse, CreateRestaurantData>({
      query: (data) => ({
        url: "restaurants",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Restaurant"],
    }),

    // --- QR endpoints ---

    getQrImage: builder.query<{ blob: Blob; filename: string | null }, string>({
      query: (id) => ({
        url: `restaurants/${id}/qr`,
        method: "GET",
        credentials: "include" as const,
        responseHandler: async (response: Response) => {
          if (!response.ok) {
            let message = "Failed to fetch QR code";
            try {
              const errJson = await response.clone().json();
              message = errJson?.message || message;
            } catch {
              // response wasn't JSON, keep default message
            }
            throw new Error(message);
          }

          const disposition = response.headers.get("Content-Disposition") || "";
          const match = disposition.match(/filename="?([^"]+)"?/);
          const filename = match ? match[1] : null;

          const blob = await response.blob();
          return { blob, filename };
        },
      }),
    }),

    resolveQrToken: builder.query<ResolveQrTokenResponse, string>({
      query: (token) => ({
        url: `restaurants/qr/${token}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useLazyGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useLazyGetQrImageQuery,
  useResolveQrTokenQuery,
  useLazyResolveQrTokenQuery,
} = restaurantApi;