import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const memberApi = createApi({
  reducerPath: "member",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5008/api/members" }),
  endpoints: (builder) => ({
    getAllMember: builder.query({
      query: () => "/",
    }),

    getMember: builder.query({
      query: (memberId) => `/${memberId}`,
    }),

    getMemberByPhone: builder.query({
      query: (memberId) => `/by-phone/${memberId}`, //memberId-->phone
    }),

    createMember: builder.mutation({
      query: (newMember) => ({
        url: ``,
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: newMember,
      }),
    }),

    updateMember: builder.mutation({
      query: ({ memberId, updatedMember }) => ({
        url: `/${memberId}`,
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: updatedMember,
      }),
    }),

    deleteMember: builder.mutation({
      query: (memberId) => ({
        url: `/${memberId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateMemberMutation,useGetMemberByPhoneQuery, useDeleteMemberMutation, useGetAllMemberQuery, useGetMemberQuery, useUpdateMemberMutation } = memberApi;
