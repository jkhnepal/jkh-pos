import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/categories" }),
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => "/",
    }),

    getCategory: builder.query({
      query: (categoryId) => `/${categoryId}`,
    }),

    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: ``,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newCategory,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/${categoryId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
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
