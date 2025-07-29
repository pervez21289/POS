import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: Config.baseurl, // 🔁 Replace with your backend API
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.users?.userDetails?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/User',
            providesTags: ['User'],
        }),
        updateOrCreateUser: builder.mutation({
            query: (body) => ({
                url: '/user/CreateOrUpdateUser', // Stored procedure-based API endpoint
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (userID) => ({
                url: `/user/${userID}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        getApiLogs: builder.query({
            query: ({ search = '', startDate = '', endDate = '' } = {}) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (startDate) params.append("startDate", startDate);
                if (endDate) params.append("endDate", endDate);
                return `/user/ApiLogs?${params.toString()}`;
            },
            providesTags: ['ApiLog'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateOrCreateUserMutation,
    useDeleteUserMutation,
    useGetApiLogsQuery
} = userAPI;
