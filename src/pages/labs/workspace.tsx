import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Typography, Steps, Checkbox, Modal, message, Spin } from 'antd';
import { ArrowLeftOutlined, BulbOutlined, ReloadOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { labs } from '@/data/labs';
import { useUserStore } from '@/store/userStore';
import Terminal, { TerminalRef } from '@/components/terminal/Terminal';

const { Sider, Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;

const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const terminalRef = useRef<TerminalRef>(null);
  const { updateLabProgress, addExp } = useUserStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [taskStatus, setTaskStatus] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startTime] = useState(Date.now());

  const lab = labs.find(l => l.id === id);

  // 初始化任务状态
  useEffect(() => {
    if (lab) {
      setTaskStatus(new Array(lab.steps[currentStep].tasks.length).fill(false));
      setShowHint(false);
    }
  }, [currentStep, lab]);

  // 模拟环境启动
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      message.success('实验环境准备就绪');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!lab) return <div className="p-20 text-center">实验不存在</div>;

  const step = lab.steps[currentStep];
  const allTasksCompleted = taskStatus.every(Boolean) && taskStatus.length > 0;

  const handleTaskToggle = (index: number) => {
    const newStatus = [...taskStatus];
    newStatus[index] = !newStatus[index];
    setTaskStatus(newStatus);
    
    // 如果这是这一步的最后一个任务，且全完成了，保存进度
    if (newStatus.every(Boolean)) {
      message.success('步骤完成！');
      updateLabProgress(lab.id, currentStep + 1, lab.steps.length, currentStep === lab.steps.length - 1 ? 'completed' : 'in_progress');
    }
  };

  const handleNextStep = () => {
    if (currentStep < lab.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 60000);
      addExp(100);
      Modal.success({
        title: '恭喜完成实验！',
        content: `太棒了！你已经完成了 "${lab.title}" 实验。用时 ${timeSpent || 1} 分钟，获得 100 经验值。`,
        okText: '返回实验列表',
        onOk: () => navigate('/labs'),
      });
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: '重置环境',
      content: '确定要重置实验环境吗？这将清空终端内容。',
      onOk: () => {
        terminalRef.current?.clear();
        setTaskStatus(new Array(step.tasks.length).fill(false));
        message.success('环境已重置');
      }
    });
  };

  // 模拟命令执行校验（在真实的后端环境中，这里会调用API）
  const handleCommand = (cmd: string) => {
    const term = terminalRef.current;
    if (!term) return;

    // 针对Linux基础命令实验的简单模拟校验
    if (lab.id === 'linux-commands') {
      if (currentStep === 0 && cmd === 'pwd') {
        term.writeln('/root');
        if (!taskStatus[0]) handleTaskToggle(0);
      } else if (currentStep === 0 && cmd.startsWith('ls')) {
        term.writeln('\\x1b[1;34m.\\x1b[0m  \\x1b[1;34m..\\x1b[0m  test.txt');
        if (!taskStatus[1]) handleTaskToggle(1);
      } else if (cmd === 'clear') {
        term.clear();
      } else {
        // 默认反馈
        term.writeln(`[Mock] Command executed: ${cmd}`);
        term.writeln('In a real environment, this would execute on the server.');
      }
    } else {
      // 默认反馈
      term.writeln(`[Mock] Command executed: ${cmd}`);
    }
  };

  return (
    <Layout className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-300">
      <Header className="flex h-14 items-center justify-between border-b border-slate-700 bg-slate-800 px-4">
        <div className="flex items-center gap-4">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/labs')} className="text-slate-400 hover:text-white" />
          <Title level={5} className="!mb-0 !text-white">{lab.title}</Title>
        </div>
        <div className="flex items-center gap-4">
          <Text className="text-slate-400">
            <ClockCircleOutlined className="mr-1" /> 
            {Math.floor((Date.now() - startTime) / 60000)} 分钟
          </Text>
          <Button type="primary" danger onClick={() => navigate('/labs')} size="small">退出实验</Button>
        </div>
      </Header>

      <Layout className="bg-transparent">
        {/* 左侧引导区 */}
        <Sider width={320} className="border-r border-slate-700 bg-slate-800 flex flex-col" style={{ overflow: 'hidden' }}>
          <div className="flex h-full flex-col">
            {/* 步骤导航 */}
            <div className="border-b border-slate-700 p-4">
              <Text strong className="mb-2 block text-white">实验进度 ({currentStep + 1}/{lab.steps.length})</Text>
              <Steps
                size="small"
                current={currentStep}
                className="[&_.ant-steps-item-title]:text-slate-400 [&_.ant-steps-item-active_.ant-steps-item-title]:!text-white"
              >
                {lab.steps.map((s, i) => (
                  <Steps.Step key={s.id} title={i === currentStep ? '进行中' : ''} />
                ))}
              </Steps>
            </div>

            {/* 当前任务 */}
            <div className="flex-1 overflow-y-auto p-4">
              <Title level={4} className="!mb-2 !text-white">{step.title}</Title>
              <Paragraph className="mb-6 text-slate-400">{step.description}</Paragraph>

              <div className="mb-6 rounded-lg bg-slate-700/50 p-4">
                <Text strong className="mb-3 block text-white">任务要求：</Text>
                <div className="space-y-3">
                  {step.tasks.map((task, idx) => (
                    <div key={task.id} className="flex items-start gap-2">
                      <Checkbox 
                        checked={taskStatus[idx]} 
                        onChange={() => handleTaskToggle(idx)}
                        className="mt-1 [&_.ant-checkbox-inner]:bg-transparent [&_.ant-checkbox-inner]:border-slate-500 [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-primary-500 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-primary-500"
                      />
                      <Text className={`${taskStatus[idx] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.description}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 提示 */}
              <div className="mb-6">
                {!showHint ? (
                  <Button type="dashed" className="w-full border-slate-600 bg-transparent text-slate-400 hover:border-yellow-500 hover:text-yellow-500" onClick={() => setShowHint(true)}>
                    <BulbOutlined /> 遇到困难？查看提示
                  </Button>
                ) : (
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200/80 text-sm">
                    <BulbOutlined className="mr-1 text-yellow-500" /> {step.hint}
                  </div>
                )}
              </div>
            </div>

            {/* 底部操作 */}
            <div className="border-t border-slate-700 p-4 flex gap-3 bg-slate-800">
              <Button icon={<ReloadOutlined />} onClick={handleReset} className="border-slate-600 bg-transparent text-slate-400 hover:border-white hover:text-white" title="重置环境" />
              {allTasksCompleted ? (
                <Button type="primary" className="flex-1 bg-green-500 border-none hover:bg-green-400" onClick={handleNextStep}>
                  {currentStep === lab.steps.length - 1 ? '完成实验' : '下一步'} <RightOutlined />
                </Button>
              ) : (
                <Button type="default" className="flex-1 border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white" onClick={handleNextStep}>
                  跳过此步 <RightOutlined />
                </Button>
              )}
            </div>
          </div>
        </Sider>

        {/* 右侧终端区 */}
        <Content className="relative bg-[#0f172a]">
          {!isReady ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Spin size="large" />
              <div className="mt-4">正在为您分配云原生实验沙箱...</div>
            </div>
          ) : (
            <Terminal ref={terminalRef} onCommand={handleCommand} />
          )}
          
          {/* 模拟浏览器标签页样式 */}
          <div className="absolute top-0 left-0 right-0 flex h-8 items-center bg-slate-800/80 px-2 backdrop-blur">
            <div className="flex items-center gap-1.5 px-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 flex h-6 items-center rounded-md bg-slate-700 px-3 text-xs text-slate-400">
              root@lab-sandbox:~
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Workspace;
