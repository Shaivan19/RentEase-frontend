import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Modal, message, Tag, Form, InputNumber } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminToken } from '../../../../utils/adminAuth';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [form] = Form.useForm();

  const columns = [
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
      render: (status) => {
        let color = 'default';
        if (status === 'approved') color = 'green';
        else if (status === 'pending') color = 'orange';
        else if (status === 'rejected') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Landlord',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => owner?.username || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewProperty(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditProperty(record)}
          >
            Edit
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveProperty(record)}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectProperty(record)}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProperty(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      const response = await fetch('http://localhost:1909/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      console.log('Properties data:', data); // Debug log
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      message.error('Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setIsModalVisible(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    form.setFieldsValue({
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.type,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateProperty = async (values) => {
    try {
      const token = getAdminToken();
      const response = await fetch(`http://localhost:1909/admin/properties/${selectedProperty._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      message.success('Property updated successfully');
      setIsEditModalVisible(false);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      message.error('Failed to update property');
    }
  };

  const handleDeleteProperty = async (property) => {
    try {
      const token = getAdminToken();
      const response = await fetch(`http://localhost:1909/admin/properties/${property._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      message.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      message.error('Failed to delete property');
    }
  };

  const handleApproveProperty = async (property) => {
    try {
      const token = getAdminToken();
      const response = await fetch(`http://localhost:1909/admin/properties/${property._id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve property');
      }

      message.success('Property approved successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error approving property:', error);
      message.error('Failed to approve property');
    }
  };

  const handleRejectProperty = async (property) => {
    try {
      const token = getAdminToken();
      const response = await fetch(`http://localhost:1909/admin/properties/${property._id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject property');
      }

      message.success('Property rejected successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error rejecting property:', error);
      message.error('Failed to reject property');
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Search
          placeholder="Search properties"
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
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProperties}
        loading={loading}
        rowKey="_id"
      />

      {/* View Property Modal */}
      <Modal
        title="Property Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProperty && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Title:</strong> {selectedProperty.title}</p>
                <p><strong>Location:</strong> {selectedProperty.location}</p>
                <p><strong>Price:</strong> ${selectedProperty.price}/month</p>
                <p><strong>Type:</strong> {selectedProperty.type}</p>
                <p><strong>Status:</strong> 
                  <Tag color={selectedProperty.status === 'approved' ? 'green' : 
                            selectedProperty.status === 'pending' ? 'orange' : 'red'}>
                    {selectedProperty.status.toUpperCase()}
                  </Tag>
                </p>
              </div>
              <div>
                <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                <p><strong>Area:</strong> {selectedProperty.area} sq ft</p>
                <p><strong>Created At:</strong> {new Date(selectedProperty.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>Description:</strong></p>
              <p>{selectedProperty.description}</p>
            </div>
            <div className="mt-4">
              <p><strong>Landlord Details:</strong></p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {selectedProperty.owner?.username || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedProperty.owner?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedProperty.owner?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Joined:</strong> {selectedProperty.owner?.createdAt ? new Date(selectedProperty.owner.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <div className="mt-4">
                <p><strong>Images:</strong></p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProperty.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        title="Edit Property"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProperty}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the property title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the property description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the property location!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the property price!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="bedrooms"
            label="Bedrooms"
            rules={[{ required: true, message: 'Please input the number of bedrooms!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="bathrooms"
            label="Bathrooms"
            rules={[{ required: true, message: 'Please input the number of bathrooms!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="area"
            label="Area (sq ft)"
            rules={[{ required: true, message: 'Please input the property area!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Property Type"
            rules={[{ required: true, message: 'Please select the property type!' }]}
          >
            <Select>
              <Option value="apartment">Apartment</Option>
              <Option value="house">House</Option>
              <Option value="condo">Condo</Option>
              <Option value="townhouse">Townhouse</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProperties; 