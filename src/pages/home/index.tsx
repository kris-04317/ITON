import React from 'react';
import { Card, Row, Col, Typography, Button, Tag, Progress, Space } from 'antd';
import { FireFilled, RightOutlined, ClockCircleOutlined, BookOutlined, UserOutlined, BugOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { learningPaths } from '@/data/paths';
import { formatStudyTime, getLevelColor, getLevelText } from '@/utils/format';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, learningProgress } = useUserStore();

  const getPathProgress = (pathId: string) => {
    const chapters = learningProgress.filter(p => p.pathId === pathId);
    const completed = chapters.filter(p => p.status === 'completed').length;
    const path = learningPaths.find(p => p.id === pathId);
    if (!path || path.chapterCount === 0) return 0;
    return Math.round((completed / path.chapterCount) * 100);
  };

  const getContinueLearning = () => {
    // 找出最近学习的路径
    const inProgress = learningProgress
      .filter(p => p.status !== 'completed')
      .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime());
    
    if (inProgress.length === 0) return null;
    const latest = inProgress[0];
    const path = learningPaths.find(p => p.id === latest.pathId);
    const chapter = path?.chapters.find(c => c.id === latest.chapterId);
    
    if (!path || !chapter) return null;
    return { path, chapter, progress: getPathProgress(path.id) };
  };

  const continueItem = getContinueLearning();

  return (
    <div className="animate-fade-in space-y-8">
      {/* 欢迎区域 */}
      <Card className="overflow-hidden border-none bg-gradient-to-r from-primary-500 to-primary-700 shadow-md">
        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={2} className="!mb-2 !text-white">
              👋 欢迎回来，{user?.username || '运维小白'}！
            </Title>
            <Text className="text-primary-100 text-lg">
              {user?.signature}
            </Text>
            <div className="mt-6 flex gap-6 text-white">
              <div>
                <div className="text-primary-200 text-sm">今日目标</div>
                <div className="text-xl font-semibold">完成「Linux文件操作命令」</div>
              </div>
              <div className="h-10 w-px bg-primary-400/50"></div>
              <div>
                <div className="text-primary-200 text-sm">连续学习</div>
                <div className="flex items-center text-xl font-semibold">
                  {user?.streakDays || 0} 天 <FireFilled className="ml-1 text-orange-400" />
                </div>
              </div>
              <div className="h-10 w-px bg-primary-400/50"></div>
              <div>
                <div className="text-primary-200 text-sm">已学时长</div>
                <div className="text-xl font-semibold">{formatStudyTime(user?.totalStudyTime || 0)}</div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8} className="text-right">
            {continueItem ? (
              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20">
                <Text className="!text-white/80 block mb-2 text-sm">上次学到：</Text>
                <Title level={4} className="!text-white !mb-1 line-clamp-1">{continueItem.path.title}</Title>
                <Text className="!text-white block mb-4 line-clamp-1 opacity-90">{continueItem.chapter.title}</Text>
                <Progress percent={continueItem.progress} strokeColor="#52c41a" trailColor="rgba(255,255,255,0.2)" className="mb-4 [&_.ant-progress-text]:!text-white" />
                <Button type="primary" className="w-full bg-white !text-primary-600 border-none font-bold" onClick={() => navigate(`/paths/${continueItem.path.id}/chapter/${continueItem.chapter.id}`)}>
                  继续学习 <RightOutlined />
                </Button>
              </div>
            ) : (
              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm border border-white/20">
                <Title level={4} className="!text-white !mb-4">开启新篇章</Title>
                <Button type="primary" className="w-full bg-white !text-primary-600 border-none font-bold" onClick={() => navigate('/paths')}>
                  去挑门课吧 <RightOutlined />
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* 推荐学习路径 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Title level={4} className="!mb-0">推荐学习路径</Title>
          <Link to="/paths" className="text-primary-600 hover:text-primary-500">查看全部 <RightOutlined /></Link>
        </div>
        <Row gutter={[16, 16]}>
          {learningPaths.slice(0, 4).map(path => (
            <Col xs={24} sm={12} lg={6} key={path.id}>
              <Card 
                hoverable 
                className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                cover={<div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${path.cover})` }} />}
                onClick={() => navigate(`/paths/${path.id}`)}
                bodyStyle={{ padding: '16px' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Tag color={getLevelColor(path.level)} className="m-0 border-none px-2">{getLevelText(path.level)}</Tag>
                  <Tag className="m-0 border-none bg-slate-100 text-slate-600">{path.category}</Tag>
                </div>
                <Title level={5} className="!mb-1 line-clamp-1" title={path.title}>{path.title}</Title>
                <Paragraph className="mb-3 line-clamp-2 text-xs text-slate-500" title={path.description}>
                  {path.description}
                </Paragraph>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <Space size={4}><ClockCircleOutlined /> {path.duration}分钟</Space>
                  <Space size={4}><BookOutlined /> {path.chapterCount}章</Space>
                  <Space size={4}><UserOutlined /> {path.studentCount}</Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* 常用工具 */}
        <Col xs={24} lg={16}>
          <Card title="常用工具" className="h-full border-slate-200 shadow-sm" extra={<Link to="/tools">更多</Link>}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { name: '命令速查', icon: '💻', path: '/tools/commands', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { name: '配置模板', icon: '⚙️', path: '/tools/templates', color: 'bg-green-50 text-green-600 border-green-100' },
                { name: '故障排查', icon: '🔍', path: '/tools/troubleshoot', color: 'bg-red-50 text-red-600 border-red-100' },
                { name: '时间戳转换', icon: '🕐', path: '/tools/timestamp', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                { name: 'JSON格式化', icon: '🔧', path: '/tools/json', color: 'bg-orange-50 text-orange-600 border-orange-100' },
                { name: '正则测试', icon: '📊', path: '/tools/regex', color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
              ].map((tool, idx) => (
                <div 
                  key={idx} 
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:scale-105 ${tool.color}`}
                  onClick={() => navigate(tool.path)}
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="font-medium">{tool.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 今日一坑 */}
        <Col xs={24} lg={8}>
          <Card 
            title={<><BugOutlined className="mr-2 text-red-500" />今日一坑</>} 
            className="h-full border-slate-200 bg-red-50/30 shadow-sm"
          >
            <div className="space-y-4">
              <Title level={5} className="!text-slate-800">Nginx 403 Forbidden 排查指南</Title>
              <Paragraph className="text-slate-600">
                刚配好Nginx，一访问就报错 403？别慌，按这三步查：
              </Paragraph>
              <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
                <li><strong className="text-slate-800">原因1：权限不足</strong> → 检查网站根目录权限，尝试 <code className="rounded bg-slate-100 px-1">chmod 755</code></li>
                <li><strong className="text-slate-800">原因2：index配置错误</strong> → 检查 <code className="rounded bg-slate-100 px-1">index</code> 指令是否包含你的默认首页文件名</li>
                <li><strong className="text-slate-800">原因3：SELinux限制</strong> → 临时关闭测试 <code className="rounded bg-slate-100 px-1">setenforce 0</code></li>
              </ul>
              <Button
                type="dashed"
                className="mt-2 w-full text-red-500 border-red-200 hover:text-red-600 hover:border-red-300"
                onClick={() => navigate('/tools/troubleshoot')}
              >
                查看详细排查文档
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
