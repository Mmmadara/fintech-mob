import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../http";

export const unauthApi = createApi({
  reducerPath: "unauthApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Categories", "Income"],
  endpoints: (builder) => ({
    getAllMeasurements: builder.query({
      query: () => ({
        url: `/measurements?fields[]=id,name`,
      }),
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `/categies?fields[]=*,measurement.name`,
      }),
      providesTags: ["Categories"],
    }),
    getAllMainIncomes: builder.query({
      query: () => ({
        url: `/income?fields[]=*,income_cat.sub_total,income_cat.id,income_cat.category.icon&sort=-income_date`,
      }),
      providesTags: ["Income"],
    }),
    postCategory: builder.mutation({
      query: (body) => ({
        url: `/categies`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    postIncomeCat: builder.mutation({
      query: (body) => ({
        url: `/income_cat`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Income"],
    }),
  }),
});

export const {
  useGetAllMeasurementsQuery,
  usePostCategoryMutation,
  useGetAllCategoriesQuery,
	useGetAllMainIncomesQuery,
  usePostIncomeCatMutation,
} = unauthApi;
