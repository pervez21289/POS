import React, { useState } from 'react';
import {
    Typography, Button, Box, Paper, Stack, Chip
} from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem
} from '@mui/x-data-grid';
import {
    useGetUsersQuery,
    useDeleteUserMutation
} from './../../services/userAPI';
import UserForm from './UserForm';
import { useDispatch } from 'react-redux';
import { setDrawerComponent } from "./../../store/reducers/drawer";


export default function UserManagement() {
    const { data: users = [], refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();
    //const handleEdit = (user) => setSelectedUser(user);
    const handleDelete = async (id) => {
        await deleteUser(id);
        refetch();
    };


    const handleEdit = async (row) => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: UserForm,
                drawerProps: {
                    editUser: row
                },
                drawerOpen: true
            })
        );
    };

    const columns = [
       /* { field: 'userId', headerName: 'ID', width: 70 },*/
        { field: 'firstName', headerName: 'Name', width: 150 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'companyID', headerName: 'Company ID', width: 120 },
        {
            field: 'roleNames',
            headerName: 'Roles',
            width: 300,
            renderCell: (params) => {
                const roles = typeof params.value === 'string'
                    ? params.value.split(',').map(r => r.trim())
                    : params.value;

                return (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {roles?.map((role, idx) => (
                            <Chip key={idx} label={role} size="small" color="primary" />
                        ))}
                    </Stack>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem
                    label="Edit"
                    showInMenu
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    label="Delete"
                    showInMenu
                    onClick={() => handleDelete(params.row.userId)}
                />
            ]
        }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>User Management</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">User List</Typography>
                <Button variant="contained" onClick={() => handleEdit(null)}>
                    Create New User
                </Button>
            </Stack>

            <Paper elevation={1} sx={{ height: 500 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Box>
    );
}
