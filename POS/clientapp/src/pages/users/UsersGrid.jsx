import React, { useState } from 'react';
import {
    Typography, Button, Box, Paper, Stack, Chip, Card, CardContent, CardActions, IconButton, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit, Delete } from '@mui/icons-material';
import {
    DataGrid,
    GridActionsCellItem
} from '@mui/x-data-grid';
import {
    useGetUsersQuery,
    useDeleteUserMutation
} from './../../services/userAPI';
import UserForm from './UserForm';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerComponent } from "./../../store/reducers/drawer";

export default function UserManagement() {
    const { data: users = [], refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.users);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDelete = async (id) => {
        await deleteUser(id);
        refetch();
    };

    const handleEdit = (user) => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: UserForm,
                drawerProps: { editUser: user },
                drawerOpen: true
            })
        );
    };



    if (userDetails?.role?.indexOf('SuperAdmin') === -1) return (<>Unauthorized</>)


    const columns = [
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
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        alignItems="center"
                        sx={{ width: '100%' }}
                    >
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

            {isMobile ? (
                <Stack spacing={2}>
                    {users.map((user) => (
                        <Card key={user.userId} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1"><strong>{user.firstName}</strong></Typography>
                                <Typography variant="body2">📞 {user.mobile}</Typography>
                                <Typography variant="body2">📧 {user.email}</Typography>
                                <Typography variant="body2">🏢 Company ID: {user.companyID}</Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                    alignItems="center"
                                    sx={{ mt: 1 }}
                                >
                                    {(typeof user.roleNames === 'string'
                                        ? user.roleNames.split(',').map(r => r.trim())
                                        : user.roleNames || []).map((role, idx) => (
                                            <Box key={idx} sx={{ mb: 0.5 }}>
                                                <Chip label={role} size="small" color="primary" />
                                            </Box>
                                        ))}
                                </Stack>

                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleEdit(user)} aria-label="edit">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(user.userId)} aria-label="delete">
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Paper elevation={1} sx={{ height: 500 }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        getRowId={(row) => row.userId}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Paper>
            )}
        </Box>
    );
}
