import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentForm = ({ amount, paymentType, tenantId, landlordId, propertyId, description }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const res = await initializeRazorpay();

            if (!res) {
                toast.error('Razorpay SDK failed to load');
                return;
            }

            const { data } = await axios.post('/api/payments/create', {
                amount,
                paymentType,
                tenantId,
                landlordId,
                propertyId,
                description
            });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "RentEase",
                description: "Property Payment",
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post('/api/payments/verify', response);
                        toast.success('Payment successful!');
                        navigate('/payment-success', { 
                            state: { paymentDetails: data.payment } 
                        });
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: "Tenant Name",
                    email: "tenant@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error('Error initiating payment');
            console.error('Payment error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
            <div className="mb-4">
                <p className="text-gray-600">Amount: ₹{amount}</p>
                <p className="text-gray-600">Payment Type: {paymentType}</p>
                <p className="text-gray-600">Description: {description}</p>
            </div>
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default PaymentForm; 