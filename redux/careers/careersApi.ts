import { apiSlice } from "../api/apiSlice";

type SubmitCVData = {
  name: string;
  email: string;
  message: string;
  cvFile: string;
  cvFileName: string;
};

export const careersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitCV: builder.mutation<{ success: boolean; message: string }, SubmitCVData>({
      query: (data) => ({
        url: "careers/submit-cv",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useSubmitCVMutation } = careersApi;