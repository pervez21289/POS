import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: Config.baseurl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.users?.userDetails?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        createSale: builder.mutation({
            query: (sale) => ({
                url: 'Sales',
                method: 'POST',
                body: sale,
            }),
        }),
    }),
});

export const { useCreateSaleMutation } = salesApi;