import { useMemo, useState } from 'react';
import { Alert, Button, Card, Input, Space, Table, Tag, Typography } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MatchRow {
  key: string;
  index: number;
  value: string;
  start: number;
  end: number;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('error-500\nstatus: 200\nport: 8080');

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchRow[] = [];

      if (flags.includes('g')) {
        for (const match of input.matchAll(regex)) {
          matches.push({
            key: `${matches.length}`,
            index: matches.length + 1,
            value: match[0],
            start: match.index ?? 0,
            end: (match.index ?? 0) + match[0].length,
          });
        }
      } else {
        const match = regex.exec(input);
        if (match) {
          matches.push({
            key: '0',
            index: 1,
            value: match[0],
            start: match.index ?? 0,
            end: (match.index ?? 0) + match[0].length,
          });
        }
      }

      return { valid: true, matches, error: '' };
    } catch (error) {
      return {
        valid: false,
        matches: [],
        error: error instanceof Error ? error.message : '正则表达式无效',
      };
    }
  }, [pattern, flags, input]);

  const highlighted = useMemo(() => {
    if (!result.valid || result.matches.length === 0) return input;

    let offset = 0;
    const parts: string[] = [];

    result.matches.forEach((match) => {
      parts.push(input.slice(offset, match.start));
      parts.push(`[[[${input.slice(match.start, match.end)}]]]`);
      offset = match.end;
    });
    parts.push(input.slice(offset));

    return parts.join('');
  }, [input, result]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <Title level={2} className="!mb-2">正则测试</Title>
        <Text className="text-gray-500">实时测试匹配结果，适合日志提取、文本校验和规则调试</Text>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="规则输入">
          <div className="space-y-4">
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              addonBefore="/"
              addonAfter={`/${flags}`}
              placeholder="输入正则表达式"
              className="font-mono"
            />
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="标志位，如 g i m"
              className="font-mono"
            />
            <TextArea
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入需要测试的文本"
              className="font-mono text-sm"
              spellCheck={false}
            />
            <Space>
              <Button
                icon={<ClearOutlined />}
                onClick={() => {
                  setPattern('');
                  setFlags('g');
                  setInput('');
                }}
              >
                清空
              </Button>
              <Tag color={result.valid ? 'success' : 'error'}>
                {result.valid ? `匹配 ${result.matches.length} 项` : '规则错误'}
              </Tag>
            </Space>
          </div>
        </Card>

        <Card title="测试结果">
          {!result.valid ? (
            <Alert type="error" message="正则表达式无效" description={result.error} showIcon />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <Text strong className="mb-3 block">高亮预览</Text>
                <pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm text-slate-700">
                  {highlighted.split('[[[').map((part, index) => {
                    if (!part.includes(']]]')) return part;
                    const [hit, rest] = part.split(']]]');
                    return (
                      <span key={index}>
                        <mark className="rounded bg-yellow-200 px-1">{hit}</mark>
                        {rest}
                      </span>
                    );
                  })}
                </pre>
              </div>

              <Table
                size="small"
                pagination={false}
                dataSource={result.matches}
                columns={[
                  { title: '#', dataIndex: 'index', width: 60 },
                  { title: '匹配内容', dataIndex: 'value', render: (value: string) => <Text code>{value}</Text> },
                  { title: '起始', dataIndex: 'start', width: 80 },
                  { title: '结束', dataIndex: 'end', width: 80 },
                ]}
                locale={{ emptyText: '暂无匹配结果' }}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
