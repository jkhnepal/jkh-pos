import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:5008/api",
  // baseUrl: "http://localhost:5008/api",
  baseUrl: process.env.NEXT_PUBLIC_URL_API,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");
    // console.log("🚀 ~ accessToken:", accessToken);
    if (accessToken) {
      headers.set("Authorization", `${accessToken}`);
    }
    return headers;
  },
});

export default baseQuery;
