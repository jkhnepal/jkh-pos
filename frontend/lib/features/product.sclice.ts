import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/products" }),
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: ``,
        method: "POST",
        headers,
        body: newProduct,
      }),
    }),

    getAllProduct: builder.query({
      query: (options) => {
        const { name } = options;
        const params = name ? { name } : {};
        return {
          url: "/",
          params: params,
        };
      },
    }),

    getProduct: builder.query({
      query: (productId) => `/${productId}`,
    }),

    getProductBySku: builder.query({
      query: (productId) => `/sku/${productId}`, //productId->sku
    }),

    updateProduct: builder.mutation({
      query: ({ productId, updatedProduct }) => ({
        url: `/${productId}`,
        method: "PATCH",
        headers,
        body: updatedProduct,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateProductMutation, useGetProductBySkuQuery, useDeleteProductMutation, useGetAllProductQuery, useGetProductQuery, useUpdateProductMutation } = productApi;
