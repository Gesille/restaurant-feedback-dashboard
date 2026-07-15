import { apiSlice } from "../api/apiSlice";

export interface ContactSubmission {
    _id: string;
    name: string;
    email: string;
    message: string;
    status: "new" | "read" | "responded";
    createdAt: string;
    updatedAt: string;
}

export interface SubmitContactPayload {
    name: string;
    email: string;
    message: string;
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ContactListResponse {
    success: true;
    data: ContactSubmission[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// contactApi.ts
export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation<ApiSuccess<ContactSubmission>, SubmitContactPayload>({
      query: (body) => ({ url: "submit-contact", method: "POST", body }),
      invalidatesTags: ["Contact"],
    }),

    getContacts: builder.query<
      ContactListResponse,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "get-all-contacts",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Contact"],
    }),

    getContactById: builder.query<ApiSuccess<ContactSubmission>, string>({
      query: (id) => `get-contact/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Contact", id }],
    }),

    updateContactStatus: builder.mutation<
      ApiSuccess<ContactSubmission>,
      { id: string; status: ContactSubmission["status"] }
    >({
      query: ({ id, status }) => ({ url: `update-status/${id}`, method: "PATCH", body: { status } }),
      invalidatesTags: ["Contact"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitContactMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactStatusMutation,
} = contactApiSlice;