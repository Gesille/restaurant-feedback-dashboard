import { apiSlice } from "../api/apiSlice";

export type CvFile = { id: string; name: string; mimetype: string; downloadUrl: string };
export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  stage: string | null;
  job: string | null; // null = general submission, string = career application
  submittedAt: string;
  cvFiles: CvFile[];
};

type SubmitCVData = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  message: string;
  cvFile: string;
  cvFileName: string;
};

type GetAllCVsResponse = {
  success: boolean;
  message?: string;
  data: Applicant[];
};

export const careersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitCV: builder.mutation<{ success: boolean; message: string }, SubmitCVData>({
      query: (data) => ({
        url: "submit-cv",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCVs: builder.query<GetAllCVsResponse, void>({
      query: () => ({
        url: "all",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["CV"],
    }),

    downloadCV: builder.query<{ blob: Blob; filename: string | null }, string>({
      query: (attachmentId) => ({
        url: `download/${attachmentId}`,
        method: "GET",
        credentials: "include" as const,
        
        responseHandler: async (response: Response) => {
          if (!response.ok) {
            let message = "Failed to download file";
            try {
              const errJson = await response.clone().json();
              message = errJson?.message || message;
            } catch {
         new Error(message);
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
  }),
});

export const {
  useSubmitCVMutation,
  useGetAllCVsQuery,
  useLazyDownloadCVQuery,
} = careersApi;