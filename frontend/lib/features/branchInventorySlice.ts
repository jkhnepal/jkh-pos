import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const branchInventoryApi = createApi({
  reducerPath: "branch-inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/branch-inventories" }),
  endpoints: (builder) => ({
    // getAllBranchInventory: builder.query({
    //   query: (options) => {
    //     const { branch } = options;
    //     const params = branch ? { branch } : {};
    //     return {
    //       url: "/",
    //       params: params,
    //     };
    //   },
    // }),

    getAllBranchInventory: builder.query({
      query: ({ page = 1, limit = 5, search, sort }) => {
        const params = {
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/",
          params: params,
        };
      },
    }),
    getBranchInventory: builder.query({
      query: (branchInventoryId) => `/${branchInventoryId}`,
    }),

    getBranchInventoryByProduct: builder.query({
      query: (product) => `/get-branch-inventory-by-product/${product}`,
    }),

    createBranchInventory: builder.mutation({
      query: (newBranchInventory) => ({
        url: ``,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newBranchInventory,
      }),
    }),

    updateBranchInventory: builder.mutation({
      query: ({ branchInventoryId, updatedBranchInventory }) => ({
        url: `/${branchInventoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedBranchInventory,
      }),
    }),

    deleteBranchInventory: builder.mutation({
      query: (branchInventoryId) => ({
        url: `/${branchInventoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateBranchInventoryMutation, useGetBranchInventoryByProductQuery, useDeleteBranchInventoryMutation, useGetAllBranchInventoryQuery, useGetBranchInventoryQuery, useUpdateBranchInventoryMutation } = branchInventoryApi;
