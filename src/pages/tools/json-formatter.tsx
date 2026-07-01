import { useState } from 'react';
import { Card, Input, Button, message, Typography, Space, Divider } from 'antd';
import { CopyOutlined, ClearOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  const formatJson = () => {
    if (!input.trim()) {
      message.warning('请输入JSON内容');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError('');
      message.success('格式化成功');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : '解析失败');
      setOutput('');
      message.error('JSON格式错误');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      message.warning('请输入JSON内容');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError('');
      message.success('压缩成功');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : '解析失败');
      setOutput('');
      message.error('JSON格式错误');
    }
  };

  const copyOutput = () => {
    if (!output) {
      message.warning('没有可复制的内容');
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(true);
    setError('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="!mb-2">JSON 格式化/压缩</Title>
        <Text className="text-gray-500">快速格式化、压缩、验证JSON数据</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <span>输入 JSON</span>
              {input && (
                isValid ? (
                  <CheckCircleOutlined className="text-green-500" />
                ) : (
                  <CloseCircleOutlined className="text-red-500" />
                )
              )}
            </div>
          }
          extra={
            <Space>
              <Button icon={<ClearOutlined />} onClick={clearAll}>清空</Button>
            </Space>
          }
        >
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "IT运维通", "version": "1.0.0"}'
            rows={18}
            className="font-mono text-sm"
            spellCheck={false}
          />
          {!isValid && error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
          <Space className="mt-4">
            <Button type="primary" onClick={formatJson}>格式化</Button>
            <Button onClick={minifyJson}>压缩</Button>
          </Space>
        </Card>

        <Card
          title="输出结果"
          extra={
            <Button icon={<CopyOutlined />} onClick={copyOutput} disabled={!output}>
              复制
            </Button>
          }
        >
          {output ? (
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[450px]">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: '13px',
                  background: 'transparent'
                }}
                showLineNumbers
                wrapLines
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  textAlign: 'right',
                  color: '#6e7681',
                  borderRight: '1px solid #30363d',
                  marginRight: '1em'
                }}
              >
                {output}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[450px] text-gray-400">
              格式化或压缩后显示结果
            </div>
          )}
        </Card>
      </div>

      <Divider />

      <Card title="使用说明" size="small">
        <ul className="text-gray-600 space-y-2 text-sm">
          <li>• 在左侧输入框中粘贴或输入 JSON 数据</li>
          <li>• 点击「格式化」按钮将 JSON 格式化，便于阅读</li>
          <li>• 点击「压缩」按钮将 JSON 压缩为一行，节省空间</li>
          <li>• 如果 JSON 格式错误，会显示错误提示</li>
          <li>• 点击「复制」按钮将结果复制到剪贴板</li>
        </ul>
      </Card>
    </div>
  );
}
