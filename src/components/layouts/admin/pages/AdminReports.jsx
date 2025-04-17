import React, { useState, useEffect } from 'react';
import { Card, Button, DatePicker, Select, Table, Statistic, Row, Col, message } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [detailedData, setDetailedData] = useState([]);

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setStats(response.data.stats);
    } catch (error) {
      message.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedReport = async () => {
    if (!dateRange) {
      message.error('Please select a date range');
      return;
    }

    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      const response = await axios.get('/admin/reports/detailed', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: reportType,
        },
      });
      setDetailedData(response.data.data);
    } catch (error) {
      message.error('Failed to fetch detailed report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!dateRange) {
      message.error('Please select a date range');
      return;
    }

    try {
      const [startDate, endDate] = dateRange;
      const response = await axios.get('/admin/reports/download', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: reportType,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${moment().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Failed to download report');
    }
  };

  const columns = {
    bookings: [
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
        render: (date) => moment(date).format('YYYY-MM-DD'),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date) => moment(date).format('YYYY-MM-DD'),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => `$${amount}`,
      },
    ],
    properties: [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price) => `$${price}/month`,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format('YYYY-MM-DD'),
      },
    ],
    users: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Type',
        dataIndex: 'userType',
        key: 'userType',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format('YYYY-MM-DD'),
      },
    ],
  };

  return (
    <div className="p-6">
      <Card title="Reports Dashboard" className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Total Users" value={stats.totalUsers} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Properties" value={stats.totalProperties} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Bookings" value={stats.totalBookings} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix="$"
            />
          </Col>
        </Row>
      </Card>

      <Card title="Generate Report">
        <div className="flex gap-4 mb-6">
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            style={{ width: 300 }}
          />
          <Select
            value={reportType}
            style={{ width: 200 }}
            onChange={(value) => setReportType(value)}
          >
            <Option value="overview">Overview</Option>
            <Option value="bookings">Bookings</Option>
            <Option value="properties">Properties</Option>
            <Option value="users">Users</Option>
          </Select>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchDetailedReport}
            loading={loading}
          >
            Generate
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadReport}
            loading={loading}
          >
            Download
          </Button>
        </div>

        {detailedData.length > 0 && (
          <Table
            columns={columns[reportType] || columns.bookings}
            dataSource={detailedData}
            loading={loading}
            rowKey="_id"
          />
        )}
      </Card>
    </div>
  );
};

export default AdminReports; 