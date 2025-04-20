import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Box, useTheme } from "@mui/material";
import { formatToRupees } from "../../../../utils/Currency";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 1,
          borderRadius: 1,
          boxShadow: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ color: "text.secondary", mb: 0.5 }}>{label}</Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            <Box>Earnings: {formatToRupees(payload[0].value)}</Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
            <Box>Target: {formatToRupees(payload[1].value)}</Box>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
};

const EarningsChart = ({ data: initialData }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(initialData);

  // Format the currency for Y-axis ticks
  const formatYAxis = (value) => formatToRupees(value);

  // Add event listener for property status updates to refresh chart data
  useEffect(() => {
    const handlePropertyStatusUpdate = (event) => {
      console.log('Property status updated event received in EarningsChart:', event.detail);
      if (event.detail && event.detail.earnings) {
        // Update the chart data with new earnings
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
        
        setChartData(prevData => {
          const newData = [...prevData];
          const currentMonthIndex = newData.findIndex(item => item.month === currentMonth);
          
          if (currentMonthIndex !== -1) {
            // Update existing month's earnings
            newData[currentMonthIndex] = {
              ...newData[currentMonthIndex],
              earnings: newData[currentMonthIndex].earnings + event.detail.earnings
            };
          } else {
            // Add new month's data
            newData.push({
              month: currentMonth,
              earnings: event.detail.earnings,
              target: newData[0]?.target || 0 // Use the same target as other months
            });
          }
          
          return newData;
        });
      }
    };

    window.addEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('propertyStatusUpdated', handlePropertyStatusUpdate);
    };
  }, []);

  // Update chart data when initialData changes
  useEffect(() => {
    setChartData(initialData);
  }, [initialData]);

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.1} />
              <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.divider}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.secondary }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="earnings"
            stroke={theme.palette.primary.main}
            fillOpacity={1}
            fill="url(#colorEarnings)"
            strokeWidth={2}
            dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke={theme.palette.success.main}
            fillOpacity={1}
            fill="url(#colorTarget)"
            strokeWidth={2}
            dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default EarningsChart;