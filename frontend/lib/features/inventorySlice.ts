import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const inventoryApi = createApi({
  reducerPath: "inventory",
  baseQuery,
  endpoints: (builder) => ({
    createInventory: builder.mutation({
      query: (newInventory) => ({
        url: `/inventories`,
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
          url: "/inventories",
          params: params,
        };
      },
    }),

    getInventory: builder.query({
      query: (inventoryId) => `/inventories/${inventoryId}`,
    }),

    getInventoryByProduct: builder.query({
      query: (inventoryId) => `/inventories/product-id/${inventoryId}`, // inventoryId->product_id
    }),

    updateInventory: builder.mutation({
      query: ({ inventoryId, updatedInventory }) => ({
        url: `/inventories/${inventoryId}`,
        method: "PATCH",
        headers,
        body: updatedInventory,
      }),
    }),

    deleteInventory: builder.mutation({
      query: (inventoryId) => ({
        url: `/inventories/${inventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateInventoryMutation, useGetInventoryByProductQuery, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetInventoryQuery, useUpdateInventoryMutation } = inventoryApi;
