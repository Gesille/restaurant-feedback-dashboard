import { apiSlice } from "../api/apiSlice";

export type CvFile = { id: string; name: string; mimetype: string; downloadUrl: string };
export type ApplicantNote = { id: string; text: string; author: string; createdAt: string };
export interface StageHistory {
    id: string;
    stage: string;
    changedBy: string;
    changedAt: string;
}
export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  linkedin: string;
  message: string | null;
  stage: string;
  assignedTo: string | null;
  notes: ApplicantNote[];
  job: string | null;
  submittedAt: string;
  cvFiles: CvFile[];
   stageHistory: StageHistory[];
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
export type TrackedApplication = {
  id: string;
  job: string | null;
  stage: string;
  submittedAt: string;
  stageHistory: { stage: string; changedAt: string }[];
  cvFiles: { id: string; name: string; downloadUrl: string }[];
};

type TrackApplicationResponse = {
  success: boolean;
  message?: string;
  data: TrackedApplication[];
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
    updateApplicantStage: builder.mutation<{ success: boolean; stage: string }, { id: string; stage: string }>({
  query: ({ id, stage }) => ({
    url: `${id}/stage`,
    method: "PATCH",
    body: { stage },
    credentials: "include" as const,
  }),
  invalidatesTags: ["CV"],
}),
assignApplicant: builder.mutation<{ success: boolean; assignedTo: string | null }, { id: string; assignedTo: string }>({
  query: ({ id, assignedTo }) => ({
    url: `${id}/assign`,
    method: "PATCH",
    body: { assignedTo },
    credentials: "include" as const,
  }),
  invalidatesTags: ["CV"],
}),

addApplicantNote: builder.mutation<{ success: boolean; notes: ApplicantNote[] }, { id: string; text: string; author: string }>({
  query: ({ id, text, author }) => ({
    url: `${id}/notes`,
    method: "POST",
    body: { text, author },
    credentials: "include" as const,
  }),
  invalidatesTags: ["CV"],
}),
trackApplication: builder.mutation<
  TrackApplicationResponse,
  { email: string; phone: string }
>({
  query: (body) => ({
    url: "track",
    method: "POST",
    body,
    credentials: "include" as const,
  }),
}),
  }),
});

export const {
  useSubmitCVMutation,
  useGetAllCVsQuery,
  useLazyDownloadCVQuery,
  useUpdateApplicantStageMutation,
  useAssignApplicantMutation,
  useAddApplicantNoteMutation,
  useTrackApplicationMutation 
} = careersApi;