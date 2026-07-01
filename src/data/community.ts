export interface CommunityTopic {
  id: string;
  title: string;
  author: string;
  authorTitle: string;
  tags: string[];
  views: number;
  replies: number;
  likes: number;
  createdAt: string;
  summary: string;
  content: string[];
  repliesList: Array<{
    id: string;
    author: string;
    createdAt: string;
    content: string;
  }>;
}

export interface CommunityArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
}

export const communityTopics: CommunityTopic[] = [
  {
    id: 'topic-1',
    title: 'Nginx 反向代理后 WebSocket 连接失败怎么排查？',
    author: '运维新人阿杰',
    authorTitle: '初级运维工程师',
    tags: ['Nginx', 'WebSocket', '排障'],
    views: 1280,
    replies: 18,
    likes: 36,
    createdAt: '2026-07-01 10:20',
    summary: '已经配置了反向代理，普通 HTTP 正常，但 WebSocket 握手失败，想确认排查顺序。',
    content: [
      '现象是页面能打开，但进入实时日志或通知页面后，浏览器控制台提示 WebSocket 连接失败。',
      '当前 Nginx 反向代理到了 3000 端口，普通接口返回正常，所以怀疑是升级头或者超时配置问题。',
      '我目前已经检查了 upstream 服务本身是正常的，想请教大家这种情况一般先看哪些配置项。'
    ],
    repliesList: [
      {
        id: 'r-1',
        author: '老王说运维',
        createdAt: '2026-07-01 11:02',
        content: '先确认 location 里有没有 proxy_http_version 1.1、Upgrade 和 Connection 这三项，再看后端是否真的支持 ws。'
      },
      {
        id: 'r-2',
        author: '容器观测员',
        createdAt: '2026-07-01 11:35',
        content: '除了 Header，还要检查负载均衡层和 CDN 有没有把长连接截断，很多人只盯 Nginx。'
      }
    ]
  },
  {
    id: 'topic-2',
    title: 'Linux 新手第一台云服务器该怎么做基础安全加固？',
    author: '云上小白',
    authorTitle: '在校学生',
    tags: ['Linux', '安全加固', '入门'],
    views: 970,
    replies: 12,
    likes: 28,
    createdAt: '2026-06-30 21:10',
    summary: '刚买了第一台云服务器，希望有一个适合小白执行的最小安全基线清单。',
    content: [
      '目前只做了修改 SSH 端口和设置复杂密码，感觉还不太够。',
      '机器上后续会部署 Nginx 和个人博客，不知道防火墙、日志审计、Fail2ban 这些要不要一开始就配。'
    ],
    repliesList: [
      {
        id: 'r-1',
        author: '安全巡检员',
        createdAt: '2026-06-30 22:00',
        content: '优先级最高的是禁用 root 直登、配置密钥登录、启用防火墙和安全组最小暴露。'
      }
    ]
  },
  {
    id: 'topic-3',
    title: '生产环境日志太大，大家一般怎么做轮转和保留？',
    author: '日志巡检员',
    authorTitle: '中级运维工程师',
    tags: ['日志', 'logrotate', '最佳实践'],
    views: 846,
    replies: 15,
    likes: 22,
    createdAt: '2026-06-29 15:45',
    summary: '应用日志、Nginx 日志和容器日志增长很快，想参考大家在线上环境的轮转经验。',
    content: [
      '现在线上主要问题是日志文件过大导致磁盘告警，有些服务写日志非常频繁。',
      '想了解大家一般会怎么规划按天轮转、压缩保留周期，以及如何配合集中日志平台做归档。'
    ],
    repliesList: [
      {
        id: 'r-1',
        author: 'SRE 阿辰',
        createdAt: '2026-06-29 16:10',
        content: '本地节点主要负责短期保留和兜底，长期查询还是建议进 ELK 或 Loki，别把所有压力都留在业务机。'
      }
    ]
  }
];

export const communityArticles: CommunityArticle[] = [
  {
    id: 'article-1',
    title: '从 0 到 1 搭建运维学习路线图',
    summary: '把 Linux、网络、Web 服务、容器和自动化串成一条适合小白的成长路径。',
    category: '成长路线'
  },
  {
    id: 'article-2',
    title: '服务器磁盘爆满后的标准排查顺序',
    summary: '用 df、du、journalctl 和日志轮转思路快速定位并止血。',
    category: '故障复盘'
  },
  {
    id: 'article-3',
    title: '为什么每个运维都该会一点 Shell',
    summary: '把重复操作脚本化，是从执行者走向工程化的第一步。',
    category: '经验分享'
  }
];
