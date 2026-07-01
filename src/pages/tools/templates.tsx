import { useState } from 'react';
import { Card, Input, Select, Button, message, Typography, Tag, Empty } from 'antd';
import { CopyOutlined, SearchOutlined, CodeOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as Icons from '@ant-design/icons';
import { templates } from '@/data/templates';
import type { ConfigTemplate } from '@/types/tool';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function Templates() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchSearch = template.title.toLowerCase().includes(searchText.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleCopy = (code: string, title: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(`${title} 已复制到剪贴板`);
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : <CodeOutlined />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="!mb-2">配置模板库</Title>
        <Text className="text-gray-500">直接复制使用常用运维配置，开箱即用</Text>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Search
          placeholder="搜索模板..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className="flex-1"
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          size="large"
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full md:w-48"
        >
          {categories.map(cat => (
            <Option key={cat} value={cat}>
              {cat === 'all' ? '全部' : cat}
            </Option>
          ))}
        </Select>
      </div>

      {filteredTemplates.length === 0 ? (
        <Empty description="没有找到匹配的模板" />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTemplates.map((template: ConfigTemplate) => (
            <Card
              key={template.id}
              className="shadow-sm hover:shadow-md transition-shadow"
              extra={
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(template.code, template.title)}
                >
                  复制代码
                </Button>
              }
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl text-blue-500 flex-shrink-0">
                  {getIcon(template.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Title level={4} className="!mb-0">{template.title}</Title>
                    <Tag color="blue">{template.category}</Tag>
                  </div>
                  <Text className="text-gray-500 block mb-4">{template.description}</Text>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <Text className="text-gray-400 text-sm">{template.language}</Text>
                    </div>
                    <div className="p-4">
                      <SyntaxHighlighter
                        language={template.language}
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
                        {template.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
