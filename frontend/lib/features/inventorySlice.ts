import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inventoryApi = createApi({
  reducerPath: "inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/inventories" }),
  endpoints: (builder) => ({
    getAllInventory: builder.query({
      query: () => "/",
    }),

    getInventory: builder.query({
      query: (inventoryId) => `/${inventoryId}`,
    }),

    createInventory: builder.mutation({
      query: (newInventory) => ({
        url: ``,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newInventory,
      }),
    }),

    updateInventory: builder.mutation({
      query: ({ inventoryId, updatedInventory }) => ({
        url: `/${inventoryId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
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

export const { useCreateInventoryMutation, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetInventoryQuery, useUpdateInventoryMutation } = inventoryApi;
