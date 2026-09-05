# 教师节留言板

一个温馨、暖色调的教师节留言板应用，支持多名同学提交留言，老师通过管理后台查看和管理所有留言。

## 功能特性

- 🎉 **留言提交**：姓名、班级、毕业年份、留言内容
- 🎓 **毕业年份选择**：1970届~2030届，共 61 个年份
- ✨ **祝福浮动动效**：背景浮动的教师节祝福语
- 🔐 **管理后台**：密码登录、查看所有留言、删除留言
- 📱 **响应式设计**：完美适配手机和电脑
- 💾 **数据持久化**：PostgreSQL + Drizzle ORM

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| 后端 | NestJS 10 + TypeScript |
| 数据库 | PostgreSQL + Drizzle ORM |
| HTTP | Axios |
| UI 组件 | 自研轻量组件（Button / Input / Textarea / Badge） |

## 项目结构

```
teacher-message-board-pure/
├── server/                  # NestJS 后端
│   ├── main.ts              # 应用入口
│   ├── app.module.ts        # 根模块
│   ├── database/
│   │   ├── index.ts         # 数据库连接
│   │   └── schema.ts        # Drizzle ORM schema
│   └── modules/message/     # 留言模块（Controller + Service + Module）
├── src/                     # React 前端
│   ├── main.tsx             # 应用入口
│   ├── App.tsx              # 路由配置
│   ├── api/messages.ts      # API 调用
│   ├── pages/               # 页面组件
│   │   ├── MessagePage.tsx  # 留言提交页
│   │   ├── AdminPage.tsx    # 管理后台页
│   │   └── NotFound.tsx     # 404 页
│   ├── hooks/               # 自定义 hooks
│   ├── components/ui/       # UI 基础组件
│   └── lib/utils.ts         # 工具函数
├── shared/
│   └── api.interface.ts     # 前后端共享类型
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── drizzle.config.ts        # Drizzle 配置
├── tsconfig.json            # 前端 TS 配置
├── tsconfig.server.json     # 后端 TS 配置
├── package.json
└── .env.example             # 环境变量示例
```

## 快速开始

### 1. 环境要求

- **Node.js** >= 18.x（推荐 20+）
- **PostgreSQL** >= 13
- **npm** >= 9.x

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

环境变量说明：

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| `DATABASE_URL` | ✅ | - | PostgreSQL 连接字符串，如 `postgresql://user:pass@localhost:5432/dbname` |
| `ADMIN_PASSWORD` | ❌ | `123456` | 管理后台登录密码 |
| `PORT` | ❌ | `3000` | 后端服务端口 |
| `CORS_ORIGIN` | ❌ | `*` | 允许的跨域源（生产环境建议设置具体域名） |
| `NODE_ENV` | ❌ | - | 运行环境，`production` 时托管前端静态文件 |

### 4. 准备数据库

确保 PostgreSQL 已启动，并创建数据库：

```sql
CREATE DATABASE teacher_message;
```

### 5. 初始化数据库表

```bash
# 生成迁移文件
npm run db:generate

# 执行迁移（首次建表用 push 更简单）
npm run db:push
```

### 6. 启动开发环境

```bash
npm run dev
```

该命令会同时启动：
- 前端开发服务器：`http://localhost:5173`
- 后端 API 服务：`http://localhost:3000`

前端已配置代理，`/api` 请求会自动转发到后端，直接访问 `http://localhost:5173` 即可使用。

## 管理后台

访问 `http://localhost:5173/admin` 进入管理后台。

默认密码：`123456`（通过 `ADMIN_PASSWORD` 环境变量修改）。

## 生产部署

### 方式一：Vercel + 外部 PostgreSQL（推荐新手）

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 上 import 该仓库
3. 配置环境变量：
   - `DATABASE_URL`：你的 PostgreSQL 连接字符串（可用 Supabase / Neon / Railway 等）
   - `ADMIN_PASSWORD`：管理密码
4. 配置 Build Command：`npm run build`
5. 配置 Output Directory：`dist/client`
6. 部署完成后，后端也需要单独部署。可将后端部署到 Railway / Render / Fly.io 等平台，前端通过 API 地址调用

> 由于 Vercel 主要是前端/Serverless 平台，NestJS 后端推荐部署到专门的 Node.js 托管平台。

### 方式二：单服务器自建（最简单）

1. 在服务器上安装 Node.js 和 PostgreSQL
2. 克隆代码，配置 `.env`
3. 构建并启动：

```bash
npm install
npm run build
NODE_ENV=production npm start
```

4. 用 Nginx 做反向代理（可选）

### 方式三：Docker 部署

可自行编写 Dockerfile 和 docker-compose.yml，包含 app + postgres 两个服务。

## API 接口

所有接口路径前缀为 `/api`。

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/messages` | 提交留言 |
| POST | `/messages/admin/verify` | 验证管理密码 |
| POST | `/messages/admin/list` | 获取留言列表（需密码） |
| DELETE | `/messages/admin/:id` | 删除留言（需密码） |
| GET | `/messages/health` | 健康检查 |

### 提交留言

请求体：
```json
{
  "graduateYear": "2020届",
  "className": "3班",
  "studentName": "张三",
  "content": "老师您辛苦了！"
}
```

响应：
```json
{
  "id": "uuid",
  "graduateYear": "2020届",
  "className": "3班",
  "studentName": "张三",
  "content": "老师您辛苦了！",
  "createdAt": "2024-09-10T08:00:00.000Z"
}
```

## 自定义

- **修改主题色**：编辑 `src/index.css` 中的 `@theme` 块
- **修改祝福语文案**：编辑 `src/hooks/useFloatingBlessings.ts` 中的 `BLESSING_TEXTS`
- **修改年份范围**：编辑 `src/pages/MessagePage.tsx` 中的 `GRADUATE_YEARS`

## License

MIT
