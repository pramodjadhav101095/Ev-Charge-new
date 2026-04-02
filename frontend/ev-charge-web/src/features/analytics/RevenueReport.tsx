import React from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell
} from 'recharts';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface RevenueReportProps {
    data: any[];
}

const RevenueReport: React.FC<RevenueReportProps> = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">Revenue Analysis</Typography>
                    <Typography variant="body2" color="textSecondary">Revenue breakdown by station or type</Typography>
                </Box>
                <Box>
                    <IconButton size="small"><MoreVertIcon /></IconButton>
                </Box>
            </Box>

            <Box sx={{ width: '100%', height: 400, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<DownloadIcon />} size="small">Export CSV</Button>
                <Button variant="contained" startIcon={<DownloadIcon />} size="small">Download PDF</Button>
            </Box>
        </Paper>
    );
};

export default RevenueReport;
