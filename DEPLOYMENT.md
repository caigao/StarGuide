# 🚀 星语向导 (StarGuide) 部署文档

> 本文档涵盖本地开发、Docker 容器化部署两种方式的完整流程。

---

## 目录

- [项目架构概览](#项目架构概览)
- [前置条件](#前置条件)
- [环境变量配置](#环境变量配置)
- [方式一：Docker 部署（推荐）](#方式一docker-部署推荐)
- [方式二：本地开发启动](#方式二本地开发启动)
- [访问与验证](#访问与验证)
- [默认账号](#默认账号)
- [常用运维命令](#常用运维命令)
- [目录结构说明](#目录结构说明)
- [常见问题排查](#常见问题排查)

---

## 项目架构概览

```
用户浏览器
    │
    ▼
┌─────────────────────────────┐
│  Frontend (React + Vite)    │  http://localhost:8080
│  Nginx 反向代理              │
│  /api/* → backend:5000      │
└────────────┬────────────────┘
             │ HTTP 代理
             ▼
┌─────────────────────────────┐
│  Backend (Flask)            │  http://localhost:5001
│  RESTful API                │
│  JWT 认证 + SQLite 数据库    │
│  Google Gemini AI 集成      │
└─────────────────────────────┘
```

| 服务 | 技术 | 容器端口 | 宿主端口 |
|------|------|----------|----------|
| 前端 | React 18 + Vite + Nginx | 80 | **8080** |
| 后端 | Python 3.10 + Flask | 5000 | **5001** |
| 数据库 | SQLite（文件持久化） | — | `./backend/starguide.db` |
| AI 引擎 | Google Gemini API | — | 外部 API |

---

## 前置条件

### Docker 部署

| 软件 | 最低版本 | 下载地址 |
|------|----------|----------|
| Docker Desktop | 4.x+ | https://www.docker.com/products/docker-desktop/ |
| Docker Compose | V2（内置） | 随 Docker Desktop 附带 |

> **Windows 注意**：启动 Docker Desktop 后，等待系统托盘图标变为白色鲸鱼且显示 "Engine running" 再执行部署命令。

### 本地开发

| 软件 | 最低版本 |
|------|----------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |

---

## 环境变量配置

在项目根目录创建或编辑 `.env` 文件：

```env
# =====================
# Gemini API 密钥（必填）
# 获取地址：https://aistudio.google.com/apikey
# =====================
GEMINI_API_KEY=your_gemini_api_key_here

# =====================
# 应用签名密钥（必填，用于 JWT Token 签名）
# 生产环境请使用足够长的随机字符串
# =====================
SECRET_KEY=your_strong_secret_key_here

# =====================
# 数据库连接（可选，默认 SQLite）
# =====================
DATABASE_URL=sqlite:///starguide.db
```

> ⚠️ **安全提示**：`.env` 文件已加入 `.gitignore`，请勿将其提交到代码仓库。生产环境请务必替换 `GEMINI_API_KEY` 和 `SECRET_KEY`。

---

## 方式一：Docker 部署（推荐）

### 1. 克隆项目 / 进入项目目录

```powershell
cd d:\Antigravity\StarGuide
```

### 2. 配置 `.env` 文件

参考上方 [环境变量配置](#环境变量配置) 填写必要参数。

### 3. 构建并启动所有服务

```powershell
docker compose up --build -d
```

- `--build`：重新构建镜像（首次部署或代码有更新时使用）
- `-d`：后台运行（detached 模式）

### 4. 查看启动日志

```powershell
# 实时查看所有服务日志
docker compose logs -f

# 仅查看后端日志
docker compose logs -f backend

# 仅查看前端日志
docker compose logs -f frontend
```

### 5. 验证部署

```powershell
# 查看容器运行状态
docker compose ps
```

输出示例：

```
NAME                   STATUS          PORTS
starguide-backend      Up              0.0.0.0:5001->5000/tcp
starguide-frontend     Up              0.0.0.0:8080->80/tcp
```

---

## 方式二：本地开发启动

### 后端

```powershell
cd d:\Antigravity\StarGuide\backend

# 创建虚拟环境（首次）
python -m venv venv
.\venv\Scripts\Activate.ps1

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python app.py
```

后端将运行在 `http://localhost:5000`

### 前端

```powershell
cd d:\Antigravity\StarGuide\frontend

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run dev
```

前端将运行在 `http://localhost:5173`，API 请求通过 Vite 代理转发至 `http://localhost:5000`。

---

## 访问与验证

部署成功后，使用浏览器访问：

| 页面 | 地址 |
|------|------|
| 🌐 应用主页 | http://localhost:8080 |
| 🔧 后端 API 健康检查 | http://localhost:5001/api/health（若有） |

---

## 默认账号

应用首次启动时会自动创建管理员账号：

| 字段 | 值 |
|------|----|
| 用户名 | `admin` |
| 密码 | `admin123` |
| 邮箱 | `admin@starguide.com` |
| 角色 | 管理员 👑 |

> ⚠️ **安全提示**：正式上线前请修改默认管理员密码。

---

## 常用运维命令

```powershell
# ── 启停控制 ──────────────────────────────
# 启动所有服务（已构建镜像）
docker compose up -d

# 停止并移除容器（数据不会丢失）
docker compose down

# 停止并移除容器 + 删除所有镜像（完全清理）
docker compose down --rmi all

# 重启所有服务
docker compose restart

# 重启单个服务
docker compose restart backend


# ── 更新部署 ──────────────────────────────
# 代码更新后重新构建并启动
docker compose up --build -d

# 仅重新构建后端
docker compose up --build backend -d


# ── 日志查看 ──────────────────────────────
docker compose logs -f            # 所有服务
docker compose logs -f backend    # 仅后端
docker compose logs --tail=100    # 最近 100 行


# ── 容器调试 ──────────────────────────────
# 进入后端容器 Shell
docker compose exec backend bash

# 进入前端容器 Shell
docker compose exec frontend sh

# 查看容器资源占用
docker stats
```

---

## 目录结构说明

```
StarGuide/
├── .env                    # 环境变量（不提交 Git）
├── .gitignore
├── docker-compose.yml      # Docker Compose 编排文件
├── DEPLOYMENT.md           # 本部署文档
├── Readme.md               # 项目介绍
│
├── backend/                # 后端服务（Flask）
│   ├── Dockerfile          # 后端 Docker 镜像定义
│   ├── .dockerignore
│   ├── app.py              # Flask 应用入口
│   ├── config.py           # 配置加载（读取 .env）
│   ├── requirements.txt    # Python 依赖列表
│   ├── starguide.db        # SQLite 数据库文件（持久化挂载）
│   ├── models/             # 数据模型（SQLAlchemy ORM）
│   ├── routes/             # API 蓝图路由
│   │   ├── auth.py         # 认证（注册/登录/JWT）
│   │   ├── qa.py           # 智能问答（Gemini AI）
│   │   ├── tracker.py      # 行为追踪日志
│   │   ├── pecs.py         # 沟通板卡片
│   │   ├── breathe.py      # 家长喘息空间
│   │   └── admin.py        # 管理员接口
│   ├── services/           # 业务/AI 服务层
│   └── utils/              # 工具函数
│
└── frontend/               # 前端服务（React + Vite）
    ├── Dockerfile          # 前端 Docker 镜像定义（多阶段构建）
    ├── .dockerignore
    ├── nginx.conf          # Nginx 配置（SPA + API 代理）
    ├── vite.config.js      # Vite 构建/代理配置
    ├── package.json        # Node 依赖
    ├── index.html          # HTML 入口
    └── src/
        ├── main.jsx        # React 入口
        ├── App.jsx         # 根组件 & 路由
        ├── pages/          # 页面组件
        ├── components/     # 通用组件
        ├── services/       # API 请求封装
        └── styles/         # CSS 样式
```

---

## 常见问题排查

### ❌ `Cannot connect to the Docker daemon`

**原因**：Docker Desktop 未启动。

**解决**：打开 Docker Desktop，等待出现 "Engine running" 提示后重试。

---

### ❌ `port is already allocated`（端口被占用）

**原因**：`8080` 或 `5001` 端口已被其他进程占用。

**解决**：

```powershell
# 查看占用端口的进程
netstat -ano | findstr :8080
netstat -ano | findstr :5001

# 或修改 docker-compose.yml 中的宿主端口映射
# 例如将 "8080:80" 改为 "9090:80"
```

---

### ❌ `GEMINI_API_KEY` 未配置导致 AI 功能失败

**原因**：`.env` 文件中 API Key 为空或无效。

**解决**：
1. 前往 https://aistudio.google.com/apikey 获取有效 Key
2. 更新 `.env` 文件
3. 重启后端：`docker compose restart backend`

---

### ❌ 前端页面空白或 API 请求失败

**原因**：Nginx 代理配置指向 `http://backend:5000`，依赖 Docker 内部 DNS。

**检查**：
```powershell
# 确认后端容器正在运行
docker compose ps

# 检查后端日志是否有报错
docker compose logs backend
```

---

### ❌ 数据库相关错误

SQLite 数据库文件通过 Volume 挂载：

```yaml
volumes:
  - ./backend/starguide.db:/app/starguide.db
```

**注意**：`starguide.db` 在项目中是一个**目录**（非文件），如遇问题可删除该目录后重新启动，数据库将自动重建：

```powershell
Remove-Item -Recurse -Force .\backend\starguide.db
docker compose up -d
```

---

*文档最后更新：2026-04-15*
