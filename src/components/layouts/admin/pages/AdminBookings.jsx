import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Modal, message, Tag } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const columns = [
    {
      title: 'Property',
      dataIndex: 'property',
      key: 'property',
      render: (property) => property.title,
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant',
      key: 'tenant',
      render: (tenant) => tenant.name,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'confirmed') color = 'green';
        else if (status === 'pending') color = 'orange';
        else if (status === 'cancelled') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewBooking(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirmBooking(record)}
              >
                Confirm
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancelBooking(record)}
              >
                Cancel
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/bookings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setBookings(response.data.bookings);
    } catch (error) {
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleConfirmBooking = async (booking) => {
    try {
      await axios.put(
        `/admin/bookings/${booking._id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      message.success('Booking confirmed successfully');
      fetchBookings();
    } catch (error) {
      message.error('Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      await axios.put(
        `/admin/bookings/${booking._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      message.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      message.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.property.title.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.tenant.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Search
          placeholder="Search bookings"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="all">All Status</Option>
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBookings}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Property:</strong> {selectedBooking.property.title}</p>
                <p><strong>Location:</strong> {selectedBooking.property.location}</p>
                <p><strong>Price:</strong> ${selectedBooking.property.price}/month</p>
              </div>
              <div>
                <p><strong>Tenant:</strong> {selectedBooking.tenant.name}</p>
                <p><strong>Email:</strong> {selectedBooking.tenant.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.tenant.phone}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>Booking Period:</strong></p>
              <p>From: {new Date(selectedBooking.startDate).toLocaleDateString()}</p>
              <p>To: {new Date(selectedBooking.endDate).toLocaleDateString()}</p>
            </div>
            <div className="mt-4">
              <p><strong>Status:</strong> 
                <Tag color={selectedBooking.status === 'confirmed' ? 'green' : 
                          selectedBooking.status === 'pending' ? 'orange' : 'red'}>
                  {selectedBooking.status.toUpperCase()}
                </Tag>
              </p>
              <p><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</p>
              <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBookings; 