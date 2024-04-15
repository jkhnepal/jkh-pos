import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const rewardHistoryApi = createApi({
  reducerPath: "rewardHistory",
  baseQuery,
  endpoints: (builder) => ({
    getAllRewardHistory: builder.query({
      query: ({ member }) => {
        const params = {
          member,
        };
        return {
          url: "/reward-collected-histories",
          params: params,
        };
      },
    }),

    getAllRewardHistorysOfAMember: builder.query({
      query: ({ member_id }) => {
        const params = {
          member_id,
        };
        return {
          url: "/reward-collected-histories/loki/reward-collected-histories-of-a-member",
          params: params,
        };
      },
    }),

    getRewardHistory: builder.query({
      query: (rewardCollectedHistoryId) => `/reward-collected-histories/${rewardCollectedHistoryId}`,
    }),

    createRewardHistory: builder.mutation({
      query: (newRewardHistory) => ({
        url: `/reward-collected-histories`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          selectedProducts: newRewardHistory.selectedProducts,
          claimPoint: newRewardHistory.claimPoint,
        },
      }),
    }),

    updateRewardHistory: builder.mutation({
      query: ({ rewardCollectedHistoryId, updatedRewardHistory }) => ({
        url: `/reward-collected-histories/${rewardCollectedHistoryId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updatedRewardHistory,
      }),
    }),

    deleteRewardHistory: builder.mutation({
      query: (rewardCollectedHistoryId) => ({
        url: `/reward-collected-histories/${rewardCollectedHistoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateRewardHistoryMutation, useGetAllRewardHistorysOfAMemberQuery, useDeleteRewardHistoryMutation, useGetAllRewardHistoryQuery, useGetRewardHistoryQuery, useUpdateRewardHistoryMutation } = rewardHistoryApi;
