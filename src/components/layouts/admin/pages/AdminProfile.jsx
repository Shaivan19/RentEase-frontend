import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Tabs } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

const AdminProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get('/admin/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setAdminData(response.data.admin);
      form.setFieldsValue({
        name: response.data.admin.name,
        email: response.data.admin.email,
      });
    } catch (error) {
      message.error('Failed to fetch admin profile');
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      await axios.put(
        '/admin/profile',
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      message.success('Profile updated successfully');
      fetchAdminProfile();
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      await axios.put(
        '/admin/change-password',
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      message.success('Password changed successfully');
    } catch (error) {
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Admin Profile" className="max-w-2xl mx-auto">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile Information" key="1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              className="max-w-md mx-auto"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Change Password" key="2">
            <Form
              layout="vertical"
              onFinish={handleChangePassword}
              className="max-w-md mx-auto"
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminProfile; 