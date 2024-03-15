import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statApi = createApi({
  reducerPath: "stat",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/stats" }),
  endpoints: (builder) => ({
    getHeadquarterStat: builder.query({
      query: (inventoryId) => `/headquarter/${inventoryId}`,
    }),
  }),
});

export const { useGetHeadquarterStatQuery } = statApi;


    // // inventoryId->product_id
    // getInventoryByProduct: builder.query({
    //   query: (inventoryId) => `/product-id/${inventoryId}`,
    // }),