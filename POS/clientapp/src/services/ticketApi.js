﻿import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from "./config";

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
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
    tagTypes: ['Ticket'],
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: () => 'tickets',
            providesTags: ['Ticket'],
        }),
        createTicket: builder.mutation({
            query: (ticket) => ({
                url: 'tickets',
                method: 'POST',
                body: ticket,
            }),
            invalidatesTags: ['Ticket']
        }),
    }),
});

export const { useGetTicketsQuery, useCreateTicketMutation } = ticketApi;
