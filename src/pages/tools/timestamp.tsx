import { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Space, Divider, Table, Tag } from 'antd';
import { CopyOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTimestamp(Date.now());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timestampToDatetime = () => {
    if (!timestamp.trim()) {
      message.warning('请输入时间戳');
      return;
    }

    let ts = parseInt(timestamp);
    if (ts < 10000000000) {
      ts *= 1000;
    }

    const date = dayjs(ts);
    if (!date.isValid()) {
      message.error('无效的时间戳');
      return;
    }

    setDatetime(date.format('YYYY-MM-DD HH:mm:ss'));
    message.success('转换成功');
  };

  const datetimeToTimestamp = () => {
    if (!datetime.trim()) {
      message.warning('请输入日期时间');
      return;
    }

    const date = dayjs(datetime);
    if (!date.isValid()) {
      message.error('无效的日期格式');
      return;
    }

    setTimestamp(date.valueOf().toString());
    message.success('转换成功');
  };

  const copyCurrentTimestamp = () => {
    navigator.clipboard.writeText(Math.floor(currentTimestamp / 1000).toString()).then(() => {
      message.success('已复制当前时间戳');
    });
  };

  const copyCurrentMsTimestamp = () => {
    navigator.clipboard.writeText(currentTimestamp.toString()).then(() => {
      message.success('已复制当前毫秒时间戳');
    });
  };

  const nowToTimestamp = () => {
    setTimestamp(Math.floor(currentTimestamp / 1000).toString());
    setDatetime(dayjs(currentTimestamp).format('YYYY-MM-DD HH:mm:ss'));
    message.success('已设置为当前时间');
  };

  const timeTableData = [
    {
      key: 'second',
      name: '10位时间戳（秒）',
      value: Math.floor(currentTimestamp / 1000),
      color: 'blue'
    },
    {
      key: 'millisecond',
      name: '13位时间戳（毫秒）',
      value: currentTimestamp,
      color: 'green'
    },
    {
      key: 'datetime',
      name: '标准时间',
      value: dayjs(currentTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      color: 'orange'
    },
    {
      key: 'datetime_ms',
      name: '标准时间（毫秒）',
      value: dayjs(currentTimestamp).format('YYYY-MM-DD HH:mm:ss.SSS'),
      color: 'purple'
    },
    {
      key: 'iso',
      name: 'ISO 8601',
      value: dayjs(currentTimestamp).toISOString(),
      color: 'cyan'
    }
  ];

  const timeColumns = [
    {
      title: '格式',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <Tag color={record.color}>{text}</Tag>
      )
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      className: 'font-mono text-sm'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(record.value.toString()).then(() => {
              message.success('已复制');
            });
          }}
        >
          复制
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="!mb-2">时间戳转换</Title>
        <Text className="text-gray-500">在时间戳和日期时间之间相互转换</Text>
      </div>

      <Card title={
        <div className="flex items-center gap-2">
          <ClockCircleOutlined />
          <span>当前时间</span>
        </div>
      } className="mb-6">
        <Table
          dataSource={timeTableData}
          columns={timeColumns}
          pagination={false}
          size="small"
        />
        <Space className="mt-4">
          <Button type="primary" icon={<SyncOutlined />} onClick={nowToTimestamp}>
            填充到转换器
          </Button>
        </Space>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="时间戳 → 日期时间">
          <div className="space-y-4">
            <Input
              placeholder="输入时间戳（10位或13位）"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              size="large"
              prefix={<ClockCircleOutlined />}
              className="font-mono"
            />
            <Space>
              <Button type="primary" onClick={timestampToDatetime}>转换</Button>
              <Button icon={<CopyOutlined />} onClick={copyCurrentTimestamp}>
                获取当前10位
              </Button>
              <Button icon={<CopyOutlined />} onClick={copyCurrentMsTimestamp}>
                获取当前13位
              </Button>
            </Space>
            {datetime && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Text strong className="text-green-700">转换结果：</Text>
                <div className="mt-2 text-xl font-mono text-green-800">{datetime}</div>
              </div>
            )}
          </div>
        </Card>

        <Card title="日期时间 → 时间戳">
          <div className="space-y-4">
            <Input
              type="datetime-local"
              placeholder="选择日期时间"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              size="large"
              className="font-mono"
            />
            <Space>
              <Button type="primary" onClick={datetimeToTimestamp}>转换</Button>
            </Space>
            {timestamp && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Text strong className="text-blue-700">转换结果：</Text>
                <div className="mt-2 space-y-2">
                  <div className="text-xl font-mono text-blue-800">
                    10位（秒）：{timestamp.length > 10 ? timestamp.slice(0, 10) : timestamp}
                  </div>
                  <div className="text-xl font-mono text-blue-800">
                    13位（毫秒）：{timestamp.length > 10 ? timestamp : timestamp + '000'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Divider />

      <Card title="使用说明" size="small">
        <ul className="text-gray-600 space-y-2 text-sm">
          <li>• 10位时间戳：以秒为单位，从1970年1月1日00:00:00 UTC开始计算</li>
          <li>• 13位时间戳：以毫秒为单位，通常用于JavaScript</li>
          <li>• 自动识别10位或13位时间戳进行转换</li>
          <li>• 可以直接点击「填充到转换器」使用当前时间</li>
        </ul>
      </Card>
    </div>
  );
}
