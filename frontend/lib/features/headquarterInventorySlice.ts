import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const headquarterInventoryApi = createApi({
  reducerPath: "headquarter-inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/headquarter-inventories" }),
  endpoints: (builder) => ({
    getAllHeadquarterInventory: builder.query({
      query: (options) => {
        const { name } = options;
        const params = name ? { name } : {};
        return {
          url: "/",
          params: params,
        };
      },
    }),

    getHeadquarterInventory: builder.query({
      query: (headquarterInventoryId) => `/${headquarterInventoryId}`,
    }),

    getHeadquarterInventoryByProduct: builder.query({
      query: (product) => `/get-headquarter-inventory-by-product/${product}`,
    }),

    createHeadquarterInventory: builder.mutation({
      query: (newHeadquarterInventory) => ({
        url: ``,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newHeadquarterInventory,
      }),
    }),

    updateHeadquarterInventory: builder.mutation({
      query: ({ headquarterInventoryId, updatedHeadquarterInventory }) => ({
        url: `/${headquarterInventoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedHeadquarterInventory,
      }),
    }),

    deleteHeadquarterInventory: builder.mutation({
      query: (headquarterInventoryId) => ({
        url: `/${headquarterInventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateHeadquarterInventoryMutation, useGetHeadquarterInventoryByProductQuery, useDeleteHeadquarterInventoryMutation, useGetAllHeadquarterInventoryQuery, useGetHeadquarterInventoryQuery, useUpdateHeadquarterInventoryMutation } = headquarterInventoryApi;
