import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Card, Typography, Tag, Table, Button, message } from 'antd';
import { SearchOutlined, CopyOutlined, CheckCircleOutlined, BulbOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { commands, commandCategories } from '@/data/commands';
import { copyToClipboard } from '@/utils/format';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Commands: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 从 URL 获取初始状态
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    if (search) setSearchText(search);
  }, [searchParams]);

  // 过滤命令
  const filteredCommands = commands.filter(cmd => {
    const matchCategory = activeCategory === 'all' || cmd.categoryId === activeCategory;
    const matchSearch = !searchText || 
      cmd.name.toLowerCase().includes(searchText.toLowerCase()) || 
      cmd.description.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      message.success('已复制到剪贴板');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      message.error('复制失败');
    }
  };

  const menuItems = [
    { key: 'all', label: '全部命令' },
    ...commandCategories.map(cat => ({
      key: cat.id,
      label: cat.name,
    }))
  ];

  return (
    <Layout className="bg-transparent min-h-[calc(100vh-140px)]">
      {/* 左侧分类导航 */}
      <Sider width={240} className="hidden rounded-xl bg-white shadow-sm md:block overflow-hidden" style={{ borderRight: '1px solid #f1f5f9' }}>
        <div className="p-4 border-b border-slate-100">
          <Input 
            prefix={<SearchOutlined className="text-slate-400" />} 
            placeholder="搜索命令..." 
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="rounded-lg"
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeCategory]}
          className="border-none"
          items={menuItems}
          onClick={({ key }) => {
            setActiveCategory(key);
            setSearchParams(key === 'all' ? {} : { category: key });
          }}
        />
      </Sider>

      {/* 右侧内容区 */}
      <Content className="md:ml-6">
        <div className="mb-6 md:hidden">
          <Input.Search 
            size="large"
            placeholder="搜索命令..." 
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Title level={3} className="!mb-0">
            {activeCategory === 'all' ? '全部命令' : commandCategories.find(c => c.id === activeCategory)?.name}
          </Title>
          <Text type="secondary">共 {filteredCommands.length} 个命令</Text>
        </div>

        <div className="space-y-6">
          {filteredCommands.length > 0 ? (
            filteredCommands.map(cmd => (
              <Card key={cmd.id} className="overflow-hidden border-slate-200 shadow-sm" id={cmd.id}>
                {/* 标题区 */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-lg bg-slate-800 px-3 py-1 font-mono text-xl font-bold text-white"
                      onClick={() => navigate(`/tools/commands/${cmd.id}`)}
                    >
                      {cmd.name}
                    </button>
                    <Text className="text-base text-slate-600">{cmd.description}</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag color={cmd.level === 'beginner' ? 'green' : cmd.level === 'intermediate' ? 'blue' : 'purple'} className="m-0">
                      {cmd.level === 'beginner' ? '入门' : cmd.level === 'intermediate' ? '进阶' : '高级'}
                    </Tag>
                    <Button type="link" onClick={() => navigate(`/tools/commands/${cmd.id}`)}>
                      详情 <RightOutlined />
                    </Button>
                  </div>
                </div>

                {/* 语法区 */}
                <div className="mb-6">
                  <Text strong className="mb-2 block text-slate-800">基本语法：</Text>
                  <div className="relative group">
                    <SyntaxHighlighter language="bash" style={vscDarkPlus} className="!m-0 !rounded-lg !text-sm">
                      {cmd.syntax}
                    </SyntaxHighlighter>
                    <div 
                      className="absolute right-2 top-2 cursor-pointer rounded bg-white/10 p-1.5 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                      onClick={() => handleCopy(cmd.syntax, `syntax-${cmd.id}`)}
                    >
                      {copiedId === `syntax-${cmd.id}` ? <CheckCircleOutlined className="text-green-400" /> : <CopyOutlined />}
                    </div>
                  </div>
                </div>

                {/* 常用选项 */}
                {cmd.options.length > 0 && (
                  <div className="mb-6">
                    <Text strong className="mb-2 block text-slate-800">常用选项：</Text>
                    <Table 
                      dataSource={cmd.options} 
                      pagination={false}
                      size="small"
                      rowKey="flag"
                      className="border border-slate-200 rounded-lg overflow-hidden"
                      columns={[
                        { title: '选项', dataIndex: 'flag', width: '20%', render: (text) => <Text code>{text}</Text> },
                        { title: '说明', dataIndex: 'description' },
                      ]}
                    />
                  </div>
                )}

                {/* 实战示例 */}
                {cmd.examples.length > 0 && (
                  <div className="mb-6">
                    <Text strong className="mb-2 block text-slate-800">实战示例：</Text>
                    <div className="space-y-4">
                      {cmd.examples.map((exp, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <Text strong className="mb-2 block text-slate-700">{exp.title}</Text>
                          <div className="relative group">
                            <SyntaxHighlighter language="bash" style={vscDarkPlus} className="!m-0 !rounded-md !text-sm">
                              {exp.code}
                            </SyntaxHighlighter>
                            <div 
                              className="absolute right-2 top-2 cursor-pointer rounded bg-white/10 p-1.5 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                              onClick={() => handleCopy(exp.code, `exp-${cmd.id}-${idx}`)}
                            >
                              {copiedId === `exp-${cmd.id}-${idx}` ? <CheckCircleOutlined className="text-green-400" /> : <CopyOutlined />}
                            </div>
                          </div>
                          {exp.output && (
                            <div className="mt-2 rounded-md bg-slate-200 p-2 font-mono text-xs text-slate-600 whitespace-pre-wrap">
                              {exp.output}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 老司机提示 */}
                {cmd.tips && (
                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800 flex gap-3">
                    <BulbOutlined className="text-xl text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <Text strong className="block mb-1 text-blue-900">老司机经验：</Text>
                      <span className="text-sm">{cmd.tips}</span>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400">
              <SearchOutlined className="mb-4 text-4xl" />
              <p>未找到匹配的命令，换个关键词试试？</p>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Commands;
