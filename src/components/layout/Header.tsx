import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { CodeOutlined, UserOutlined, BookOutlined, ToolOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/userStore';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();

  const menuItems = [
    { key: '/', icon: <CodeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/paths', icon: <BookOutlined />, label: <Link to="/paths">学习路径</Link> },
    { key: '/tools', icon: <ToolOutlined />, label: <Link to="/tools">工具箱</Link> },
    { key: '/labs', icon: <ExperimentOutlined />, label: <Link to="/labs">实验平台</Link> },
    { key: '/community', icon: <UserOutlined />, label: <Link to="/community">社区</Link> },
  ];

  const userMenuItems = [
    { key: 'profile', label: <Link to="/profile">个人主页</Link> },
    { key: 'settings', label: <Link to="/profile/settings">账号设置</Link> },
    { type: 'divider' as const },
    { key: 'logout', label: '退出登录', danger: true },
  ];

  // 匹配当前选中菜单
  const selectedKey = '/' + location.pathname.split('/')[1];
  const activeKey = selectedKey === '/' ? '/' : (location.pathname === '/' ? '/' : selectedKey);

  return (
    <AntHeader className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-500">
          <CodeOutlined className="text-2xl" />
          <span className="text-xl font-bold tracking-tight">IT运维通</span>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          items={menuItems}
          className="min-w-[400px] border-none font-medium"
        />
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-slate-100">
              <Avatar src={user.avatar} icon={<UserOutlined />} className="bg-primary-100 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <Link to="/login" className="text-primary-600 hover:underline">登录 / 注册</Link>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
