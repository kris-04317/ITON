const e=[{id:"linux-basic",title:"Linux基础入门",description:"从0开始学Linux，运维小白的第一课。掌握文件系统、命令行、用户权限等核心概念，打下扎实的Linux基础。",cover:"https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=linux%20penguin%20mascot%20operating%20system%20minimalist%20blue%20tech%20style&image_size=landscape_16_9",level:"beginner",duration:300,chapterCount:10,studentCount:12345,rating:4.9,category:"Linux",tags:["入门","Linux","命令行"],chapters:[{id:"ch1",title:"Linux简介与安装",order:1,estimatedTime:30,content:`# 第1章 Linux简介与安装

## 1.1 什么是Linux

Linux 是一套免费使用和自由传播的类 Unix 操作系统，是一个基于 POSIX 和 Unix 的多用户、多任务、支持多线程和多 CPU 的操作系统。

### Linux 的特点

- **开源免费**：源代码公开，任何人都可以免费使用和修改
- **稳定高效**：服务器领域的首选，可运行数年不宕机
- **安全可靠**：用户权限模型严格，病毒少
- **多任务多用户**：同时支持多个用户登录和多个任务运行
- **强大的网络功能**：内置各种网络服务和工具

### 常见的Linux发行版

| 发行版 | 特点 | 适用场景 |
|--------|------|----------|
| CentOS / Rocky Linux | 稳定、企业级 | 服务器 |
| Ubuntu | 易用、社区活跃 | 桌面/服务器 |
| Debian | 稳定、软件包丰富 | 服务器/嵌入式 |
| Fedora | 新技术、更新快 | 开发/测试 |
| Arch Linux | 滚动更新、高度定制 | 技术爱好者 |

## 1.2 Linux安装方式

### 方式一：虚拟机安装（推荐新手）

使用 VMware 或 VirtualBox 在 Windows 上安装虚拟机：

1. 下载 VMware Workstation / VirtualBox
2. 下载 CentOS 7 或 Ubuntu 20.04 镜像
3. 创建虚拟机，分配 2G 内存 + 20G 硬盘
4. 挂载镜像，按照向导安装

### 方式二：云服务器

使用阿里云、腾讯云等云服务：

1. 注册云服务商账号
2. 购买一台轻量应用服务器
3. 选择 CentOS/Ubuntu 系统镜像
4. 通过 SSH 远程连接

### 方式三：WSL (Windows Subsystem for Linux)

Windows 10/11 自带的 Linux 子系统：

\`\`\`powershell
# 在 PowerShell 中启用 WSL
wsl --install
# 安装 Ubuntu
wsl --install -d Ubuntu
\`\`\`

## 1.3 第一次登录

安装完成后，使用 root 用户登录：

\`\`\`bash
# 本地登录
localhost login: root
Password: ********

# 远程登录（SSH）
ssh root@192.168.1.100
\`\`\`

登录成功后你会看到类似这样的提示符：

\`\`\`
[root@localhost ~]#
\`\`\`

- \`root\`：当前用户名
- \`localhost\`：主机名
- \`~\`：当前目录（~ 表示用户家目录）
- \`#\`：root 用户提示符（普通用户是 $）

💡 **小提示**：生产环境中不建议直接使用 root 用户日常操作，应该创建普通用户，需要时用 sudo 提升权限。
`},{id:"ch2",title:"文件系统与目录结构",order:2,estimatedTime:30,relatedLabId:"linux-commands",content:`# 第2章 文件系统与目录结构

## 2.1 Linux文件系统结构

Linux 的文件系统是一个**倒置的树状结构**，所有文件都在 \`/\`（根目录）下面。

\`\`\`
/
├── bin/        # 基本命令（二进制）
├── boot/       # 启动相关文件
├── dev/        # 设备文件
├── etc/        # 配置文件
├── home/       # 普通用户家目录
├── lib/        # 库文件
├── media/      # 可移动设备挂载点
├── mnt/        # 临时挂载点
├── opt/        # 可选软件包
├── proc/       # 进程信息（虚拟文件系统）
├── root/       # root用户家目录
├── run/        # 运行时数据
├── sbin/       # 系统管理命令
├── srv/        # 服务数据
├── sys/        # 系统信息（虚拟文件系统）
├── tmp/        # 临时文件
├── usr/        # 用户程序和数据
│   ├── bin/    # 用户命令
│   ├── sbin/   # 系统管理命令
│   ├── lib/    # 库文件
│   ├── local/  # 本地安装软件
│   └── share/  # 共享数据
└── var/        # 可变数据
    ├── log/    # 日志文件
    ├── spool/  # 邮件/打印队列
    └── tmp/    # 临时文件
\`\`\`

## 2.2 重要目录速记

| 目录 | 作用 | 记忆技巧 |
|------|------|----------|
| /etc | 配置文件 | etcetera（等等），各种配置都在这 |
| /var/log | 日志文件 | variable log，变化的日志 |
| /home | 用户家目录 | 每个用户有一个子目录 |
| /root | root家目录 | 管理员的家，不在/home里 |
| /tmp | 临时文件 | temporary，重启可能会清空 |
| /usr/bin | 用户命令 | user binary，大部分命令在这 |
| /usr/local | 本地安装 | 自己编译的软件放这 |

## 2.3 绝对路径 vs 相对路径

- **绝对路径**：从根目录 \`/\` 开始的完整路径
  - 例如：\`/etc/nginx/nginx.conf\`
  - 不管你在哪，绝对路径都指向同一个文件

- **相对路径**：从当前目录开始的路径
  - 例如：\`./config/settings.conf\`
  - \`.\` 表示当前目录
  - \`..\` 表示上级目录
  - \`~\` 表示当前用户的家目录

\`\`\`bash
# 假设当前在 /home/user 目录下

# 绝对路径
cd /etc/nginx

# 相对路径
cd ../../etc/nginx

# 回到家目录
cd ~
cd      # 不加参数也能回家
cd -    # 回到上一次的目录
\`\`\`

## 2.4 文件类型

Linux 中一切皆文件，常见的文件类型：

| 符号 | 类型 | 说明 |
|------|------|------|
| \`-\` | 普通文件 | 文本、二进制、压缩包等 |
| \`d\` | 目录文件 | 文件夹 |
| \`l\` | 软链接 | 类似Windows快捷方式 |
| \`b\` | 块设备 | 硬盘、U盘等 |
| \`c\` | 字符设备 | 键盘、鼠标、终端等 |
| \`p\` | 管道文件 | 进程间通信用 |
| \`s\` | 套接字 | 网络通信用 |

使用 \`ls -l\` 命令查看文件类型，第一个字符就是文件类型。
`},{id:"ch3",title:"文件操作命令",order:3,estimatedTime:40,relatedLabId:"linux-commands",content:`# 第3章 文件操作命令

## 3.1 ls - 列出目录内容

\`ls\` 是最常用的命令，用来查看目录里有什么。

### 常用选项

| 选项 | 说明 |
|------|------|
| \`-l\` | 长格式，显示详细信息 |
| \`-a\` | 显示所有文件（含隐藏文件） |
| \`-h\` | 人类可读的大小（K/M/G） |
| \`-t\` | 按修改时间排序 |
| \`-r\` | 反向排序 |
| \`-R\` | 递归显示子目录 |

### 实战示例

**示例1：查看当前目录文件**

\`\`\`bash
ls -lah
\`\`\`

输出：
\`\`\`
total 24K
drwxr-xr-x  3 root root 4.0K Jun 30 10:00 .
drwxr-xr-x  1 root root 4.0K Jun 28 09:00 ..
-rw-r--r--  1 root root  123 Jun 30 09:30 test.txt
drwxr-xr-x  2 root root 4.0K Jun 30 09:59 docs
\`\`\`

**示例2：查看最近修改的文件**

\`\`\`bash
ls -lht | head -10
\`\`\`

💡 **老司机经验**：\`ll\` 是 \`ls -l\` 的别名，几乎每个运维都在用。可以用 \`alias ll='ls -l --color=auto'\` 来设置。

## 3.2 cd - 切换目录

\`\`\`bash
cd /etc        # 切换到/etc目录
cd ..          # 回到上级目录
cd -           # 回到上一次的目录
cd ~           # 回到家目录
cd             # 不加参数也是回家
\`\`\`

## 3.3 pwd - 显示当前路径

\`\`\`bash
pwd
# 输出：/etc/nginx
\`\`\`

## 3.4 mkdir - 创建目录

\`\`\`bash
mkdir test           # 创建单个目录
mkdir -p a/b/c       # 递归创建多级目录
mkdir -m 755 dir     # 创建时指定权限
\`\`\`

## 3.5 touch - 创建空文件 / 修改时间戳

\`\`\`bash
touch file.txt       # 创建空文件（不存在则创建）
touch file1 file2    # 同时创建多个
touch -d "2024-01-01" file.txt  # 修改文件时间
\`\`\`

## 3.6 cp - 复制文件/目录

\`\`\`bash
cp file1.txt file2.txt       # 复制文件
cp -r dir1 dir2              # 复制目录（递归）
cp -p file1 file2            # 保留属性（权限、时间）
cp -a dir1 dir2              # 归档复制（保留所有属性）
\`\`\`

## 3.7 mv - 移动/重命名

\`\`\`bash
mv oldname newname           # 重命名
mv file.txt /tmp/            # 移动文件
mv dir1 /opt/                # 移动目录
mv file1 file2 dir/          # 移动多个文件到目录
\`\`\`

## 3.8 rm - 删除文件/目录

⚠️ **危险命令，删除前请三思！**

\`\`\`bash
rm file.txt           # 删除文件
rm -r dir/            # 删除目录（递归）
rm -f file.txt        # 强制删除，不提示
rm -rf dir/           # 强制递归删除（慎用！）

# 绝对不要运行的命令：
# rm -rf /   ← 会删除整个系统！
\`\`\`

💡 **安全建议**：可以用 \`alias rm='rm -i'\` 开启删除前确认，或安装 \`trash-cli\` 替代 rm。

## 3.9 find - 查找文件

功能强大的文件查找命令：

\`\`\`bash
# 按名称查找
find /etc -name "*.conf"

# 按类型查找（f=文件，d=目录）
find /var -type f -name "*.log"

# 按大小查找（+10M = 大于10M）
find /tmp -size +10M -size -100M

# 按时间查找（-mtime 修改时间，+7 = 7天前）
find /var/log -mtime +7 -name "*.log"

# 查找后执行操作（批量删除7天前的日志）
find /var/log -mtime +7 -name "*.log" -exec rm -f {} ;
\`\`\`

🧪 **去实验台练练手**：Linux基础命令练习 →
`},{id:"ch4",title:"用户与权限管理",order:4,estimatedTime:35,relatedLabId:"user-permission",content:`# 第4章 用户与权限管理

## 4.1 Linux用户体系

Linux 是多用户操作系统，用户分为三类：

- **root**：超级管理员，拥有所有权限（UID=0）
- **系统用户**：运行系统服务的用户，不能登录（UID=1-999）
- **普通用户**：真实用户，权限有限（UID=1000+）

### 用户相关配置文件

| 文件 | 作用 |
|------|------|
| /etc/passwd | 用户信息 |
| /etc/shadow | 用户密码（加密） |
| /etc/group | 组信息 |
| /etc/gshadow | 组密码 |

## 4.2 用户管理命令

### 创建用户 useradd

\`\`\`bash
useradd zhangsan            # 创建用户
useradd -m lisi             # 创建用户并创建家目录
useradd -u 1005 wangwu      # 指定UID
useradd -g dev zhaoliu      # 指定用户组
useradd -s /bin/bash sunqi  # 指定shell
useradd -G wheel,dev ba     # 指定附加组
\`\`\`

### 设置密码 passwd

\`\`\`bash
passwd zhangsan             # 设置用户密码
passwd -l zhangsan          # 锁定用户
passwd -u zhangsan          # 解锁用户
passwd -d zhangsan          # 删除密码
\`\`\`

### 修改用户 usermod

\`\`\`bash
usermod -s /sbin/nologin zhangsan   # 修改shell（禁止登录）
usermod -aG docker zhangsan         # 添加到docker组（-a追加）
usermod -l newname oldname          # 修改用户名
usermod -L zhangsan                 # 锁定用户
\`\`\`

### 删除用户 userdel

\`\`\`bash
userdel zhangsan             # 删除用户（保留家目录）
userdel -r zhangsan          # 删除用户并删除家目录
\`\`\`

### 切换用户 su

\`\`\`bash
su - zhangsan                # 切换用户（完全切换环境）
su zhangsan                  # 切换用户（不换环境）
su - root                    # 切换到root
sudo command                 # 以root身份执行命令
\`\`\`

## 4.3 用户组管理

\`\`\`bash
groupadd devops              # 创建组
groupdel devops              # 删除组
groupmod -n newname oldname  # 修改组名

# 查看用户所属组
groups zhangsan
id zhangsan
\`\`\`

## 4.4 文件权限详解

使用 \`ls -l\` 查看权限：

\`\`\`
-rw-r--r-- 1 root root 123 Jun 30 10:00 test.txt
drwxr-xr-x 2 root root  64 Jun 30 09:00 docs/
lrwxrwxrwx 1 root root  10 Jun 30 08:00 link -> /tmp/file
\`\`\`

权限位解读：

\`\`\`
-  rw-  r--  r--  root  root  ...
│  └┬─┘ └┬─┘ └┬─┘
│   │    │    └─ 其他用户权限 (others)
│   │    └────── 同组用户权限 (group)
│   └─────────── 文件所有者权限 (owner)
└─────────────── 文件类型
\`\`\`

### 权限表示

| 符号 | 数值 | 对文件的权限 | 对目录的权限 |
|------|------|-------------|-------------|
| r | 4 | 可读 | 可列出内容 |
| w | 2 | 可写 | 可增删文件 |
| x | 1 | 可执行 | 可进入(cd) |

### chmod - 修改权限

\`\`\`bash
# 数字方式（推荐）
chmod 755 file.txt          # rwxr-xr-x
chmod 644 file.txt          # rw-r--r--
chmod 777 dir/              # rwxrwxrwx（不安全）

# 符号方式
chmod u+x file.sh           # 给所有者加执行权限
chmod g-w file.txt          # 给组去掉写权限
chmod o+r file.txt          # 给其他人加读权限
chmod a+x file.sh           # 所有人加执行权限
chmod -R 755 dir/           # 递归修改
\`\`\`

### chown - 修改所有者

\`\`\`bash
chown zhangsan file.txt          # 修改所有者
chown zhangsan:devops file.txt   # 修改所有者和组
chown -R zhangsan:devops dir/    # 递归修改
chgrp devops file.txt            # 只修改组
\`\`\`

## 4.5 特殊权限

### SUID（4000）

- 对二进制程序有效，执行时以文件所有者身份运行
- 例如：\`/usr/bin/passwd\` 命令

### SGID（2000）

- 对文件：执行时以文件所属组身份运行
- 对目录：目录内新建文件的组自动继承目录的组

### Sticky Bit（1000）

- 对目录设置，用户只能删除自己的文件
- 例如：\`/tmp\` 目录

\`\`\`bash
chmod 4755 /usr/bin/passwd   # 设置SUID
chmod 2755 /data/share       # 设置SGID
chmod 1777 /tmp              # 设置粘滞位
\`\`\`

🧪 **去实验台练练手**：用户与权限管理实战 →
`},{id:"ch5",title:"进程管理",order:5,estimatedTime:30,content:`# 第5章 进程管理

## 5.1 什么是进程

进程是正在运行的程序的实例。每个进程有：
- PID（进程ID）：唯一标识
- PPID（父进程ID）
- 用户/组
- 状态（运行、等待、停止、僵尸）
- 内存/CPU使用情况

## 5.2 ps - 查看进程

\`\`\`bash
ps aux                    # 查看所有进程（BSD风格）
ps -ef                    # 查看所有进程（System V风格）
ps -u root                # 查看root用户的进程
ps -ef | grep nginx       # 查找特定进程
\`\`\`

**ps aux 输出字段说明：**

| 字段 | 说明 |
|------|------|
| USER | 进程所有者 |
| PID | 进程ID |
| %CPU | CPU使用率 |
| %MEM | 内存使用率 |
| VSZ | 虚拟内存大小(KB) |
| RSS | 物理内存大小(KB) |
| STAT | 进程状态 |
| START | 启动时间 |
| TIME | CPU使用时间 |
| COMMAND | 命令 |

**进程状态：**
- R：运行中
- S：睡眠（等待）
- D：不可中断睡眠（IO等待）
- T：停止
- Z：僵尸进程
- <：高优先级
- N：低优先级
- s：会话首进程
- l：多线程
- +：前台进程组

## 5.3 top - 实时监控进程

\`\`\`bash
top           # 启动top
top -u nginx  # 只看nginx用户的进程
top -p 1234   # 只看指定PID
\`\`\`

**top 常用交互命令：**
- \`P\`：按CPU排序
- \`M\`：按内存排序
- \`T\`：按运行时间排序
- \`k\`：杀死进程
- \`q\`：退出
- \`1\`：显示多核CPU
- \`h\`：帮助

## 5.4 htop - 更友好的top

\`htop\` 是 top 的增强版，更直观易用（需要额外安装）：

\`\`\`bash
# CentOS
yum install htop -y

# Ubuntu
apt install htop -y
\`\`\`

## 5.5 kill - 终止进程

\`\`\`bash
kill 1234              # 发送TERM信号（优雅退出）
kill -15 1234          # 同上
kill -9 1234           # 强制杀死（SIGKILL）
kill -HUP 1234         # 重启进程（SIGHUP）

# 按名称杀进程
killall nginx
pkill -f "python app.py"

# 查看所有信号
kill -l
\`\`\`

⚠️ **注意**：\`kill -9\` 是最后手段，会强制终止进程，可能导致数据丢失。优先用 \`kill -15\` 让进程优雅退出。

## 5.6 进程优先级

用 \`nice\` 和 \`renice\` 调整进程优先级：

- NI 值范围：-20 ~ 19，数值越小优先级越高
- 普通用户只能调低优先级（NI增大）
- root 可以调整到任意优先级

\`\`\`bash
nice -n 10 command       # 以NI=10启动
renice 10 -p 1234        # 修改已运行进程的优先级
renice -5 -u nginx       # 修改用户所有进程
\`\`\`

## 5.7 前后台作业

\`\`\`bash
# 后台运行
command &

# 查看后台作业
jobs

# 把后台作业调到前台
fg %1

# 把前台作业放到后台（先按Ctrl+Z暂停）
bg %1

# 杀死后台作业
kill %1
\`\`\`

## 5.8 nohup - 不挂起运行

让程序在退出终端后继续运行：

\`\`\`bash
nohup ./app.sh &
# 输出默认写入 nohup.out

nohup ./app.sh > app.log 2>&1 &
# 自定义输出文件
\`\`\`

更现代的方案：\`screen\`、\`tmux\`、\`systemd\` 服务。
`},{id:"ch6",title:"网络基础与命令",order:6,estimatedTime:35,content:`# 第6章 网络基础与命令

## 6.1 OSI七层模型

| 层级 | 名称 | 协议/设备 |
|------|------|-----------|
| 7 | 应用层 | HTTP/FTP/DNS |
| 6 | 表示层 | 加密/格式转换 |
| 5 | 会话层 | 会话管理 |
| 4 | 传输层 | TCP/UDP |
| 3 | 网络层 | IP/路由器 |
| 2 | 数据链路层 | MAC/交换机 |
| 1 | 物理层 | 网线/光纤 |

实际工作中常用的是五层模型：应用层 → 传输层 → 网络层 → 数据链路层 → 物理层

## 6.2 TCP vs UDP

| 特性 | TCP | UDP |
|------|-----|-----|
| 连接性 | 面向连接 | 无连接 |
| 可靠性 | 可靠传输 | 不可靠 |
| 顺序 | 保证顺序 | 不保证 |
| 速度 | 较慢 | 快 |
| 流量控制 | 有 | 无 |
| 适用场景 | HTTP/FTP/SSH | DNS/视频/直播 |

### TCP三次握手

\`\`\`
客户端 → SYN → 服务端
客户端 ← SYN+ACK ← 服务端
客户端 → ACK → 服务端
（连接建立）
\`\`\`

### TCP四次挥手

\`\`\`
客户端 → FIN → 服务端
客户端 ← ACK ← 服务端
客户端 ← FIN ← 服务端
客户端 → ACK → 服务端
（连接关闭）
\`\`\`

## 6.3 IP地址与子网

### IP地址分类

- A类：1.0.0.0 ~ 126.255.255.255（默认掩码 255.0.0.0）
- B类：128.0.0.0 ~ 191.255.255.255（默认掩码 255.255.0.0）
- C类：192.0.0.0 ~ 223.255.255.255（默认掩码 255.255.255.0）
- D类：224.0.0.0 ~ 239.255.255.255（组播）
- E类：240.0.0.0 ~ 255.255.255.255（保留）

### 私有IP地址

- A类私有：10.0.0.0 ~ 10.255.255.255
- B类私有：172.16.0.0 ~ 172.31.255.255
- C类私有：192.168.0.0 ~ 192.168.255.255

## 6.4 常用网络命令

### ifconfig / ip addr - 查看网卡信息

\`\`\`bash
ip addr                       # 查看所有网卡
ip addr show eth0             # 查看指定网卡
ip link show                  # 查看链路层信息
\`\`\`

### ping - 测试连通性

\`\`\`bash
ping 192.168.1.1
ping -c 4 baidu.com           # 只发4个包
ping -i 0.5 192.168.1.1       # 间隔0.5秒
ping -s 1000 baidu.com        # 指定包大小
\`\`\`

### traceroute - 路由追踪

\`\`\`bash
traceroute baidu.com
mtr baidu.com                 # 更好用的traceroute（动态）
\`\`\`

### netstat / ss - 查看端口和连接

\`\`\`bash
netstat -tlnp                 # 查看监听的TCP端口
netstat -anp                  # 查看所有连接
ss -tlnp                      # 同netstat（更快）
ss -s                         # 连接统计
\`\`\`

### telnet / nc - 测试端口连通性

\`\`\`bash
telnet 192.168.1.1 80
nc -zv 192.168.1.1 1-100      # 扫描端口范围
\`\`\`

### curl - 发送HTTP请求

\`\`\`bash
curl http://example.com
curl -I http://example.com    # 只看响应头
curl -X POST -d "a=1" url    # POST请求
curl -v http://example.com    # 详细输出
curl -H "Token: abc" url      # 自定义Header
\`\`\`

### dig / nslookup - DNS解析

\`\`\`bash
dig baidu.com
dig @8.8.8.8 baidu.com        # 指定DNS服务器
nslookup baidu.com
\`\`\`

## 6.5 常用端口速记

| 端口 | 服务 | 说明 |
|------|------|------|
| 21 | FTP | 文件传输 |
| 22 | SSH | 远程登录 |
| 23 | Telnet | 远程登录（不安全） |
| 25 | SMTP | 邮件发送 |
| 53 | DNS | 域名解析 |
| 80 | HTTP | Web服务 |
| 110 | POP3 | 邮件接收 |
| 143 | IMAP | 邮件接收 |
| 443 | HTTPS | 加密Web |
| 3306 | MySQL | 数据库 |
| 6379 | Redis | 缓存 |
| 8080 | HTTP-Proxy | 代理/备用HTTP |
`},{id:"ch7",title:"软件包管理",order:7,estimatedTime:30,content:`# 第7章 软件包管理

（内容待补充）`},{id:"ch8",title:"服务管理（systemd）",order:8,estimatedTime:25,content:`# 第8章 服务管理

（内容待补充）`},{id:"ch9",title:"日志查看与分析",order:9,estimatedTime:30,content:`# 第9章 日志查看与分析

（内容待补充）`},{id:"ch10",title:"综合实战：搭建FTP服务器",order:10,estimatedTime:45,content:`# 第10章 综合实战

（内容待补充）`}]},{id:"shell-basic",title:"Shell脚本入门到实战",description:"掌握Shell脚本编写，从变量到函数，从文本处理到自动化脚本，让重复工作一键完成。",cover:"https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shell%20script%20terminal%20code%20green%20hacker%20style%20dark%20background&image_size=landscape_16_9",level:"beginner",duration:240,chapterCount:8,studentCount:8234,rating:4.8,category:"Shell",tags:["入门","Shell","自动化"],chapters:[{id:"ch1",title:"Shell简介与第一个脚本",order:1,estimatedTime:25,content:`# 第1章 Shell简介与第一个脚本

（内容待补充）`},{id:"ch2",title:"变量与运算符",order:2,estimatedTime:30,content:`# 第2章 变量与运算符

（内容待补充）`},{id:"ch3",title:"条件判断与流程控制",order:3,estimatedTime:35,content:`# 第3章 条件判断与流程控制

（内容待补充）`},{id:"ch4",title:"循环语句",order:4,estimatedTime:35,content:`# 第4章 循环语句

（内容待补充）`},{id:"ch5",title:"函数与数组",order:5,estimatedTime:30,content:`# 第5章 函数与数组

（内容待补充）`},{id:"ch6",title:"文本处理三剑客",order:6,estimatedTime:40,relatedLabId:"shell-log-analysis",content:`# 第6章 文本处理三剑客

（内容待补充）`},{id:"ch7",title:"正则表达式",order:7,estimatedTime:30,content:`# 第7章 正则表达式

（内容待补充）`},{id:"ch8",title:"综合实战：自动化备份脚本",order:8,estimatedTime:45,content:`# 第8章 综合实战

（内容待补充）`}]},{id:"nginx-basic",title:"Nginx入门到实战",description:"从零开始学Nginx，搞定Web服务器、反向代理、负载均衡、HTTPS配置，运维必备技能。",cover:"https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nginx%20web%20server%20load%20balancing%20network%20architecture%20tech&image_size=landscape_16_9",level:"intermediate",duration:180,chapterCount:6,studentCount:6789,rating:4.7,category:"Web服务器",tags:["进阶","Nginx","Web服务"],chapters:[{id:"ch1",title:"Nginx简介与安装",order:1,estimatedTime:25,relatedLabId:"nginx-install",content:`# 第1章 Nginx简介与安装

（内容待补充）`},{id:"ch2",title:"配置文件详解",order:2,estimatedTime:35,content:`# 第2章 配置文件详解

（内容待补充）`},{id:"ch3",title:"静态资源服务",order:3,estimatedTime:30,content:`# 第3章 静态资源服务

（内容待补充）`},{id:"ch4",title:"反向代理与负载均衡",order:4,estimatedTime:35,content:`# 第4章 反向代理与负载均衡

（内容待补充）`},{id:"ch5",title:"HTTPS配置",order:5,estimatedTime:30,content:`# 第5章 HTTPS配置

（内容待补充）`},{id:"ch6",title:"性能调优与安全加固",order:6,estimatedTime:25,content:`# 第6章 性能调优与安全加固

（内容待补充）`}]},{id:"docker-basic",title:"Docker快速入门",description:"容器化时代必学技术，Docker基础命令、镜像构建、容器编排，迈向云原生第一步。",cover:"https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=docker%20container%20whale%20cloud%20native%20blue%20minimalist&image_size=landscape_16_9",level:"intermediate",duration:240,chapterCount:8,studentCount:5432,rating:4.8,category:"容器化",tags:["进阶","Docker","云原生"],chapters:[{id:"ch1",title:"Docker简介与安装",order:1,estimatedTime:30,relatedLabId:"docker-quickstart",content:`# 第1章 Docker简介与安装

（内容待补充）`},{id:"ch2",title:"镜像与容器基础",order:2,estimatedTime:35,content:`# 第2章 镜像与容器基础

（内容待补充）`},{id:"ch3",title:"Dockerfile详解",order:3,estimatedTime:40,content:`# 第3章 Dockerfile详解

（内容待补充）`},{id:"ch4",title:"数据卷与网络",order:4,estimatedTime:35,content:`# 第4章 数据卷与网络

（内容待补充）`},{id:"ch5",title:"Docker Compose",order:5,estimatedTime:35,content:`# 第5章 Docker Compose

（内容待补充）`},{id:"ch6",title:"镜像仓库",order:6,estimatedTime:25,content:`# 第6章 镜像仓库

（内容待补充）`},{id:"ch7",title:"实战：部署WordPress",order:7,estimatedTime:20,content:`# 第7章 实战：部署WordPress

（内容待补充）`},{id:"ch8",title:"Docker安全最佳实践",order:8,estimatedTime:20,content:`# 第8章 Docker安全最佳实践

（内容待补充）`}]}];export{e as l};
