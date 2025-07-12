// src/api/basicSettingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const basicSettingApi = createApi({
    reducerPath: 'basicSettingApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:5001/api/' }),
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