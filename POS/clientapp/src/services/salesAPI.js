import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        createSale: builder.mutation({
            query: (sale) => ({
                url: 'sales',
                method: 'POST',
                body: sale,
            }),
        }),
    }),
});

export const { useCreateSaleMutation } = salesApi;