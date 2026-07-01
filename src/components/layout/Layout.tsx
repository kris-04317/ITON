import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout className="min-h-screen bg-slate-50">
      <Header />
      <Content className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
