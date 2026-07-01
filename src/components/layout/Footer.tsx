import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter className="bg-white text-center text-slate-500 shadow-inner">
      IT运维通 (OpsMaster) ©{new Date().getFullYear()} - 专为IT职场新人打造的运维学习平台
    </AntFooter>
  );
};

export default Footer;
