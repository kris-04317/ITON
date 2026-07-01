import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Tabs, Progress, Tooltip, Tag, Button } from 'antd';
import { UserOutlined, ClockCircleOutlined, BookOutlined, ExperimentOutlined, FireFilled, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { formatStudyTime } from '@/utils/format';
import { badges } from '@/data/badges';
import { learningPaths } from '@/data/paths';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, learningProgress, labProgress } = useUserStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return <div className="py-20 text-center">请先登录</div>;

  // 经验值进度计算
  const expPerLevel = 500;
  const currentLevelExp = user.exp % expPerLevel;
  const expPercent = Math.round((currentLevelExp / expPerLevel) * 100);

  // 统计数据
  const completedPathsCount = learningPaths.filter(path => {
    const pathProgress = learningProgress.filter(p => p.pathId === path.id);
    return pathProgress.length === path.chapterCount && pathProgress.every(p => p.status === 'completed');
  }).length;

  const completedLabsCount = labProgress.filter(p => p.status === 'completed').length;

  // 生成简单的热力图数据 (模拟)
  const generateHeatmapData = () => {
    const data = [];
    const today = dayjs();
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      // 随机生成学习时长 (为了展示效果，周末少一点，最近几天多一点)
      let intensity = 0;
      if (i < 5) intensity = Math.floor(Math.random() * 4) + 1;
      else if (date.day() === 0 || date.day() === 6) intensity = Math.random() > 0.5 ? 1 : 0;
      else intensity = Math.floor(Math.random() * 3);
      
      data.push({
        date: date.format('MM-DD'),
        intensity, // 0-4
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-slate-100';
      case 1: return 'bg-blue-200';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-blue-600';
      case 4: return 'bg-blue-800';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* 个人信息卡片 */}
      <Card className="border-none shadow-sm" bodyStyle={{ padding: '32px' }}>
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={16} className="flex items-center gap-6">
            <Avatar 
              size={100} 
              src={user.avatar} 
              icon={<UserOutlined />} 
              className="border-4 border-primary-50 bg-primary-100 text-4xl text-primary-500 shadow-sm" 
            />
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <Title level={3} className="!mb-0">{user.username}</Title>
                <Tag color="blue" className="m-0 border-none rounded-full px-3 text-sm font-bold">
                  Lv.{user.level}
                </Tag>
                <Button 
                  type="text" 
                  icon={<SettingOutlined />} 
                  onClick={() => navigate('/profile/settings')}
                  className="text-slate-400 hover:text-primary-500"
                />
              </div>
              <Paragraph className="mb-4 text-slate-500">{user.signature}</Paragraph>
              
              <div className="flex max-w-md items-center gap-4">
                <Text className="whitespace-nowrap text-sm text-slate-500">经验值</Text>
                <Progress 
                  percent={expPercent} 
                  showInfo={false} 
                  strokeColor="#1677ff" 
                  trailColor="#f1f5f9"
                  className="flex-1"
                />
                <Text className="whitespace-nowrap text-sm text-slate-500">{currentLevelExp} / {expPerLevel}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="flex justify-around rounded-xl bg-slate-50 p-6">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-slate-800">{user.streakDays}</div>
                <div className="text-xs text-slate-500">连续打卡(天)</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-slate-800">{formatStudyTime(user.totalStudyTime)}</div>
                <div className="text-xs text-slate-500">总学习时长</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="bg-white px-6 pt-4 rounded-xl shadow-sm"
        items={[
          {
            key: 'overview',
            label: <span className="px-4 text-base"><BookOutlined /> 学习总览</span>,
            children: (
              <div className="py-6 space-y-8">
                {/* 数据统计 */}
                <Row gutter={[16, 16]}>
                  <Col xs={12} md={6}>
                    <Card className="border-slate-100 bg-slate-50/50 text-center">
                      <div className="mb-2 text-3xl text-blue-500"><BookOutlined /></div>
                      <div className="text-2xl font-bold text-slate-800">{completedPathsCount}</div>
                      <div className="text-slate-500">完成路径</div>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="border-slate-100 bg-slate-50/50 text-center">
                      <div className="mb-2 text-3xl text-purple-500"><ExperimentOutlined /></div>
                      <div className="text-2xl font-bold text-slate-800">{completedLabsCount}</div>
                      <div className="text-slate-500">完成实验</div>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="border-slate-100 bg-slate-50/50 text-center">
                      <div className="mb-2 text-3xl text-orange-500"><FireFilled /></div>
                      <div className="text-2xl font-bold text-slate-800">{user.streakDays}</div>
                      <div className="text-slate-500">最长连学(天)</div>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="border-slate-100 bg-slate-50/50 text-center">
                      <div className="mb-2 text-3xl text-green-500"><ClockCircleOutlined /></div>
                      <div className="text-2xl font-bold text-slate-800">{Math.floor(user.totalStudyTime / 60)}</div>
                      <div className="text-slate-500">学习小时</div>
                    </Card>
                  </Col>
                </Row>

                {/* 学习日历 (热力图) */}
                <div>
                  <Title level={5} className="!mb-4">最近30天学习活跃度</Title>
                  <div className="rounded-xl border border-slate-100 p-6">
                    <div className="flex flex-wrap gap-2">
                      {heatmapData.map((data, idx) => (
                        <Tooltip key={idx} title={`${data.date} : ${data.intensity > 0 ? '已学习' : '未学习'}`}>
                          <div className={`h-6 w-6 rounded-sm ${getHeatmapColor(data.intensity)} transition-transform hover:scale-110 cursor-pointer`} />
                        </Tooltip>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400">
                      <span>少</span>
                      <div className="h-3 w-3 rounded-sm bg-slate-100" />
                      <div className="h-3 w-3 rounded-sm bg-blue-200" />
                      <div className="h-3 w-3 rounded-sm bg-blue-400" />
                      <div className="h-3 w-3 rounded-sm bg-blue-600" />
                      <div className="h-3 w-3 rounded-sm bg-blue-800" />
                      <span>多</span>
                    </div>
                  </div>
                </div>

                {/* 技能雷达 (简化版进度条展示) */}
                <div>
                  <Title level={5} className="!mb-4">技能掌握程度</Title>
                  <div className="space-y-4 rounded-xl border border-slate-100 p-6">
                    {[
                      { name: 'Linux基础', percent: 80, color: '#1677ff' },
                      { name: 'Shell编程', percent: 35, color: '#52c41a' },
                      { name: '网络基础', percent: 60, color: '#faad14' },
                      { name: 'Nginx配置', percent: 20, color: '#722ed1' },
                      { name: 'Docker容器', percent: 10, color: '#eb2f96' },
                    ].map(skill => (
                      <div key={skill.name} className="flex items-center gap-4">
                        <div className="w-24 text-right text-sm text-slate-600">{skill.name}</div>
                        <Progress percent={skill.percent} strokeColor={skill.color} className="flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          },
          {
            key: 'badges',
            label: <span className="px-4 text-base">🏅 我的徽章</span>,
            children: (
              <div className="py-6">
                <Row gutter={[24, 24]}>
                  {badges.map(badge => (
                    <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
                      <div className={`flex h-full flex-col items-center rounded-xl border p-6 text-center transition-all ${badge.unlocked ? 'border-amber-200 bg-amber-50/30 shadow-sm hover:-translate-y-1' : 'border-slate-100 bg-slate-50 opacity-60 grayscale'}`}>
                        <div className="mb-3 text-5xl">{badge.icon}</div>
                        <div className="mb-2 font-bold text-slate-800">{badge.name}</div>
                        <div className="mb-3 text-xs text-slate-500 line-clamp-2">{badge.description}</div>
                        {badge.unlocked ? (
                          <div className="mt-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600">
                            已解锁
                          </div>
                        ) : (
                          <div className="mt-auto rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-500">
                            未解锁
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default Profile;
