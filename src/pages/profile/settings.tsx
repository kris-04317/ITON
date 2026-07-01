import { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Divider, Avatar, Upload, Space, Switch, Select } from 'antd';
import { UserOutlined, SaveOutlined, UploadOutlined, LockOutlined, BellOutlined, MoonOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types/user';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useUserStore();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleSaveProfile = async (values: any) => {
    try {
      updateUser(values);
      message.success('个人信息已保存');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSavePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('修改失败');
    }
  };

  const handleLogout = () => {
    logout();
    message.success('已退出登录');
    navigate('/');
  };

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('请上传图片文件');
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setAvatarUrl(url);
        updateUser({ avatar: url });
      };
      reader.readAsDataURL(file);
      return false;
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="!mb-2">个人设置</Title>
        <Text className="text-gray-500">管理您的个人信息和偏好设置</Text>
      </div>

      <div className="space-y-6">
        <Card title="个人信息">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar size={120} src={avatarUrl || user?.avatar} icon={<UserOutlined />} />
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
            <Form
              form={form}
              layout="vertical"
              className="flex-1"
              initialValues={(user ?? undefined) as User | undefined}
              onFinish={handleSaveProfile}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item label="手机号" name="phone">
                  <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item label="职位" name="role">
                  <Select placeholder="请选择职位">
                    <Option value="运维工程师">运维工程师</Option>
                    <Option value="开发工程师">开发工程师</Option>
                    <Option value="运维主管">运维主管</Option>
                    <Option value="学生">学生</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                </Form.Item>
              </div>
              <Form.Item label="个性签名" name="signature">
                <TextArea rows={4} placeholder="介绍一下自己..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                  保存信息
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <Card title="修改密码" extra={<LockOutlined />}>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleSavePassword}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="当前密码"
                name="currentPassword"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度至少6位' }
                ]}
              >
                <Input.Password placeholder="请输入新密码" />
              </Form.Item>
              <Form.Item
                label="确认新密码"
                name="confirmPassword"
                rules={[{ required: true, message: '请确认新密码' }]}
              >
                <Input.Password placeholder="请再次输入新密码" />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="偏好设置" extra={<BellOutlined />}>
          <Space direction="vertical" className="w-full">
            <div className="flex items-center justify-between py-2">
              <div>
                <Text strong>深色模式</Text>
                <Text className="text-gray-500 block text-sm">切换深色/浅色主题</Text>
              </div>
              <Switch checkedChildren={<MoonOutlined />} unCheckedChildren="浅色" />
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between py-2">
              <div>
                <Text strong>邮件通知</Text>
                <Text className="text-gray-500 block text-sm">接收学习进度提醒</Text>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between py-2">
              <div>
                <Text strong>系统消息</Text>
                <Text className="text-gray-500 block text-sm">接收平台更新和活动通知</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </Space>
        </Card>

        <Card title="危险操作" className="border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <Text strong className="text-red-600">退出登录</Text>
              <Text className="text-gray-500 block text-sm">退出当前账号，需要重新登录</Text>
            </div>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
