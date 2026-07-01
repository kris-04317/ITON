import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Divider, Space, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, BulbOutlined, CopyOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { commands } from '@/data/commands';
import { copyToClipboard } from '@/utils/format';

const { Title, Text, Paragraph } = Typography;

export default function CommandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const command = commands.find((item) => item.id === id);
  const relatedCommands = useMemo(() => {
    if (!command) return [];
    return commands
      .filter((item) => item.categoryId === command.categoryId && item.id !== command.id)
      .slice(0, 4);
  }, [command]);

  if (!command) {
    return (
      <div className="py-20 text-center">
        <Title level={4}>找不到该命令</Title>
        <Button type="primary" onClick={() => navigate('/tools/commands')}>
          返回命令列表
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className="px-0 text-slate-500 hover:text-slate-800"
        onClick={() => navigate('/tools/commands')}
      >
        返回命令速查
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-lg bg-slate-900 px-3 py-1 font-mono text-2xl font-bold text-white">
                {command.name}
              </span>
              <Tag color={command.level === 'beginner' ? 'green' : command.level === 'intermediate' ? 'blue' : 'purple'}>
                {command.level === 'beginner' ? '入门' : command.level === 'intermediate' ? '进阶' : '高级'}
              </Tag>
            </div>
            <Paragraph className="!mb-0 text-base text-slate-600">{command.description}</Paragraph>
          </div>
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={async () => {
                const success = await copyToClipboard(command.syntax);
                if (success) {
                  void 0;
                }
              }}
            >
              复制语法
            </Button>
          </Space>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card title="基本语法" className="border-slate-200 shadow-sm">
            <SyntaxHighlighter language="bash" style={vscDarkPlus} className="!m-0 !rounded-lg !text-sm">
              {command.syntax}
            </SyntaxHighlighter>
          </Card>

          {command.options.length > 0 && (
            <Card title="常用选项" className="border-slate-200 shadow-sm">
              <Table
                rowKey="flag"
                pagination={false}
                dataSource={command.options}
                columns={[
                  {
                    title: '选项',
                    dataIndex: 'flag',
                    width: 160,
                    render: (text: string) => <Text code>{text}</Text>,
                  },
                  {
                    title: '说明',
                    dataIndex: 'description',
                  },
                ]}
              />
            </Card>
          )}

          {command.combinations.length > 0 && (
            <Card title="常见组合" className="border-slate-200 shadow-sm">
              <div className="space-y-3">
                {command.combinations.map((item) => (
                  <div key={item} className="rounded-lg bg-slate-900 p-3">
                    <code className="text-sm text-slate-100">{item}</code>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {command.examples.length > 0 && (
            <Card title="实战示例" className="border-slate-200 shadow-sm">
              <div className="space-y-6">
                {command.examples.map((example) => (
                  <div key={example.title}>
                    <Text strong className="mb-2 block text-slate-800">{example.title}</Text>
                    <SyntaxHighlighter language="bash" style={vscDarkPlus} className="!m-0 !rounded-lg !text-sm">
                      {example.code}
                    </SyntaxHighlighter>
                    {example.output && (
                      <div className="mt-3 rounded-lg bg-slate-100 p-3">
                        <Text strong className="mb-2 block">输出示例</Text>
                        <pre className="m-0 whitespace-pre-wrap font-mono text-sm text-slate-700">{example.output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="使用建议" className="border-slate-200 shadow-sm">
            <div className="flex gap-3 rounded-lg bg-blue-50 p-4 text-blue-900">
              <BulbOutlined className="mt-1 text-lg text-blue-500" />
              <div className="text-sm leading-6">{command.tips}</div>
            </div>
          </Card>

          <Card title="相关命令" className="border-slate-200 shadow-sm">
            <div className="space-y-3">
              {relatedCommands.length > 0 ? (
                relatedCommands.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:border-primary-300 hover:bg-slate-50"
                    onClick={() => navigate(`/tools/commands/${item.id}`)}
                  >
                    <div className="mb-1 font-mono text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </div>
                ))
              ) : (
                <Text type="secondary">暂无相关命令</Text>
              )}
            </div>
          </Card>

          <Card title="下一步建议" className="border-slate-200 shadow-sm">
            <div className="space-y-2 text-sm text-slate-600">
              <div>1. 先掌握基础语法和常用选项</div>
              <div>2. 再跟着示例自己敲一遍</div>
              <div>3. 最后在实验环境中配合实际场景使用</div>
            </div>
            <Divider />
            <Button block type="primary" onClick={() => navigate('/labs')}>
              去实验平台练习
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
