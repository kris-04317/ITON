import { useState } from 'react';
import { Card, Input, Button, message, Typography, Space, Divider, Switch } from 'antd';
import { CopyOutlined, ClearOutlined, ArrowRightOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);

  const convert = () => {
    if (!input.trim()) {
      message.warning('请输入内容');
      return;
    }

    try {
      if (isEncode) {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        message.success('编码成功');
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        message.success('解码成功');
      }
    } catch (err) {
      message.error(isEncode ? '编码失败' : '解码失败，请检查输入是否为有效的Base64格式');
      setOutput('');
    }
  };

  const swap = () => {
    setIsEncode(!isEncode);
    const temp = input;
    setInput(output);
    setOutput(temp);
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
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="!mb-2">Base64 编解码</Title>
        <Text className="text-gray-500">快速进行Base64编码和解码转换</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <span>{isEncode ? '原文' : 'Base64 字符串'}</span>
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
            placeholder={isEncode ? '输入需要编码的文字...' : '输入需要解码的Base64字符串...'}
            rows={18}
            className="font-mono text-sm"
            spellCheck={false}
          />
          <Space className="mt-4">
            <Button type="primary" icon={<ArrowRightOutlined />} onClick={convert}>
              {isEncode ? '编码' : '解码'}
            </Button>
            <Button icon={<SwapOutlined />} onClick={swap}>
              切换模式
            </Button>
          </Space>
        </Card>

        <Card
          title={
            <div className="flex items-center justify-between">
              <span>{isEncode ? 'Base64 结果' : '解码结果'}</span>
              <Switch
                checked={isEncode}
                onChange={setIsEncode}
                checkedChildren="编码"
                unCheckedChildren="解码"
              />
            </div>
          }
          extra={
            <Button icon={<CopyOutlined />} onClick={copyOutput} disabled={!output}>
              复制
            </Button>
          }
        >
          {output ? (
            <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[450px]">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono m-0">
                {output}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[450px] text-gray-400">
              {isEncode ? '编码后显示结果' : '解码后显示结果'}
            </div>
          )}
        </Card>
      </div>

      <Divider />

      <Card title="使用说明" size="small">
        <ul className="text-gray-600 space-y-2 text-sm">
          <li>• 编码模式：将普通文本转换为Base64编码字符串</li>
          <li>• 解码模式：将Base64编码字符串转换为普通文本</li>
          <li>• 支持中文、英文、数字等各种字符</li>
          <li>• 可以点击「切换模式」快速互换输入输出</li>
          <li>• 点击「复制」按钮将结果复制到剪贴板</li>
        </ul>
      </Card>
    </div>
  );
}
