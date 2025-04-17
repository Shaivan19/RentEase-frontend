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
  Stack,
  Avatar,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Event,
  AccessTime,
  LocationOn,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

const TenantRequestTable = ({ requests, onUpdate }) => {
  const theme = useTheme();

  const handleConfirmVisit = async (visitId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.put(`/visit-properties/confirm/${visitId}`, {}, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        toast.success("Visit confirmed successfully");
        if (typeof onUpdate === 'function') {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Error confirming visit:", error);
      toast.error(error.response?.data?.message || "Failed to confirm visit");
    }
  };

  const handleRejectVisit = async (visitId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.put(`/visit-properties/reject/${visitId}`, {}, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        toast.success("Visit rejected successfully");
        if (typeof onUpdate === 'function') {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Error rejecting visit:", error);
      toast.error(error.response?.data?.message || "Failed to reject visit");
    }
  };

  const getStatusChip = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return <Chip label="Scheduled" color="primary" size="small" />;
      case "rescheduled":
        return <Chip label="Rescheduled" color="warning" size="small" />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" />;
      case "confirmed":
        return <Chip label="Confirmed" color="success" size="small" />;
      case "rejected":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return <Event color="primary" fontSize="small" />;
      case "rescheduled":
        return <Schedule color="warning" fontSize="small" />;
      case "cancelled":
        return <Cancel color="error" fontSize="small" />;
      case "confirmed":
        return <CheckCircle color="success" fontSize="small" />;
      case "rejected":
        return <Cancel color="error" fontSize="small" />;
      default:
        return <Event color="default" fontSize="small" />;
    }
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tenant</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>Visit Details</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary">
                  No visit requests found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow
                key={request.id}
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
                      {request.tenantName?.charAt(0) || "T"}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {request.tenantName || "Unknown Tenant"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.tenantEmail || ""}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {request.propertyName || "Unknown Property"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn color="primary" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {request.address || "Location not available"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Event color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {new Date(request.visitDate).toLocaleDateString()}
                    </Typography>
                    <AccessTime color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {request.visitTime || "No time specified"}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {getStatusIcon(request.status)}
                    {getStatusChip(request.status)}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {request.status.toLowerCase() === "scheduled" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleConfirmVisit(request.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleRejectVisit(request.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TenantRequestTable;