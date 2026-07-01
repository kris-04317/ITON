import React, { useState } from 'react';
import { Card, Input, Typography, Row, Col, Tag, Badge } from 'antd';
import { FolderOpenOutlined, ControlOutlined, WifiOutlined, FileTextOutlined, UserOutlined, DashboardOutlined, InboxOutlined, HddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { commandCategories } from '@/data/commands';
import { templates } from '@/data/templates';

const { Title, Text, Paragraph } = Typography;

// 图标映射映射字典
const iconMap: Record<string, React.ReactNode> = {
  FolderOpenOutlined: <FolderOpenOutlined />,
  ControlOutlined: <ControlOutlined />,
  WifiOutlined: <WifiOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  UserOutlined: <UserOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  InboxOutlined: <InboxOutlined />,
  HddOutlined: <HddOutlined />,
};

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    // 简单的搜索跳转逻辑，实际应用中可以跳转到全局搜索页
    if (value.trim()) {
      navigate(`/tools/commands?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* 头部搜索区 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center shadow-lg sm:p-12">
        <Title level={2} className="!mb-4 !text-white">运维工具箱</Title>
        <Paragraph className="!mb-8 text-slate-300 text-lg">
          工作中随时查，用完就走的效率工具集
        </Paragraph>
        <div className="mx-auto max-w-2xl">
          <Input.Search
            size="large"
            placeholder="搜索命令、工具、模板..."
            enterButton={<span className="px-4 font-medium">搜索</span>}
            className="shadow-md [&_.ant-input]:text-lg [&_.ant-btn]:bg-primary-500 [&_.ant-btn]:border-primary-500 hover:[&_.ant-btn]:bg-primary-400"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* 命令速查分类 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Title level={4} className="!mb-0 flex items-center gap-2">
            <span className="text-2xl">💻</span> 命令速查
          </Title>
          <a onClick={() => navigate('/tools/commands')} className="text-primary-600 hover:text-primary-500 cursor-pointer">查看全部</a>
        </div>
        <Row gutter={[16, 16]}>
          {commandCategories.map(category => (
            <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
              <Card 
                hoverable 
                className="h-full cursor-pointer border-slate-200 transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-md"
                onClick={() => navigate(`/tools/commands?category=${category.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-2xl text-primary-600">
                    {iconMap[category.icon]}
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">{category.name}</Title>
                    <Text className="text-xs text-slate-500 block mb-2">{category.description}</Text>
                    <Badge count={`${category.commandCount} 个命令`} style={{ backgroundColor: '#f1f5f9', color: '#64748b', boxShadow: 'none' }} />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 配置模板 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Title level={4} className="!mb-0 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> 配置模板
          </Title>
          <a onClick={() => navigate('/tools/templates')} className="text-primary-600 hover:text-primary-500 cursor-pointer">查看全部</a>
        </div>
        <Row gutter={[16, 16]}>
          {templates.map(template => (
            <Col xs={24} md={12} key={template.id}>
              <Card hoverable className="h-full border-slate-200 cursor-pointer" onClick={() => navigate('/tools/templates')}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag color="blue" className="m-0 border-none font-medium">{template.category}</Tag>
                    <Title level={5} className="!mb-0">{template.title}</Title>
                  </div>
                  <a className="text-sm text-primary-600 cursor-pointer">查看</a>
                </div>
                <Paragraph className="mb-0 text-sm text-slate-500 line-clamp-2">
                  {template.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 在线小工具 */}
      <div>
        <Title level={4} className="!mb-4 flex items-center gap-2">
          <span className="text-2xl">🔧</span> 在线小工具
        </Title>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: '时间戳转换', icon: '🕐', desc: 'Unix时间戳互转', path: '/tools/timestamp' },
            { name: 'JSON格式化', icon: '{}', desc: '校验与美化', path: '/tools/json' },
            { name: '正则测试', icon: '🧪', desc: '表达式在线调试', path: '/tools/regex' },
            { name: 'Base64', icon: '✂️', desc: '编码与解码', path: '/tools/base64' },
            { name: '故障排查', icon: '🩺', desc: '常见故障速查卡', path: '/tools/troubleshoot' },
          ].map((tool, idx) => (
            <Card 
              key={idx} 
              hoverable 
              className="text-center transition-all hover:border-primary-300 cursor-pointer"
              bodyStyle={{ padding: '20px 12px' }}
              onClick={() => navigate(tool.path)}
            >
              <div className="mb-2 text-3xl">{tool.icon}</div>
              <div className="mb-1 font-medium text-slate-800">{tool.name}</div>
              <div className="text-xs text-slate-400">{tool.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
