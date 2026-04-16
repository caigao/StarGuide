<div align="center">

# 🌟 星语向导 (StarGuide)

### 自闭症家庭康复智能助手

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=white)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20API-4285F4.svg)](https://ai.google.dev/)

> 🤝 用科技的温度，守护每一颗星星的成长

</div>

---

## 📖 项目简介

**星语向导 (StarGuide)** 是一款面向自闭症（ASD）儿童家庭的全天候智能康复辅助平台。

在日常生活中，ASD 儿童的家长常常面临巨大的挑战：

- 😰 孩子情绪突然崩溃，不知如何应对
- 🔁 刻板行为频繁发生，缺乏科学干预手段
- 🗣️ 沟通障碍严重，亲子交流困难重重
- 💔 长期高压照护，家长自身身心疲惫

本项目通过结合 **大语言模型（LLM）** 技术与专业康复理论，为家长提供 **个性化情景应对建议**、**结构化干预日志追踪** 以及 **社交沟通辅助工具**，让每一位家长都能获得专业级的康复支持。

---

## ✨ 核心功能

### 🧠 智能场景问答（AI 驱动）

面对突发状况（如孩子在超市突然尖叫），家长可快速描述当前场景，系统基于专业康复理论提供**分步实操建议**，帮助家长冷静应对。

### 📊 行为与情绪追踪日志

提供易用的可视化记录面板，支持：
- 每日情绪状态记录与标注
- 干预方法及效果追踪
- 自动生成阶段性趋势图表
- 数据导出，方便与康复师共享

### 🖼️ 可视化日程与沟通板（PECS）

在线生成并管理视觉辅助工具：
- 可打印的视觉提示卡片
- 结构化日程时间表
- 图片交换沟通系统（PECS）支持
- 自定义图标与排版

### 💚 家长喘息空间

专属的心理疏导模块，为承受压力的家长提供：
- AI 情感陪伴与心理支持
- 正念冥想与放松引导
- 家长社区互助资源推荐
- 自我关怀提醒与建议

---

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | React 18+ / Vite | 组件化 SPA 界面 |
| **UI 库** | Ant Design / Recharts | UI 组件与图表可视化 |
| **后端** | Python / Flask | RESTful API 服务 |
| **AI 引擎** | Google Gemini API | 场景问答与智能建议 |
| **数据库** | SQLite / PostgreSQL | 用户数据与日志存储 |

> [!NOTE]
> 技术栈可能随项目发展调整，以实际代码为准。

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/StarGuide.git
cd StarGuide
```

### 2. 环境准备

> [!NOTE]
> 推荐使用 **Docker** 和 **Docker Compose** 快速部署。

### 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# Gemini API 密钥（必填）
GEMINI_API_KEY=your_api_key_here

# 数据库配置（可选，默认 SQLite）
DATABASE_URL=sqlite:///starguide.db

# 应用密钥
SECRET_KEY=your_secret_key_here
```

> [!IMPORTANT]
> 请前往 [Google AI Studio](https://aistudio.google.com/apikey) 获取 Gemini API 密钥。

### 4. 使用 Docker 启动应用

```bash
docker-compose up -d --build
```

- 前端页面：`http://localhost:8080`
- 后端 API：`http://localhost:5001`

---

## 📁 项目结构

```
StarGuide/
├── Readme.md              # 项目说明
├── .env                   # 环境变量（需自行创建）
├── .gitignore             # Git 忽略规则
│
├── backend/               # 后端服务
│   ├── app.py             # Flask 应用入口
│   ├── requirements.txt   # Python 依赖
│   ├── models/            # 数据模型
│   ├── routes/            # API 路由
│   ├── services/          # 业务逻辑
│   │   └── ai_agent.py    # Gemini AI 对话服务
│   └── utils/             # 工具函数
│
└── frontend/              # React 前端
    ├── package.json       # Node 依赖
    ├── vite.config.js     # Vite 构建配置
    ├── index.html         # 入口 HTML
    ├── public/            # 静态资源
    └── src/
        ├── main.jsx       # React 入口
        ├── App.jsx        # 根组件 & 路由
        ├── assets/        # 图片 / 字体
        ├── components/    # 通用组件
        ├── pages/         # 页面组件
        │   ├── Home.jsx       # 首页
        │   ├── QA.jsx         # 智能问答页
        │   ├── Tracker.jsx    # 行为追踪页
        │   ├── PECS.jsx       # 沟通板页
        │   └── Breathe.jsx    # 家长喘息空间
        ├── services/      # API 请求封装
        └── styles/        # CSS 样式
```

> [!NOTE]
> 项目结构为规划版本，将随开发进度逐步完善。

---

## 🗺️ 开发路线图

- [x] 项目构思与需求分析
- [x] README 文档撰写
- [ ] 前端界面搭建（首页 + 问答页）
- [ ] 后端 API 框架搭建
- [ ] Gemini API 对接 — 场景问答功能
- [ ] 行为追踪日志模块
- [ ] PECS 沟通板生成器
- [ ] 家长喘息空间模块
- [ ] 用户认证与数据持久化
- [ ] 移动端适配优化
- [ ] 部署上线

---

## 📡 API 接口概览

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/qa` | 提交场景描述，获取 AI 建议 |
| `GET` | `/api/logs` | 获取行为追踪日志列表 |
| `POST` | `/api/logs` | 新增一条追踪日志 |
| `GET` | `/api/pecs/cards` | 获取沟通卡片列表 |
| `POST` | `/api/pecs/generate` | 生成新的视觉提示卡片 |

> [!NOTE]
> 完整 API 文档将在开发过程中持续补充。

---

## 🤝 参与贡献

欢迎所有形式的贡献！无论是 Bug 报告、功能建议还是代码提交。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一颗 Star 支持我们！**

*每一颗星星都值得被温柔以待* 🌟

</div>
