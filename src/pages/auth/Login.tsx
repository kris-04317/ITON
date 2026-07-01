import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, CodeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      if (values.username === 'admin' && values.password === '123456') {
        setUser({
          id: 'user_admin',
          username: '系统管理员',
          email: 'admin@opsmaster.com',
          avatar: '',
          signature: '探索技术的无限可能',
          level: 10,
          exp: 5000,
          streakDays: 30,
          totalStudyTime: 5000,
          createdAt: '2023-01-01',
        });
        message.success('登录成功！');
        navigate('/');
      } else {
        // 默认也让它登录成功，方便演示
        setUser({
          id: 'user_test',
          username: values.username || '测试用户',
          email: 'test@example.com',
          avatar: '',
          signature: '从0开始的运维之路，加油！',
          level: 1,
          exp: 0,
          streakDays: 1,
          totalStudyTime: 0,
          createdAt: new Date().toISOString(),
        });
        message.success('登录成功！');
        navigate('/');
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
      <Card className="w-full max-w-md border-none shadow-xl rounded-2xl" bodyStyle={{ padding: '40px' }}>
        <div className="mb-8 text-center">
          <CodeOutlined className="text-5xl text-primary-500 mb-4" />
          <Title level={3} className="!mb-2">欢迎回到 IT运维通</Title>
          <Text className="text-slate-500">登录你的账号以继续学习</Text>
        </div>

        <Form
          name="login"
          size="large"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名/邮箱/手机号' }]}
          >
            <Input prefix={<UserOutlined className="text-slate-400" />} placeholder="用户名 / 邮箱 / 手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined className="text-slate-400" />} placeholder="密码" />
          </Form.Item>

          <div className="mb-6 flex items-center justify-between text-sm">
            <Text className="text-slate-500">
              测试账号：admin / 123456
            </Text>
            <a className="text-primary-500 hover:text-primary-400">忘记密码？</a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-primary-600" loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>

        <Divider className="text-slate-400 text-sm">还没有账号？</Divider>

        <div className="text-center">
          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
            立即注册新账号
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
