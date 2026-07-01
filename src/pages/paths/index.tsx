import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag, Input, Space, Segmented } from 'antd';
import { SearchOutlined, ClockCircleOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { learningPaths } from '@/data/paths';
import { getLevelColor, getLevelText } from '@/utils/format';

const { Title, Paragraph } = Typography;

const Paths: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<string | number>('全部');

  const categories = ['全部', ...Array.from(new Set(learningPaths.map(p => p.category)))];

  const filteredPaths = learningPaths.filter(path => {
    const matchCategory = activeTab === '全部' || path.category === activeTab;
    const matchSearch = !searchText || path.title.toLowerCase().includes(searchText.toLowerCase()) || path.description.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* 头部区域 */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center shadow-lg sm:p-12">
        <Title level={2} className="!mb-4 !text-white">学习路径</Title>
        <Paragraph className="!mb-8 text-primary-100 text-lg">
          从零基础到运维高手，为你定制的体系化成长路线
        </Paragraph>
        <div className="mx-auto max-w-2xl">
          <Input.Search
            size="large"
            placeholder="搜索你想学习的技术（如：Linux, Nginx, Docker）..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="shadow-md [&_.ant-input]:text-lg"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex justify-center">
        <Segmented 
          options={categories} 
          value={activeTab} 
          onChange={setActiveTab}
          size="large"
          className="p-1"
        />
      </div>

      {/* 路径列表 */}
      <Row gutter={[24, 24]}>
        {filteredPaths.length > 0 ? (
          filteredPaths.map(path => (
            <Col xs={24} md={12} lg={8} key={path.id}>
              <Card 
                hoverable 
                className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                cover={<div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${path.cover})` }} />}
                onClick={() => navigate(`/paths/${path.id}`)}
                bodyStyle={{ padding: '20px' }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Tag color={getLevelColor(path.level)} className="m-0 border-none px-2">{getLevelText(path.level)}</Tag>
                  <Tag className="m-0 border-none bg-slate-100 text-slate-600">{path.category}</Tag>
                  {path.tags.filter(t => t !== getLevelText(path.level) && t !== path.category).map(tag => (
                    <Tag key={tag} className="m-0 border-none bg-slate-50 text-slate-500">{tag}</Tag>
                  ))}
                </div>
                <Title level={4} className="!mb-2 line-clamp-1" title={path.title}>{path.title}</Title>
                <Paragraph className="mb-4 line-clamp-2 text-sm text-slate-500" title={path.description}>
                  {path.description}
                </Paragraph>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-400">
                  <Space size={6}><ClockCircleOutlined /> {path.duration}分钟</Space>
                  <Space size={6}><BookOutlined /> {path.chapterCount}章</Space>
                  <Space size={6}><UserOutlined /> {path.studentCount}</Space>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div className="py-20 text-center text-slate-400">
              <SearchOutlined className="mb-4 text-4xl" />
              <p>未找到相关学习路径</p>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Paths;
