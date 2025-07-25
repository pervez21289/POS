// src/api/basicSettingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const basicSettingApi = createApi({
    reducerPath: 'basicSettingApi',
    baseQuery: fetchBaseQuery({ baseUrl: Config.baseurl }),
    tagTypes: ['BasicSetting'],
    endpoints: (builder) => ({
        getBasicSettings: builder.query({
            query: () => 'BasicSettings',
            providesTags: ['BasicSetting'],
        }),
        updateBasicSetting: builder.mutation({
            query: (body) => ({
                url: 'BasicSettings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['BasicSetting'],
        }),
        createBasicSetting: builder.mutation({
            query: (body) => ({
                url: 'BasicSettings',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['BasicSetting'],
        }),
    }),
});

export const {
    useGetBasicSettingsQuery,
    useUpdateBasicSettingMutation,
    useCreateBasicSettingMutation
} = basicSettingApi;