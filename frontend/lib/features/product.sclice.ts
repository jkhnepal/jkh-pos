import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
// Define common headers

const headers = { "Content-Type": "application/json" };

export const productApi = createApi({
  reducerPath: "product",
  baseQuery,
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: `/products`,
        method: "POST",
        headers,
        body: newProduct,
      }),
    }),

    getAllProduct: builder.query({
      query: ({ page = 1, limit = 5, search, sort }) => {
        const params = {
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/products",
          params: params,
        };
      },
    }),

    getProduct: builder.query({
      query: (productId) => `/products/${productId}`,
    }),

    getProductBySku: builder.query({
      query: (productId) => `/products/sku/${productId}`, //productId->sku
    }),

    updateProduct: builder.mutation({
      query: ({ productId, updatedProduct }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        headers,
        body: updatedProduct,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateProductMutation, useGetProductBySkuQuery, useDeleteProductMutation, useGetAllProductQuery, useGetProductQuery, useUpdateProductMutation } = productApi;
