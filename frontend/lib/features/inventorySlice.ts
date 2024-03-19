import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const inventoryApi = createApi({
  reducerPath: "inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/inventories" }),
  endpoints: (builder) => ({
    createInventory: builder.mutation({
      query: (newInventory) => ({
        url: ``,
        method: "POST",
        headers,
        body: newInventory,
      }),
    }),

    getAllInventory: builder.query({
      query: (options) => {
        const { product } = options;
        const params = product ? { product } : {};
        return {
          url: "/",
          params: params,
        };
      },
    }),

    getInventory: builder.query({
      query: (inventoryId) => `/${inventoryId}`,
    }),

    getInventoryByProduct: builder.query({
      query: (inventoryId) => `/product-id/${inventoryId}`, // inventoryId->product_id
    }),

    updateInventory: builder.mutation({
      query: ({ inventoryId, updatedInventory }) => ({
        url: `/${inventoryId}`,
        method: "PATCH",
        headers,
        body: updatedInventory,
      }),
    }),

    deleteInventory: builder.mutation({
      query: (inventoryId) => ({
        url: `/${inventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateInventoryMutation, useGetInventoryByProductQuery, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetInventoryQuery, useUpdateInventoryMutation } = inventoryApi;
