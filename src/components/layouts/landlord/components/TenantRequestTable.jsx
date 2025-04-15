import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  Avatar,
  Stack,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <PendingIcon />;
    case "approved":
      return <CheckCircleIcon />;
    case "rejected":
      return <CancelIcon />;
    default:
      return null;
  }
};

const TenantRequestsTable = ({ requests = [] }) => {
  const theme = useTheme();

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/tenant-requests/${requestId}`, { status: newStatus });
      // Refresh the parent component's data
      window.location.reload();
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 0,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Tenant
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Property
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Date
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Status
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((req) => (
            <TableRow
              key={req._id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    {req.tenant.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight={500}>
                    {req.tenant.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {req.property.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(req.createdAt).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={req.status}
                    color={getStatusColor(req.status)}
                    size="small"
                    icon={getStatusIcon(req.status)}
                    sx={{
                      borderRadius: 1,
                      "& .MuiChip-icon": {
                        fontSize: 16,
                      },
                    }}
                  />
                  {req.status.toLowerCase() === "pending" && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Approve">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleStatusChange(req._id, "approved")}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleStatusChange(req._id, "rejected")}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary">
                  No tenant requests found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TenantRequestsTable;