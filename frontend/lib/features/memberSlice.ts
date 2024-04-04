import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const memberApi = createApi({
  reducerPath: "member",
  baseQuery,
  endpoints: (builder) => ({
    getAllMember: builder.query({
      query: ({ page = 1, limit = 5, search, sort }) => {
        const params = {
          page,
          limit,
          search,
          sort,
        };
        return {
          url: "/members",
          params: params,
        };
      },
    }),

    getMember: builder.query({
      query: (memberId) => `/members/${memberId}`,
    }),

    getMemberByPhone: builder.query({
      query: (memberId) => `/members/by-phone/${memberId}`, //memberId-->phone
    }),

    createMember: builder.mutation({
      query: (newMember) => ({
        url: `/members`,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newMember,
      }),
    }),

    updateMember: builder.mutation({
      query: ({ memberId, updatedMember }) => ({
        url: `/members/${memberId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: updatedMember,
      }),
    }),

    deleteMember: builder.mutation({
      query: (memberId) => ({
        url: `/members/${memberId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateMemberMutation, useGetMemberByPhoneQuery, useDeleteMemberMutation, useGetAllMemberQuery, useGetMemberQuery, useUpdateMemberMutation } = memberApi;
