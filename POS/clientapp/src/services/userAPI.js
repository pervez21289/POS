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
    }),
});

export const {
    useGetUsersQuery,
    useUpdateOrCreateUserMutation,
    useDeleteUserMutation
} = userAPI;
