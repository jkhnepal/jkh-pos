import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inventoryApi = createApi({
  reducerPath: "inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/inventories" }),
  endpoints: (builder) => ({
    // getAllInventory: builder.query({
    //   query: () => "/",
    // }),

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

    getInventoryStatOfAProduct: builder.query({
      query: (product) => `/inventory-stat-of-a-product/${product}`,
    }),

    getInventory: builder.query({
      query: (inventoryId) => `/${inventoryId}`,
    }),

    // inventoryId->product_id
    getInventoryByProduct: builder.query({
      query: (inventoryId) => `/product-id/${inventoryId}`,
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

export const { useCreateInventoryMutation, useGetInventoryStatOfAProductQuery, useGetInventoryByProductQuery, useDeleteInventoryMutation, useGetAllInventoryQuery, useGetInventoryQuery, useUpdateInventoryMutation } = inventoryApi;
