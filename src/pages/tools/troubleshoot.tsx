import { useMemo, useState } from 'react';
import { Alert, Card, Collapse, Input, Space, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const cases = [
  {
    id: 'nginx-403',
    title: 'Nginx 403 Forbidden',
    category: 'Web 服务',
    level: 'beginner',
    summary: '访问站点返回 403，常见原因通常是权限、默认首页或 SELinux。',
    steps: [
      '先确认站点根目录和上层目录是否具备 Web 服务用户可读可执行权限。',
      '检查 Nginx 配置里的 index 指令是否包含实际首页文件名。',
      '如果系统启用了 SELinux，先临时放开验证问题是否由安全策略导致。',
    ],
    commands: ['ls -ld /var/www/html', 'nginx -t', 'setenforce 0'],
  },
  {
    id: 'ssh-timeout',
    title: 'SSH 连接超时',
    category: '远程连接',
    level: 'beginner',
    summary: '无法远程登录时，优先判断网络、端口和防火墙。',
    steps: [
      '先 ping 目标主机，确认网络层是否可达。',
      '再检查 22 端口是否监听，以及云平台安全组是否放行。',
      '最后查看 sshd 服务状态和认证日志。',
    ],
    commands: ['ping 192.168.1.10', 'ss -tlnp | grep 22', 'systemctl status sshd'],
  },
  {
    id: 'disk-full',
    title: '磁盘空间爆满',
    category: '系统资源',
    level: 'intermediate',
    summary: '服务器空间不足时，先定位哪个分区满，再逐层找大文件。',
    steps: [
      '用 df -h 找到满掉的挂载点。',
      '用 du -h --max-depth=1 逐层缩小范围。',
      '清理日志、临时文件或历史备份，并评估是否需要扩容。',
    ],
    commands: ['df -h', 'du -h --max-depth=1 /var | sort -rh | head', 'journalctl --vacuum-time=7d'],
  },
];

export default function Troubleshoot() {
  const [keyword, setKeyword] = useState('');

  const filteredCases = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return cases;
    return cases.filter((item) =>
      item.title.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text)
    );
  }, [keyword]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <Title level={2} className="!mb-2">故障排查</Title>
        <Paragraph className="!mb-0 text-slate-500">
          面向运维初学者的常见问题速查卡，先给判断顺序，再给排查命令。
        </Paragraph>
      </div>

      <Card className="mb-6">
        <Input
          size="large"
          allowClear
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="搜索故障关键词，如 403、SSH、磁盘"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Card>

      <Alert
        className="mb-6"
        type="info"
        showIcon
        message="排障建议"
        description="优先确认现象、影响范围、变更记录，再执行诊断命令。先观察，后修改。"
      />

      <Collapse
        accordion
        items={filteredCases.map((item) => ({
          key: item.id,
          label: (
            <div className="flex flex-wrap items-center gap-3 pr-4">
              <span className="font-medium">{item.title}</span>
              <Tag color="blue">{item.category}</Tag>
              <Tag color={item.level === 'beginner' ? 'green' : 'orange'}>
                {item.level === 'beginner' ? '入门' : '进阶'}
              </Tag>
            </div>
          ),
          children: (
            <div className="space-y-5">
              <Paragraph className="!mb-0 text-slate-600">{item.summary}</Paragraph>

              <div>
                <Text strong className="mb-2 block">排查顺序</Text>
                <ul className="list-disc space-y-2 pl-5 text-slate-600">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Text strong className="mb-2 block">推荐命令</Text>
                <Space direction="vertical" className="w-full">
                  {item.commands.map((command) => (
                    <pre key={command} className="m-0 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100">
                      <code>{command}</code>
                    </pre>
                  ))}
                </Space>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
