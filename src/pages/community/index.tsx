import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Input, List, Row, Tag, Typography } from 'antd';
import { MessageOutlined, LikeOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { communityArticles, communityTopics } from '@/data/community';

const { Title, Paragraph, Text } = Typography;

export default function CommunityPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const hotTopics = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return communityTopics;
    return communityTopics.filter((item) =>
      item.title.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text) ||
      item.tags.some((tag) => tag.toLowerCase().includes(text))
    );
  }, [keyword]);

  const articles = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return communityArticles;
    return communityArticles.filter((item) =>
      item.title.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text)
    );
  }, [keyword]);

  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Title level={2} className="!mb-3 !text-white">运维社区</Title>
            <Paragraph className="!mb-0 !text-sky-50">
              在这里交流排障经验、学习路线、工具心得和真实工作场景。
            </Paragraph>
          </div>
          <div className="flex w-full max-w-xl gap-3">
            <Input
              size="large"
              placeholder="搜索问题、文章或关键词"
              prefix={<SearchOutlined className="text-slate-400" />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              size="large"
              type="primary"
              className="border-white bg-white !text-blue-700 hover:!text-blue-800"
              onClick={() => navigate('/community/create')}
            >
              发帖提问
            </Button>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="热门讨论" className="border-slate-200 shadow-sm">
            <List
              itemLayout="vertical"
              dataSource={hotTopics}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <div
                    className="space-y-3 rounded-lg p-2 transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/community/${item.id}`)}
                  >
                    <div>
                      <Title level={5} className="!mb-2">{item.title}</Title>
                      <Text type="secondary">作者：{item.author} · {item.authorTitle}</Text>
                    </div>
                    <Paragraph className="!mb-0 text-slate-500">{item.summary}</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-slate-500">
                      <span><EyeOutlined className="mr-1" />{item.views}</span>
                      <span><MessageOutlined className="mr-1" />{item.replies}</span>
                      <span><LikeOutlined className="mr-1" />{item.likes}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div className="space-y-6">
            <Card title="精选文章" className="border-slate-200 shadow-sm">
              <div className="space-y-4">
                {articles.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                    <Tag color="purple" className="mb-2">{item.category}</Tag>
                    <div className="mb-2 font-medium text-slate-800">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.summary}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="社区计划" className="border-slate-200 shadow-sm">
              <div className="space-y-3 text-sm text-slate-600">
                <div>1. 问答区：沉淀常见故障和解决方案</div>
                <div>2. 文章区：发布实战经验与学习笔记</div>
                <div>3. 打卡区：记录每天的学习与实验进展</div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
