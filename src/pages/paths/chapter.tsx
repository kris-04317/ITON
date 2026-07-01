import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space, Tag, Modal, Divider } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, RightOutlined, ExperimentOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { learningPaths } from '@/data/paths';
import { useUserStore } from '@/store/userStore';

const { Sider, Content } = Layout;
const { Title } = Typography;

const Chapter: React.FC = () => {
  const { id: pathId, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const { learningProgress, updateLearningProgress, addStudyTime, addExp } = useUserStore();
  
  const [startTime] = useState(Date.now());

  const path = learningPaths.find(p => p.id === pathId);
  const chapterIndex = path?.chapters.findIndex(c => c.id === chapterId) ?? -1;
  const chapter = path?.chapters[chapterIndex];

  // 记录开始学习
  useEffect(() => {
    if (pathId && chapterId && chapter) {
      const currentProgress = learningProgress.find(p => p.pathId === pathId && p.chapterId === chapterId);
      if (currentProgress?.status !== 'completed') {
        updateLearningProgress(pathId, chapterId, 50, 'in_progress');
      }
    }
  }, [pathId, chapterId]);

  if (!path || !chapter) {
    return <div className="py-20 text-center">章节不存在</div>;
  }

  const isCompleted = learningProgress.find(p => p.pathId === pathId && p.chapterId === chapterId)?.status === 'completed';
  const hasNext = chapterIndex < path.chapters.length - 1;
  const hasPrev = chapterIndex > 0;

  const handleComplete = () => {
    const studyMinutes = Math.max(1, Math.floor((Date.now() - startTime) / 60000));
    
    if (!isCompleted) {
      updateLearningProgress(pathId!, chapterId!, 100, 'completed');
      addStudyTime(studyMinutes);
      addExp(50); // 每章固定50经验
      
      Modal.success({
        title: '恭喜完成本章学习！',
        content: `本次学习用时 ${studyMinutes} 分钟，获得 50 经验值。`,
        onOk: () => {
          if (hasNext) {
            navigate(`/paths/${pathId}/chapter/${path.chapters[chapterIndex + 1].id}`);
          } else {
            navigate(`/paths/${pathId}`);
          }
        }
      });
    } else {
      if (hasNext) {
        navigate(`/paths/${pathId}/chapter/${path.chapters[chapterIndex + 1].id}`);
      } else {
        navigate(`/paths/${pathId}`);
      }
    }
  };

  const menuItems = path.chapters.map((c, index) => {
    const status = learningProgress.find(p => p.pathId === pathId && p.chapterId === c.id)?.status;
    return {
      key: c.id,
      label: (
        <div className="flex items-center justify-between">
          <span className="truncate">{index + 1}. {c.title}</span>
          {status === 'completed' && <CheckOutlined className="text-green-500" />}
        </div>
      ),
    };
  });

  return (
    <Layout className="bg-transparent min-h-[calc(100vh-140px)] -mx-4 sm:-mx-6 lg:-mx-8">
      {/* 侧边栏目录 */}
      <Sider 
        width={280} 
        theme="light" 
        className="hidden border-r border-slate-200 md:block"
        style={{ background: '#fff', overflow: 'auto', height: 'calc(100vh - 140px)', position: 'sticky', top: 0 }}
      >
        <div className="p-4 border-b border-slate-100">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/paths/${pathId}`)} className="p-0 text-slate-500">
            返回大纲
          </Button>
          <Title level={5} className="!mt-4 !mb-0 line-clamp-2">{path.title}</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[chapterId || '']}
          items={menuItems}
          className="border-none py-2"
          onClick={({ key }) => navigate(`/paths/${pathId}/chapter/${key}`)}
        />
      </Sider>

      {/* 主内容区 */}
      <Content className="bg-white px-6 py-8 md:px-12 lg:px-20 max-w-4xl">
        <div className="mb-6 md:hidden">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/paths/${pathId}`)} className="p-0 text-slate-500">
            返回大纲
          </Button>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
          <Title level={2} className="!mb-0">{chapter.title}</Title>
          {isCompleted && <Tag color="success" className="m-0 text-sm py-1 px-3">已完成</Tag>}
        </div>

        {/* Markdown 内容渲染 */}
        <div className="markdown-body min-h-[50vh]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className } = props;
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    style={vscDarkPlus}
                  />
                ) : (
                  <code className={className}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {chapter.content}
          </ReactMarkdown>
        </div>

        {/* 关联实验卡片 */}
        {chapter.relatedLabId && (
          <div className="my-10 rounded-xl border border-purple-100 bg-purple-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <Title level={5} className="!mb-2 !text-purple-800 flex items-center gap-2">
                  <ExperimentOutlined /> 本章配有实战实验
                </Title>
                <p className="mb-0 text-purple-600">纸上得来终觉浅，绝知此事要躬行。去实验台亲手敲敲代码吧！</p>
              </div>
              <Button type="primary" className="bg-purple-600 hover:bg-purple-500 border-none" onClick={() => navigate(`/labs/${chapter.relatedLabId}/workspace`)}>
                去实验台 <RightOutlined />
              </Button>
            </div>
          </div>
        )}

        <Divider className="my-10" />

        {/* 底部导航按钮 */}
        <div className="flex items-center justify-between pb-10">
          <div>
            {hasPrev && (
              <Button size="large" onClick={() => navigate(`/paths/${pathId}/chapter/${path.chapters[chapterIndex - 1].id}`)}>
                上一章
              </Button>
            )}
          </div>
          <Space size="middle">
            {!isCompleted && (
              <Button size="large" type="primary" className="bg-green-500 hover:bg-green-400 border-none" onClick={handleComplete}>
                标记为已学
              </Button>
            )}
            {hasNext && (
              <Button size="large" type={isCompleted ? "primary" : "default"} onClick={() => navigate(`/paths/${pathId}/chapter/${path.chapters[chapterIndex + 1].id}`)}>
                下一章 <RightOutlined />
              </Button>
            )}
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default Chapter;
