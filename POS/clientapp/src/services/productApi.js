import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: Config.baseurl }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => 'products',
            providesTags: ['Products'],
        }),
        getProduct: builder.query({
            query: (id) => `products/${id}`,
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: 'products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: (product) => ({
                url: `products/${product.productID}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        adjustStock: builder.mutation({
            query: ({ productId, data }) => ({
                url: `products/${productId}/adjust-stock`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        getInventoryLogs: builder.query({
            query: (productId) => `products/${productId}/inventory-logs`,
        })
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAdjustStockMutation,
    useGetInventoryLogsQuery
} = productApi;
