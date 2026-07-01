import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

// 懒加载页面
const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const Paths = lazy(() => import('@/pages/paths'));
const PathDetail = lazy(() => import('@/pages/paths/detail'));
const Chapter = lazy(() => import('@/pages/paths/chapter'));
const Tools = lazy(() => import('@/pages/tools'));
const Commands = lazy(() => import('@/pages/tools/commands'));
const CommandDetail = lazy(() => import('@/pages/tools/command-detail'));
const Templates = lazy(() => import('@/pages/tools/templates'));
const JsonFormatter = lazy(() => import('@/pages/tools/json-formatter'));
const TimestampConverter = lazy(() => import('@/pages/tools/timestamp'));
const Base64Converter = lazy(() => import('@/pages/tools/base64'));
const RegexTester = lazy(() => import('@/pages/tools/regex'));
const Troubleshoot = lazy(() => import('@/pages/tools/troubleshoot'));
const Labs = lazy(() => import('@/pages/labs'));
const Workspace = lazy(() => import('@/pages/labs/workspace'));
const Profile = lazy(() => import('@/pages/profile'));
const Settings = lazy(() => import('@/pages/profile/settings'));
const Community = lazy(() => import('@/pages/community'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'paths', element: <Paths /> },
      { path: 'paths/:id', element: <PathDetail /> },
      { path: 'paths/:id/chapter/:chapterId', element: <Chapter /> },
      { path: 'tools', element: <Tools /> },
      { path: 'tools/commands', element: <Commands /> },
      { path: 'tools/commands/:id', element: <CommandDetail /> },
      { path: 'tools/templates', element: <Templates /> },
      { path: 'tools/json', element: <JsonFormatter /> },
      { path: 'tools/timestamp', element: <TimestampConverter /> },
      { path: 'tools/base64', element: <Base64Converter /> },
      { path: 'tools/regex', element: <RegexTester /> },
      { path: 'tools/troubleshoot', element: <Troubleshoot /> },
      { path: 'labs', element: <Labs /> },
      { path: 'community', element: <Community /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/settings', element: <Settings /> },
    ],
  },
  {
    path: '/labs/:id/workspace',
    element: <Workspace />, // 实验工作台不需要普通导航栏
  }
]);
