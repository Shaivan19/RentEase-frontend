import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Modal, message } from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getAllUsers, getAdminToken } from '../../../../utils/adminAuth';

const { Search } = Input;
const { Option } = Select;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userType, setUserType] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status || 'active'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
          >
            View
          </Button>
          {record.status === 'active' ? (
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => handleBlockUser(record)}
            >
              Block
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleUnblockUser(record)}
            >
              Unblock
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log('Users response:', response); // Debug log
      
      if (response && response.users) {
        // Combine tenants and landlords into a single array
        const allUsers = [
          ...(response.users.tenants || []).map(tenant => ({ ...tenant, userType: 'Tenant' })),
          ...(response.users.landlords || []).map(landlord => ({ ...landlord, userType: 'Landlord' }))
        ];
        
        setUsers(allUsers);
      } else {
        console.error('Invalid response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleBlockUser = async (user) => {
    try {
      const token = getAdminToken();
      await fetch(`/admin/users/${user._id}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      message.success('User blocked successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      message.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      const token = getAdminToken();
      await fetch(`/admin/users/${user._id}/unblock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      message.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      message.error('Failed to unblock user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = userType === 'all' || user.userType === userType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Search
          placeholder="Search users"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={(value) => setUserType(value)}
        >
          <Option value="all">All Users</Option>
          <Option value="Landlord">Landlords</Option>
          <Option value="Tenant">Tenants</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>Name:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>User Type:</strong> {selectedUser.userType}</p>
            <p><strong>Status:</strong> {selectedUser.status || 'active'}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers; 