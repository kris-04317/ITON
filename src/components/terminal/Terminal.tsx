import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export interface TerminalRef {
  write: (text: string) => void;
  writeln: (text: string) => void;
  clear: () => void;
  focus: () => void;
}

interface TerminalProps {
  onCommand?: (command: string) => void;
  className?: string;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(({ onCommand, className = '' }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState(-1);

  const prompt = '\\r\\n\\x1b[32mroot@lab-12345\\x1b[0m:\\x1b[34m~\\x1b[0m# ';

  useImperativeHandle(ref, () => ({
    write: (text: string) => xtermRef.current?.write(text),
    writeln: (text: string) => xtermRef.current?.writeln(text),
    clear: () => {
      xtermRef.current?.clear();
      xtermRef.current?.write(prompt);
      setInput('');
    },
    focus: () => xtermRef.current?.focus(),
  }));

  useEffect(() => {
    if (!terminalRef.current) return;

    // 初始化 xterm
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#10b981',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 初始欢迎语
    term.writeln('\\x1b[1;36mWelcome to IT OpsMaster Lab!\\x1b[0m');
    term.writeln('This is a simulated terminal environment.');
    term.writeln('Type \\x1b[33mhelp\\x1b[0m to see available commands.');
    term.write(prompt);

    // 处理输入
    term.onData(e => {
      switch (e) {
        case '\\r': // Enter
          term.write('\\r\\n');
          if (input.trim()) {
            setHistory(prev => [...prev, input]);
            setHistoryIndex(-1);
            if (onCommand) {
              onCommand(input.trim());
            } else {
              // 简单的内置命令模拟
              const cmd = input.trim().split(' ')[0];
              if (cmd === 'help') {
                term.writeln('Available commands: ls, pwd, clear, help, whoami, date, echo');
              } else if (cmd === 'clear') {
                term.clear();
              } else if (cmd === 'whoami') {
                term.writeln('root');
              } else if (cmd === 'pwd') {
                term.writeln('/root');
              } else if (cmd === 'date') {
                term.writeln(new Date().toString());
              } else if (cmd === 'echo') {
                term.writeln(input.substring(5));
              } else if (cmd === 'ls') {
                term.writeln('\\x1b[1;34m.\\x1b[0m  \\x1b[1;34m..\\x1b[0m  test.txt  \\x1b[1;34mdocs\\x1b[0m');
              } else if (cmd !== '') {
                term.writeln(`bash: ${cmd}: command not found`);
              }
            }
          }
          term.write(prompt);
          setInput('');
          break;
        case '\\x7F': // Backspace
          if (term.buffer.active.cursorX > 21) { // 提示符长度约21
            term.write('\\b \\b');
            setInput(prev => prev.slice(0, -1));
          }
          break;
        case '\\x1b[A': // Up arrow
          setHistoryIndex(prev => {
            const nextIndex = prev < history.length - 1 ? prev + 1 : prev;
            if (nextIndex >= 0 && history.length > 0) {
              const cmd = history[history.length - 1 - nextIndex];
              // 清除当前输入
              term.write('\\b \\b'.repeat(input.length));
              term.write(cmd);
              setInput(cmd);
            }
            return nextIndex;
          });
          break;
        case '\\x1b[B': // Down arrow
          setHistoryIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : -1;
            // 清除当前输入
            term.write('\\b \\b'.repeat(input.length));
            if (nextIndex >= 0) {
              const cmd = history[history.length - 1 - nextIndex];
              term.write(cmd);
              setInput(cmd);
            } else {
              setInput('');
            }
            return nextIndex;
          });
          break;
        case '\\u0003': // Ctrl+C
          term.write('^C');
          term.write(prompt);
          setInput('');
          break;
        default: // 普通字符
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\\u00a0') {
            term.write(e);
            setInput(prev => prev + e);
          }
      }
    });

    // 窗口大小变化时自适应
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className={`h-full w-full overflow-hidden bg-slate-900 p-2 ${className}`} 
    />
  );
});

Terminal.displayName = 'Terminal';

export default Terminal;
