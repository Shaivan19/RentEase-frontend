import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Payment,
  CreditCard,
  AccountBalance,
  Receipt,
  CheckCircle,
  Error,
  Schedule,
  Info,
} from '@mui/icons-material';

const paymentMethods = [
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: <CreditCard />,
    description: 'Pay securely with your card',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: <AccountBalance />,
    description: 'Transfer directly from your bank account',
  },
];

const paymentHistory = [
  {
    id: 1,
    date: '2024-03-25',
    amount: 2500,
    method: 'Credit Card',
    status: 'Completed',
    reference: 'PAY-123456',
  },
  {
    id: 2,
    date: '2024-02-25',
    amount: 2500,
    method: 'Bank Transfer',
    status: 'Completed',
    reference: 'PAY-123455',
  },
  {
    id: 3,
    date: '2024-01-25',
    amount: 2500,
    method: 'Credit Card',
    status: 'Completed',
    reference: 'PAY-123454',
  },
];

const Payment = ({ propertyId, amount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [orderId, setOrderId] = useState(null);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentDialogOpen(true);
  };

  const handleFormChange = (event) => {
    setPaymentForm({
      ...paymentForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add payment processing logic here
    setPaymentDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle />;
      case 'Pending':
        return <Schedule />;
      case 'Failed':
        return <Error />;
      default:
        return null;
    }
  };

  const initializePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:1906/api/payments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          amount,
          paymentType: 'RENT'
        })
      });

      const data = await response.json();

      if (response.ok) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: "INR",
          name: "RentEase",
          description: "Property Payment",
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyResponse = await fetch('http://localhost:1906/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(response)
              });

              const verifyData = await verifyResponse.json();

              if (verifyResponse.ok) {
                alert('Payment successful!');
                // Handle successful payment (e.g., update UI, redirect)
              } else {
                alert(verifyData.message);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Error verifying payment. Please contact support.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Error initializing payment. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Rent Payment
      </Typography>
      <Typography color="text.secondary" paragraph>
        Manage your rent payments and view payment history
      </Typography>

      {/* Payment Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Monthly Rent</Typography>
                <Typography variant="h6">₹{amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Due Date</Typography>
                <Typography>April 1, 2024</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Status</Typography>
                <Chip
                  label="Pending"
                  color="warning"
                  icon={<Schedule />}
                />
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h5" color="primary">
                  ₹{amount}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            <Stack spacing={2}>
              {paymentMethods.map((method) => (
                <Paper
                  key={method.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedMethod === method.id
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {method.icon}
                    <Box>
                      <Typography variant="subtitle1">
                        {method.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment History */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Payment History
      </Typography>
      <Grid container spacing={3}>
        {paymentHistory.map((payment) => (
          <Grid item xs={12} key={payment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      ₹{payment.amount}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status)}
                        size="small"
                        icon={getStatusIcon(payment.status)}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(payment.date).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {payment.method}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ref: {payment.reference}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Receipt />}
                >
                  View Receipt
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={paymentForm.cardNumber}
                onChange={handleFormChange}
                required
                placeholder="1234 5678 9012 3456"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handleFormChange}
                    required
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={paymentForm.cvv}
                    onChange={handleFormChange}
                    required
                    placeholder="123"
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="name"
                value={paymentForm.name}
                onChange={handleFormChange}
                required
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Amount
                </Typography>
                <Typography variant="h5" color="primary">
                  ₹{amount}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<Payment />}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payment; 