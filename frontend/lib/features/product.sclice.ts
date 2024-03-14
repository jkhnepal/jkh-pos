import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/products" }),
  endpoints: (builder) => ({
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

    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: ``,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newProduct,
      }),
    }),

    updateProduct: builder.mutation({
      query: ({ productId, updatedProduct }) => ({
        url: `/${productId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
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

export const { useCreateProductMutation, useDeleteProductMutation, useGetAllProductQuery, useGetProductQuery, useUpdateProductMutation } = productApi;
