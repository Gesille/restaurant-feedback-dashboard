import { apiSlice } from "../api/apiSlice";


export interface Question {
    _id: string;
    question: string;
    answer?: string;
    origin: "client" | "hr";
    isPublished: boolean;
    askerEmail?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface QuestionListResponse {
    success: true;
    data: Question[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// questionApi.ts
export const questionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitQuestion: builder.mutation<ApiSuccess<Question>, { question: string; email?: string }>({
      query: (body) => ({ url: "submit-questions", method: "POST", body }),
      invalidatesTags: ["Question"],
    }),

    getPublishedQuestions: builder.query<ApiSuccess<Question[]>, void>({
      query: () => "published",
      providesTags: ["Question"],
    }),

    getAllQuestions: builder.query<
      QuestionListResponse,
      { origin?: "client" | "hr"; published?: boolean; answered?: boolean; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "get-all-questions",
        method: "GET",
        params: params
          ? {
              ...params,
              published: params.published === undefined ? undefined : String(params.published),
              answered: params.answered === undefined ? undefined : String(params.answered),
            }
          : undefined,
      }),
      providesTags: ["Question"],
    }),

    addGeneralQuestion: builder.mutation<
      ApiSuccess<Question>,
      { question: string; answer: string; isPublished?: boolean }
    >({
      query: (body) => ({ url: "general-question", method: "POST", body }),
      invalidatesTags: ["Question"],
    }),

    answerQuestion: builder.mutation<ApiSuccess<Question>, { id: string; answer: string }>({
      query: ({ id, answer }) => ({ url: `answer-by-id/${id}`, method: "PATCH", body: { answer } }),
      invalidatesTags: ["Question"],
    }),

    togglePublish: builder.mutation<ApiSuccess<Question>, { id: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({ url: `publish-by-id/${id}`, method: "PATCH", body: { isPublished } }),
      invalidatesTags: ["Question"],
    }),

    deleteQuestion: builder.mutation<ApiSuccess<Question>, string>({
      query: (id) => ({ url: `delete-question/${id}`, method: "DELETE" }),
      invalidatesTags: ["Question"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitQuestionMutation,
  useGetPublishedQuestionsQuery,
  useGetAllQuestionsQuery,
  useAddGeneralQuestionMutation,
  useAnswerQuestionMutation,
  useTogglePublishMutation,
  useDeleteQuestionMutation,
} = questionApiSlice;

