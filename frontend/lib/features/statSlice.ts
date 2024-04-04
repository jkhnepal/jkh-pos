import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const statApi = createApi({
  reducerPath: "stat",
  baseQuery,
  endpoints: (builder) => ({
    getHeadquarterStat: builder.query({
      query: () => "/stats/headquarter",
    }),

    getBranchStat: builder.query({
      query: ({ branch }) => {
        const params = {
          branch,
        };
        return {
          url: "/stats/branch",
          params: params,
        };
      },
    }),

    getBranchProfit: builder.query({
      query: ({ branch }) => {
        const params = {
          branch,
        };
        return {
          url: "/stats/branch/branch-profit",
          params: params,
        };
      },
    }),
  }),
});

export const { useGetHeadquarterStatQuery, useGetBranchStatQuery, useGetBranchProfitQuery } = statApi;
