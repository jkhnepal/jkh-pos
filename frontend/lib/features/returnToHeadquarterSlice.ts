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
  }),
});

export const { useCreateReturnToHeadquarterMutation } = returnToHeadquarterApi;
