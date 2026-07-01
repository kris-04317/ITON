import type { ConfigTemplate } from '@/types/tool';

export const templates: ConfigTemplate[] = [
  {
    id: 'nginx-proxy',
    title: 'Nginx 反向代理配置',
    description: '标准的Nginx反向代理配置，包含WebSocket支持和常用的Header设置',
    category: 'Nginx',
    icon: 'GlobalOutlined',
    language: 'nginx',
    code: `server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`
  },
  {
    id: 'docker-compose-lnmp',
    title: 'Docker Compose LNMP环境',
    description: '一键启动 Linux + Nginx + MySQL + PHP 环境',
    category: 'Docker',
    icon: 'ContainerOutlined',
    language: 'yaml',
    code: `version: '3'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
      - ./conf.d:/etc/nginx/conf.d
    depends_on:
      - php
  
  php:
    image: php:7.4-fpm-alpine
    volumes:
      - ./html:/var/www/html
  
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp
    volumes:
      - ./mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"`
  }
];
