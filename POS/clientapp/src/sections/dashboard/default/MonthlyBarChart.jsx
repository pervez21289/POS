import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import SalesService from './../../../services/SaleService';

export default function MonthlyBarChart() {
    const theme = useTheme();
    const [productSales, setProductSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SalesService.GetTopSellingProducts();
                setProductSales(data);
            } catch (error) {
                console.error('Failed to fetch product sales:', error);
                setProductSales([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading chart data…</div>;
    if (!productSales.length) return <div>No sales data available</div>;

    // Show ALL products
    const fullNames = productSales.map((item) => item.ProductName);

    const displayLabels = fullNames.map((name) =>
        name.length > 25 ? name.slice(0, 25) + '…' : name
    );

    const unitsSold = productSales.map(
        (item) => item.TotalUnitsSold
    );

    const axisFontStyle = {
        fontSize: 14,
        fill: theme.palette.text.secondary,
    };

    return (
        <BarChart
            layout="horizontal"
            height={Math.max(500, productSales.length * 35)}
            series={[
                {
                    data: unitsSold,
                    label: 'Units Sold',
                    valueFormatter: (value) => `${value} units`,
                },
            ]}
            yAxis={[
                {
                    data: displayLabels,
                    scaleType: 'band',
                    width: 160,
                    tickLabelStyle: axisFontStyle,
                    disableLine: true,
                    disableTicks: true,
                },
            ]}
            xAxis={[
                {
                    label: 'Units Sold',
                    tickLabelStyle: axisFontStyle,
                },
            ]}
            slotProps={{
                bar: {
                    rx: 5,
                    ry: 5,
                },
                tooltip: {
                    valueFormatter: (value, context) => {
                        const index = context?.dataIndex;

                        if (index !== undefined) {
                            return `${fullNames[index]}: ${value} units`;
                        }

                        return `${value} units`;
                    },
                },
            }}
            margin={{
                left:0,
                right: 30,
                top: 20,
                bottom: 50,
            }}
            colors={[theme.palette.info.light]}
            sx={{
                '& .MuiBarElement-root:hover': {
                    opacity: 0.6,
                },
            }}
        />
    );
}