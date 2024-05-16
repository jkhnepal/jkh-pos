import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
// Define common headers
const headers = { "Content-Type": "application/json" };

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery,
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `/categories`,
        method: "POST",
        headers,
        body: newCategory,
      }),
    }),

    getAllCategory: builder.query({
      query: ({ sort }) => {
        const params = {
          sort,
        };
        return {
          url: "/categories",
          params: params,
        };
      },
    }),

    getCategory: builder.query({
      query: (categoryId) => `/categories/${categoryId}`,
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/categories/${categoryId}`,
        method: "PATCH",
        headers,
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoryQuery, useGetCategoryQuery, useUpdateCategoryMutation } = categoryApi;
