import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define common headers
const headers = { "Content-Type": "application/json" };

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/categories" }),
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: ``,
        method: "POST",
        headers,
        body: newCategory,
      }),
    }),

    getAllCategory: builder.query({
      query: (options) => {
        const { name } = options;
        const params = name ? { name } : {};
        return {
          url: "/",
          params: params,
        };
      },
    }),

    getCategory: builder.query({
      query: (categoryId) => `/${categoryId}`,
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/${categoryId}`,
        method: "PATCH",
        headers,
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoryQuery, useGetCategoryQuery, useUpdateCategoryMutation } = categoryApi;
