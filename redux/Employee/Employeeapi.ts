import {
  ApiResponse,
  CreateEmployeeRequest,
  EmployeeAnalytics,
  EmployeeProfile,
  EmployeeSummary,
} from "@/types";
import { apiSlice } from "../api/apiSlice";

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query<EmployeeSummary[], string | void>({
      query: (search) =>
        `/employees${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      transformResponse: (response: ApiResponse<EmployeeSummary[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
    }),

    getEmployeeById: builder.query<EmployeeProfile, string>({
      query: (id) => `/employees/${id}`,
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<{ id: string }, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ id: string }>) =>
        response.data,
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    updateEmployeeBasicInfo: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        employee_number?: string;
        first_name?: string;
        middle_name?: string;
        last_name?: string;
        preferred_name?: string;
        birth_date?: string;
        gender?: string;
        marital_status?: string;
        street1?: string;
        street2?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country?: string;
        work_phone?: string;
        work_phone_ext?: string;
        mobile_phone?: string;
        home_phone?: string;
        work_email?: string;
        home_email?: string;
        self_service_access?: "full_access" | "no_access";
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    updateEmployeeJobCore: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        hire_date?: string;
        job_code?: string;
        probation_end_date?: string;
        contract_end_date?: string;
        contracted_hours_per_week?: number;
        contracted_days_per_week?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/core`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addEmploymentStatusEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        effective_date: string;
        employment_status: string;
        comment?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/employment-status`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addCompensationEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        effective_date: string;
        pay_schedule: string;
        pay_type: string;
        pay_rate_amount: number;
        pay_rate_currency?: string;
        pay_rate_per: string;
        overtime?: string;
        change_reason?: string;
        comment?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/compensation`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addAllowanceEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        effective_date: string;
        phone?: number;
        travel?: number;
        housing?: number;
        electricity?: number;
        acting?: number;
        additional_duties?: number;
        shift_leader?: number;
        call_out?: number;
        other?: number;
        currency?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/allowances`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addJobInformationEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        effective_date: string;
        job_title: string;
        reports_to?: string;
        location?: string;
        division?: string;
        department?: string;
        teams?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/job-information`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addAirportSecurityPassEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        issue_date: string;
        expiration_date: string;
        comments?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/airport-security-pass`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addBonusEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        date: string;
        amount: number;
        reason?: string;
        comment?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/bonus`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addCommissionEntry: builder.mutation<
      EmployeeProfile,
      { id: string; date: string; amount: number; comment?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/commission`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    addEquityEntry: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        grant_type: string;
        custom_grant_type_name?: string;
        grant_date: string;
        vesting_start_date?: string;
        equity_granted: number;
        strike_price?: number;
        vesting_schedule?: string;
        vesting_months?: number;
        cliff_months?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/equity`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),

    updatePayRates: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        daily?: number;
        holiday?: number;
        sick?: number;
        vacation_pay_in_lieu_rate?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/pay-rates`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),
    getPendingProbationReviews: builder.query<EmployeeSummary[], void>({
      query: () => `/employees/probation/pending`,
      transformResponse: (response: ApiResponse<EmployeeSummary[]>) =>
        response.data,
      providesTags: [{ type: "Employee", id: "PROBATION_PENDING" }],
    }),

    resolveProbation: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        passed: boolean;
        effective_date?: string;
        new_status?: string;
        comment?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/probation-review`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        { type: "Employee", id: "PROBATION_PENDING" },
      ],
    }),
    getContractsNearingEnd: builder.query<EmployeeSummary[], void>({
      query: () => `/employees/contracts/near-end`,
      transformResponse: (response: ApiResponse<EmployeeSummary[]>) =>
        response.data,
      providesTags: [{ type: "Employee", id: "CONTRACTS_NEAR_END" }],
    }),
    getEmployeeAnalytics: builder.query<EmployeeAnalytics, void>({
      query: () => "/employees/analytics",
      transformResponse: (res: { data: EmployeeAnalytics }) => res.data,
    }),
    updatePotentialBonus: builder.mutation<
      EmployeeProfile,
      {
        id: string;
        annual_percentage?: number;
        annual_amount?: number;
        annual_amount_currency?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}/job/potential-bonus`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<EmployeeProfile>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeJobCoreMutation,
  useAddEmploymentStatusEntryMutation,
  useAddCompensationEntryMutation,
  useAddAllowanceEntryMutation,
  useAddJobInformationEntryMutation,
  useAddAirportSecurityPassEntryMutation,
  useAddBonusEntryMutation,
  useAddCommissionEntryMutation,
  useAddEquityEntryMutation,
  useUpdatePayRatesMutation,
  useUpdatePotentialBonusMutation,
  useUpdateEmployeeBasicInfoMutation,
  useGetPendingProbationReviewsQuery,
  useResolveProbationMutation,
  useGetContractsNearingEndQuery,
    useGetEmployeeAnalyticsQuery,
} = employeeApi;
