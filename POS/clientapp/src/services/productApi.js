



import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: Config.baseurl ,
         prepareHeaders: (headers, { getState }) => {
            const token = getState()?.users?.userDetails?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (search) => `products?search=${search}`,
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
        }),
        uploadProductImage: builder.mutation({
            query: ({ productId, file }) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: `products/${productId}/image`,
                    method: 'POST',
                    body: formData,
                    // RTK Query will automatically set Content-Type to multipart/form-data when body is FormData
                };
            },
            invalidatesTags: ['Products'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAdjustStockMutation,
    useGetInventoryLogsQuery,
    useUploadProductImageMutation
} = productApi;
