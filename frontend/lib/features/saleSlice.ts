import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const saleApi = createApi({
  reducerPath: "sale",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/sales" }),
  endpoints: (builder) => ({
    getAllSale: builder.query({
      query: ({ branch, page = 1, limit = 5, search, sort }) => {
        const params = {
          branch,
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

    getAllSalesOfAMember: builder.query({
      query: ({ member_id }) => {
        const params = {
          member_id,
        };
        return {
          url: "/loki/sales-of-a-member",
          params: params,
        };
      },
    }),

    getSale: builder.query({
      query: (saleId) => `/${saleId}`,
    }),

    createSale: builder.mutation({
      query: (newSale) => ({
        url: ``,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          selectedProducts: newSale.selectedProducts,
          claimPoint: newSale.claimPoint,
        },
      }),
    }),

    updateSale: builder.mutation({
      query: ({ saleId, updatedSale }) => ({
        url: `/${saleId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedSale,
      }),
    }),

    deleteSale: builder.mutation({
      query: (saleId) => ({
        url: `/${saleId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateSaleMutation, useGetAllSalesOfAMemberQuery, useDeleteSaleMutation, useGetAllSaleQuery, useGetSaleQuery, useUpdateSaleMutation } = saleApi;
