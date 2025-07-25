import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography
} from '@mui/material';

// charts
import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';


export default function SalesChart({ MonthlySummary }) {
    const theme = useTheme();

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [showIncome, setShowIncome] = useState(true);
    const [showCostOfSales, setShowCostOfSales] = useState(true);

    const primaryColor = theme.palette.primary.main;
    const warningColor = theme.palette.warning.main;
    const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

    // Fetch chart data from API
    useEffect(() => {

        if (MonthlySummary) {
            const labels = MonthlySummary?.map(d => d.Month);
            const income = MonthlySummary?.map(d => d.IncomeInThousands);
            const costOfSales = MonthlySummary?.map(d => d.CostOfSalesInThousands);

            const result = {
                series: [
                    { label: "Income", data: income },
                    { label: "Cost of Sales", data: costOfSales }
                ]
            };

            setLabels(labels);
            setData(
                result.series.map(series => ({
                    ...series,
                    color: series.label === 'Income' ? warningColor : primaryColor,
                    valueFormatter: (value) => `$ ${value} Thousands`
                }))
            );

        }

    }, [MonthlySummary]);

    return data&& (
        <MainCard sx={{ mt: 1 }} content={false}>
            <Box sx={{ p: 2.5, pb: 0 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Net Profit
                        </Typography>
                        <Typography variant="h4">$1560</Typography>
                    </Box>

                    <FormGroup>
                        <Stack direction="row">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showIncome}
                                        onChange={() => setShowIncome(!showIncome)}
                                        sx={{ '&.Mui-checked': { color: warningColor }, '&:hover': { backgroundColor: alpha(warningColor, 0.08) } }}
                                    />
                                }
                                label="Income"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showCostOfSales}
                                        onChange={() => setShowCostOfSales(!showCostOfSales)}
                                        sx={{ '&.Mui-checked': { color: primaryColor } }}
                                    />
                                }
                                label="Cost of Sales"
                            />
                        </Stack>
                    </FormGroup>
                </Stack>

                <BarChart
                    hideLegend
                    height={380}
                    grid={{ horizontal: true }}
                    xAxis={[{
                        id: 'sales-x-axis',
                        data: labels,
                        scaleType: 'band',
                        tickLabelStyle: { ...axisFontStyle, fontSize: 12 }
                    }]}
                    yAxis={[{
                        disableLine: true,
                        disableTicks: true,
                        tickLabelStyle: axisFontStyle
                    }]}
                    series={data
                        .filter(s => (s.label === 'Income' && showIncome) || (s.label === 'Cost of Sales' && showCostOfSales))
                        .map(s => ({ ...s, type: 'bar' }))}
                    slotProps={{ bar: { rx: 5, ry: 5 }, tooltip: { trigger: 'item' } }}
                    axisHighlight={{ x: 'none' }}
                    margin={{ top: 30, left: -5, bottom: 25, right: 10 }}
                    sx={{
                        '& .MuiBarElement-root:hover': { opacity: 0.6 },
                        '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': {
                            stroke: theme.palette.divider
                        }
                    }}
                />
            </Box>
        </MainCard>
    );
}
