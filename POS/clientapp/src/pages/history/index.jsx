import { useState } from "react";
import { Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetApiLogsQuery } from "../../services/userAPI"; // adjust path if needed

const ApiLogsTable = () => {
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { data = [], isLoading } = useGetApiLogsQuery({
        search,
        startDate,
        endDate,
    });

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "timestamp", headerName: "Timestamp", width: 180 },
        { field: "path", headerName: "Path", width: 200 },
        { field: "method", headerName: "Method", width: 100 },
        { field: "ipAddress", headerName: "IP", width: 150 },
        { field: "statusCode", headerName: "Status", width: 100 },
        { field: "durationMs", headerName: "Duration (ms)", width: 130 },
        { field: "userId", headerName: "User ID", width: 100 },
    ];

    return (
        <Box sx={{ height: 600, width: "100%", p: 2 }}>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="small"
                />
               
            </Box>

            <DataGrid
                rows={data}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.id}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
            />
        </Box>
    );
};

export default ApiLogsTable;
