import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, CodeOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: `user_${Date.now()}`,
        username: values.username,
        email: values.email,
        avatar: '',
        signature: '准备好成为运维大佬了！',
        level: 1,
        exp: 0,
        streakDays: 1,
        totalStudyTime: 0,
        createdAt: new Date().toISOString(),
      });
      message.success('注册成功，欢迎加入 IT运维通！');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
      <Card className="w-full max-w-md border-none shadow-xl rounded-2xl" bodyStyle={{ padding: '40px' }}>
        <div className="mb-8 text-center">
          <CodeOutlined className="text-5xl text-primary-500 mb-4" />
          <Title level={3} className="!mb-2">加入 IT运维通</Title>
          <Text className="text-slate-500">开启你的运维专家成长之路</Text>
        </div>

        <Form
          name="register"
          size="large"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input prefix={<UserOutlined className="text-slate-400" />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined className="text-slate-400" />} placeholder="邮箱地址" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined className="text-slate-400" />} placeholder="设置密码" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-slate-400" />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" className="w-full bg-primary-600" loading={loading}>
              注册账号
            </Button>
          </Form.Item>
        </Form>

        <Divider className="text-slate-400 text-sm">已经有账号了？</Divider>

        <div className="text-center">
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            直接登录
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
