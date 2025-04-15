import React from "react";
import { Grid, Paper, Typography, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatsCards = ({ stats }) => {
  const theme = useTheme();

  return stats.map((stat, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            height: "100%",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              boxShadow: theme.shadows[4],
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              opacity: 0.05,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 25%, transparent 25%),
                linear-gradient(-45deg, ${theme.palette.primary.main} 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, ${theme.palette.primary.main} 75%),
                linear-gradient(-45deg, transparent 75%, ${theme.palette.primary.main} 75%)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                }}
              >
                {stat.icon}
              </Box>
              {stat.trend && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: stat.trendColor,
                  }}
                >
                  {stat.trend.startsWith("+") ? (
                    <TrendingUpIcon fontSize="small" />
                  ) : (
                    <TrendingDownIcon fontSize="small" />
                  )}
                  <Typography variant="body2" fontWeight={600}>
                    {stat.trend}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography
              variant="h6"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              {stat.title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              color="text.primary"
              sx={{ mb: 1 }}
            >
              {stat.value}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Grid>
  ));
};

export default StatsCards;