import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const headquarterInventoryApi = createApi({
  reducerPath: "headquarter-inventory",
  baseQuery,
  endpoints: (builder) => ({
    getAllHeadquarterInventory: builder.query({
      query: (options) => {
        const { name } = options;
        const params = name ? { name } : {};
        return {
          url: "/headquarter-inventories",
          params: params,
        };
      },
    }),

    getHeadquarterInventory: builder.query({
      query: (headquarterInventoryId) => `/headquarter-inventories/${headquarterInventoryId}`,
    }),

    getHeadquarterInventoryByProduct: builder.query({
      query: (product) => `/headquarter-inventories/get-headquarter-inventory-by-product/${product}`,
    }),

    createHeadquarterInventory: builder.mutation({
      query: (newHeadquarterInventory) => ({
        url: `/headquarter-inventories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newHeadquarterInventory,
      }),
    }),

    updateHeadquarterInventory: builder.mutation({
      query: ({ headquarterInventoryId, updatedHeadquarterInventory }) => ({
        url: `/headquarter-inventories/${headquarterInventoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedHeadquarterInventory,
      }),
    }),

    deleteHeadquarterInventory: builder.mutation({
      query: (headquarterInventoryId) => ({
        url: `/headquarter-inventories/${headquarterInventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateHeadquarterInventoryMutation, useGetHeadquarterInventoryByProductQuery, useDeleteHeadquarterInventoryMutation, useGetAllHeadquarterInventoryQuery, useGetHeadquarterInventoryQuery, useUpdateHeadquarterInventoryMutation } = headquarterInventoryApi;
