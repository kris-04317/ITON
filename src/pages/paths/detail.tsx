import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, List, Progress } from 'antd';
import { ClockCircleOutlined, UserOutlined, StarFilled, PlayCircleOutlined, CheckCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { learningPaths } from '@/data/paths';
import { useUserStore } from '@/store/userStore';
import { getLevelColor, getLevelText } from '@/utils/format';

const { Title, Paragraph } = Typography;

const PathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { learningProgress } = useUserStore();

  const path = learningPaths.find(p => p.id === id);

  if (!path) {
    return <div className="py-20 text-center text-slate-500">找不到该学习路径</div>;
  }

  // 计算学习进度
  const pathProgress = learningProgress.filter(p => p.pathId === id);
  const completedCount = pathProgress.filter(p => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / path.chapterCount) * 100) || 0;

  // 找到上次学习的章节，或者第一章
  const lastRead = pathProgress.sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())[0];
  const nextChapterId = lastRead?.status === 'in_progress' ? lastRead.chapterId : 
    (lastRead?.status === 'completed' && pathProgress.length < path.chapterCount) ? 
    path.chapters[pathProgress.length].id : path.chapters[0].id;

  return (
    <div className="animate-fade-in space-y-6">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/paths')} className="text-slate-500 hover:text-slate-800">
        返回路径列表
      </Button>

      <Card className="overflow-hidden border-none shadow-sm" bodyStyle={{ padding: 0 }}>
        <div className="flex flex-col md:flex-row">
          <div 
            className="h-64 w-full bg-cover bg-center md:h-auto md:w-2/5" 
            style={{ backgroundImage: `url(${path.cover})` }} 
          />
          <div className="flex w-full flex-col justify-center p-8 md:w-3/5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag color={getLevelColor(path.level)} className="m-0 border-none px-2">{getLevelText(path.level)}</Tag>
              <Tag className="m-0 border-none bg-slate-100 text-slate-600">{path.category}</Tag>
            </div>
            <Title level={2} className="!mb-4">{path.title}</Title>
            <Paragraph className="mb-6 text-slate-500 text-base">{path.description}</Paragraph>
            
            <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-600">
              <Space><ClockCircleOutlined /> 预计时长 {path.duration} 分钟</Space>
              <Space><UserOutlined /> {path.studentCount} 人在学</Space>
              <Space><StarFilled className="text-amber-400" /> {path.rating} 分</Space>
            </div>

            <div className="flex items-center gap-6">
              <Button 
                type="primary" 
                size="large" 
                icon={<PlayCircleOutlined />} 
                className="w-40 font-medium"
                onClick={() => navigate(`/paths/${path.id}/chapter/${nextChapterId}`)}
              >
                {progressPercent === 0 ? '开始学习' : progressPercent === 100 ? '重新学习' : '继续学习'}
              </Button>
              {progressPercent > 0 && (
                <div className="flex-1 max-w-xs">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>已学 {completedCount}/{path.chapterCount} 章</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <Progress percent={progressPercent} showInfo={false} strokeColor="#52c41a" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title={<span className="text-lg">课程大纲</span>} className="border-none shadow-sm">
        <List
          itemLayout="horizontal"
          dataSource={path.chapters}
          renderItem={(chapter, index) => {
            const status = pathProgress.find(p => p.chapterId === chapter.id)?.status;
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';

            return (
              <List.Item 
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${isCompleted ? 'opacity-70' : ''}`}
                onClick={() => navigate(`/paths/${path.id}/chapter/${chapter.id}`)}
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex h-10 w-10 items-center justify-center">
                      {isCompleted ? (
                        <CheckCircleFilled className="text-2xl text-green-500" />
                      ) : (
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${isInProgress ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                  }
                  title={<span className={`text-base ${isInProgress ? 'text-primary-600' : ''}`}>{chapter.title}</span>}
                  description={
                    <Space size={16} className="mt-1 text-xs">
                      <span><ClockCircleOutlined /> 预计 {chapter.estimatedTime} 分钟</span>
                      {chapter.relatedLabId && (
                        <Tag color="purple" className="m-0 border-none">包含实战实验</Tag>
                      )}
                    </Space>
                  }
                />
                <Button type="text" className="text-slate-400">去学习</Button>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default PathDetail;
