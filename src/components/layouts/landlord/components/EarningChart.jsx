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
import { Box, useTheme, Alert, Snackbar } from "@mui/material";
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
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  // Format the currency for Y-axis ticks
  const formatYAxis = (value) => formatToRupees(value);

  // Add event listener for payment updates
  useEffect(() => {
    const handlePaymentUpdate = (event) => {
      console.log('Payment received in EarningsChart:', event.detail);
      try {
        if (event.detail && event.detail.amount) {
          const currentDate = new Date();
          const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
          
          setChartData(prevData => {
            if (!prevData || !Array.isArray(prevData)) {
              setError('Invalid chart data format');
              setShowError(true);
              return prevData;
            }

            const newData = [...prevData];
            const currentMonthIndex = newData.findIndex(item => item.month === currentMonth);
            
            if (currentMonthIndex !== -1) {
              // Update existing month's earnings
              newData[currentMonthIndex] = {
                ...newData[currentMonthIndex],
                earnings: newData[currentMonthIndex].earnings + event.detail.amount
              };
            } else {
              // Add new month's data
              newData.push({
                month: currentMonth,
                earnings: event.detail.amount,
                target: newData[0]?.target || 0 // Use the same target as other months
              });
            }
            
            console.log('Updated chart data:', newData);
            return newData;
          });
        } else {
          setError('Invalid payment data received');
          setShowError(true);
        }
      } catch (err) {
        console.error('Error updating chart data:', err);
        setError('Failed to update earnings chart');
        setShowError(true);
      }
    };

    window.addEventListener('paymentReceived', handlePaymentUpdate);
    
    return () => {
      window.removeEventListener('paymentReceived', handlePaymentUpdate);
    };
  }, []);

  // Update chart data when initialData changes
  useEffect(() => {
    try {
      console.log('Initial data changed:', initialData);
      if (!initialData || !Array.isArray(initialData)) {
        setError('Invalid initial data format');
        setShowError(true);
        return;
      }
      
      // Ensure we have data for all months
      const currentMonth = new Date().getMonth();
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2023, i);
        return date.toLocaleString('default', { month: 'short' });
      });
      
      const completeData = months.map(month => {
        const existingMonth = initialData.find(item => item.month === month);
        return existingMonth || {
          month,
          earnings: 0,
          target: initialData[0]?.target || 0
        };
      });
      
      console.log('Setting chart data:', completeData);
      setChartData(completeData);
    } catch (err) {
      console.error('Error setting initial chart data:', err);
      setError('Failed to initialize earnings chart');
      setShowError(true);
    }
  }, [initialData]);

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      {error && (
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
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