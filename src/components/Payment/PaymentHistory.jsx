import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const PaymentHistory = ({ userType, userId }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, [userType, userId]);

    const fetchPayments = async () => {
        try {
            const { data } = await axios.get(`/api/payments/history/${userType}/${userId}`);
            setPayments(data.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading payment history...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Property</th>
                            <th className="px-6 py-3 text-left">Type</th>
                            <th className="px-6 py-3 text-left">Amount</th>
                            <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-b">
                                <td className="px-6 py-4">
                                    {format(new Date(payment.paymentDate), 'PP')}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.property.name}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.paymentType}
                                </td>
                                <td className="px-6 py-4">
                                    ₹{payment.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        payment.paymentStatus === 'COMPLETED' 
                                            ? 'bg-green-100 text-green-800'
                                            : payment.paymentStatus === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {payment.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory; 