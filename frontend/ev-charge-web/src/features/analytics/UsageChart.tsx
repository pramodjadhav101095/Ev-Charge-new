import React from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

interface UsageChartProps {
    data: any[];
}

const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Charging Activity Trend</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Sessions and energy consumption over time</Typography>

            <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            type="monotone"
                            dataKey="sessions"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="energyKwh"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorEnergy)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default UsageChart;
