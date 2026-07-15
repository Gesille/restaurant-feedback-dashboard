

import { ApiResponse, CreateJobRequest, Job, JobFilters, JobListResult, UpdateJobRequest } from "@/types";
import { apiSlice } from "../api/apiSlice";


function buildQueryString(filters: JobFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const jobApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

   
    getAllJobs: builder.query<JobListResult, JobFilters | void>({
      query: (filters) => `/jobs/get-all-jobs${buildQueryString(filters ?? {})}`,
      transformResponse: (response: ApiResponse<JobListResult>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.jobs.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job' as const, id: 'LIST' },
            ]
          : [{ type: 'Job' as const, id: 'LIST' }],
    }),


    getJobById: builder.query<Job, string>({
      query: (id) => `/jobs/get-job/${id}`,
      transformResponse: (response: ApiResponse<Job>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),

    getJobsByRestaurant: builder.query<Job[], string>({
      query: (restaurantId) => `/jobs/job-filter-restaurant/${restaurantId}`,
      transformResponse: (response: ApiResponse<Job[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job' as const, id: 'LIST' },
            ]
          : [{ type: 'Job' as const, id: 'LIST' }],
    }),


    createJob: builder.mutation<{ id: string }, CreateJobRequest>({
      query: (body) => ({
        url: '/jobs/create-job',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),

    updateJob: builder.mutation<Job, UpdateJobRequest>({
      query: ({ id, ...body }) => ({
        url: `/jobs/update-job/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiResponse<Job>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),

    
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/delete-job/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
 applyToJob: builder.mutation<{ id: string }, { jobId: string; formData: FormData }>({
      query: ({ jobId, formData }) => ({
        url: `/jobs/${jobId}/apply`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) => response.data,
    }),
  }),
  overrideExisting: false,
});


export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetJobsByRestaurantQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation
} = jobApi;