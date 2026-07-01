import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag, Input, Space, Button, Progress } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { labs } from '@/data/labs';
import { useUserStore } from '@/store/userStore';

const { Title, Paragraph } = Typography;

const Labs: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { labProgress } = useUserStore();

  const filteredLabs = labs.filter(lab => 
    !searchText || 
    lab.title.toLowerCase().includes(searchText.toLowerCase()) || 
    lab.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* 头部区域 */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-center shadow-lg sm:p-12">
        <Title level={2} className="!mb-4 !text-white">在线实验平台</Title>
        <Paragraph className="!mb-8 text-purple-100 text-lg">
          真实环境，即开即用，让每一次敲击都有反馈
        </Paragraph>
        <div className="mx-auto max-w-2xl">
          <Input.Search
            size="large"
            placeholder="搜索你想做的实验..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="shadow-md [&_.ant-input]:text-lg [&_.ant-btn]:bg-purple-500 [&_.ant-btn]:border-purple-500 hover:[&_.ant-btn]:bg-purple-400"
          />
        </div>
      </div>

      {/* 数据概览 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex gap-8">
          <div>
            <div className="text-sm text-slate-500">累计实验时长</div>
            <div className="text-2xl font-bold text-slate-800">12.5 <span className="text-base font-normal text-slate-500">小时</span></div>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div>
            <div className="text-sm text-slate-500">已完成实验</div>
            <div className="text-2xl font-bold text-slate-800">
              {labProgress.filter(p => p.status === 'completed').length} <span className="text-base font-normal text-slate-500">个</span>
            </div>
          </div>
        </div>
        <Button type="primary" size="large" className="bg-purple-600 border-none hover:bg-purple-500">
          随机推荐实验
        </Button>
      </div>

      {/* 实验列表 */}
      <Row gutter={[24, 24]}>
        {filteredLabs.length > 0 ? (
          filteredLabs.map(lab => {
            const progress = labProgress.find(p => p.labId === lab.id);
            const isCompleted = progress?.status === 'completed';
            const isInProgress = progress?.status === 'in_progress';
            const percent = progress ? Math.round((progress.completedSteps / progress.totalSteps) * 100) : 0;

            return (
              <Col xs={24} lg={12} key={lab.id}>
                <Card 
                  hoverable 
                  className={`h-full overflow-hidden transition-all hover:shadow-md ${isCompleted ? 'border-green-200 bg-green-50/30' : ''}`}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div 
                      className="h-48 w-full bg-cover bg-center sm:h-auto sm:w-2/5" 
                      style={{ backgroundImage: `url(${lab.image})` }} 
                    />
                    <div className="flex w-full flex-col p-6 sm:w-3/5">
                      <div className="mb-2 flex items-center justify-between">
                        <Tag color={lab.difficulty === 'beginner' ? 'green' : lab.difficulty === 'intermediate' ? 'blue' : 'purple'} className="m-0 border-none">
                          {lab.difficulty === 'beginner' ? '入门' : lab.difficulty === 'intermediate' ? '进阶' : '高级'}
                        </Tag>
                        {isCompleted && <Tag color="success" className="m-0 border-none">已完成</Tag>}
                      </div>
                      <Title level={4} className="!mb-2 line-clamp-1">{lab.title}</Title>
                      <Paragraph className="mb-4 line-clamp-2 text-sm text-slate-500">
                        {lab.description}
                      </Paragraph>
                      
                      <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
                        <Space><ClockCircleOutlined /> 预计 {lab.duration} 分钟</Space>
                        <Space><UserOutlined /> {lab.participantCount} 人做过</Space>
                      </div>

                      <div className="mt-auto">
                        {isInProgress && (
                          <div className="mb-3">
                            <div className="mb-1 flex justify-between text-xs text-slate-500">
                              <span>已完成 {progress.completedSteps}/{progress.totalSteps} 步</span>
                              <span>{percent}%</span>
                            </div>
                            <Progress percent={percent} showInfo={false} size="small" strokeColor="#9333ea" />
                          </div>
                        )}
                        <Button 
                          type={isCompleted ? "default" : "primary"} 
                          className={`w-full ${!isCompleted ? 'bg-purple-600 hover:bg-purple-500 border-none' : ''}`}
                          onClick={() => navigate(`/labs/${lab.id}/workspace`)}
                        >
                          {isCompleted ? '再次练习' : isInProgress ? '继续实验' : '开始实验'} <RightOutlined />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col span={24}>
            <div className="py-20 text-center text-slate-400">
              <SearchOutlined className="mb-4 text-4xl" />
              <p>未找到相关实验</p>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Labs;
