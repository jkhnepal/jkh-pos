import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const returnToHeadquarterApi = createApi({
  reducerPath: "returnToHeadquarter",
  baseQuery,
  endpoints: (builder) => ({
    createReturnToHeadquarter: builder.mutation({
      query: (newReturnToHeadquarter) => ({
        url: `/return-to-headquarter`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newReturnToHeadquarter,
      }),
    }),

    resetDB: builder.mutation({
      query: (branchId) => ({
        url: `/return-to-headquarter/reset-database-after-3-months/${branchId}`,
        method: "POST",
        // body: emptyObject,
      }),
    }),
  }),
});

export const { useCreateReturnToHeadquarterMutation , useResetDBMutation} = returnToHeadquarterApi;
