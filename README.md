# CampusTrading · 校园交易平台

面向校园场景的综合服务平台，围绕二手交易、失物招领和跑腿服务组织功能，并提供个人中心与后台管理入口。

项目采用前后端分离结构：Vue 3 前端、FastAPI 后端与 MySQL 数据库分别位于 `frontend/`、`backend/` 和 `db/`。

> **当前阶段：前端先行开发。** 后端公共设施与数据库初始化脚本已就绪；前端已基于本地 mock 数据完成失物招领、跑腿两个业务模块的完整页面与交互流转，并输出[接口契约](docs/api-contract.md)供后端对接。二手交易、认证登录等业务接口与数据持久化仍待接入。

## 目录

- [功能与开发进度](#功能与开发进度)
- [技术栈与环境要求](#技术栈与环境要求)
- [项目结构](#项目结构)
- [本地快速开始](#本地快速开始)
- [配置与接口约定](#配置与接口约定)
- [开发检查](#开发检查)
- [常见问题](#常见问题)
- [模块文档](#模块文档)

## 功能与开发进度

### 业务模块

下表描述各模块的目标范围，具体实现进度见后文。

| 模块 | 目标范围 | 前端入口 |
| --- | --- | --- |
| 二手交易 | 商品浏览、分类检索、商品详情与发布管理 | `/products` |
| 失物招领 | 寻物与拾物信息浏览、发布和状态管理 | `/lost-found` |
| 跑腿服务 | 任务发布、接单、送达与完成确认 | `/errands` |
| 用户与个人中心 | 登录注册、个人资料、我的发布与接单记录 | `/login`、`/profile` |
| 后台管理 | 用户管理、业务内容治理与操作审计 | `/admin` |

### 当前实现

| 工程 | 已有内容 | 待接入内容 |
| --- | --- | --- |
| 前端 | Vue 工程、双布局、路由守卫、Pinia 登录态管理、Axios 请求封装、通用组件与基础页面；失物招领、跑腿模块已基于本地 mock 完成列表 / 详情 / 发布 / 操作流转 | 登录认证、真实业务数据及操作接口（接口契约见 [api-contract.md](docs/api-contract.md)） |
| 后端 | 配置管理、统一响应、异常处理、日志、CORS、API 路由聚合、健康检查与公共测试 | 数据库连接、ORM、认证授权与业务接口 |
| 数据库 | MySQL Compose 配置、7 张业务表、索引与约束、测试种子数据及校验脚本 | 与后端持久化层及认证方案对接 |

当前 `/api/v1` 路由聚合器尚未挂载业务接口。前端登录表单暂未发起认证请求，数据库种子账号的密码哈希为占位值，暂不能用于真实登录。

## 技术栈与环境要求

| 范围 | 技术与要求 |
| --- | --- |
| 前端 | JavaScript、Vue 3、Vite 8、Vue Router、Pinia、Element Plus、Axios、Lucide |
| 前端运行环境 | 建议 Node.js 24.x；当前锁定 Vite 的 Node.js 要求为 `^20.19.0 \|\| >=22.12.0`；使用 npm |
| 后端 | Python 3.13.x、FastAPI、Uvicorn、Pydantic 2、pydantic-settings |
| 后端质量检查 | Ruff、Pytest、FastAPI TestClient |
| 数据库 | MySQL 8.0，InnoDB，`utf8mb4 / utf8mb4_0900_ai_ci`，UTC 时区 |
| 数据库运行方式 | Docker Compose；也可按数据库文档配置本机 MySQL |
| 版本管理 | Git / GitHub |

前端依赖以 [package.json](frontend/package.json) 和 [package-lock.json](frontend/package-lock.json) 为准；后端依赖以 [requirements.txt](backend/requirements.txt) 和 [requirements-dev.txt](backend/requirements-dev.txt) 为准。

## 项目结构

```text
CampusTrading/
├── README.md                       # 项目总览与启动入口
├── .gitignore                      # 公共忽略规则
├── frontend/                       # Vue 前端工程
│   ├── package.json
│   ├── vite.config.js              # 别名与开发代理
│   ├── .env.development            # 默认后端地址
│   └── src/
│       ├── components/             # 分页、搜索、状态标签等公共组件
│       ├── layouts/                # 前台与后台布局
│       ├── router/                 # 路由与访问守卫
│       ├── stores/                 # 登录态与用户信息
│       ├── styles/                 # 全局样式与设计变量
│       ├── utils/                  # 请求、金额及时间工具
│       └── views/                  # 各业务模块页面
├── backend/                        # FastAPI 后端工程
│   ├── .env.example                # 后端配置模板
│   ├── pyproject.toml              # Ruff / Pytest 配置
│   ├── requirements*.txt           # 运行与开发依赖
│   ├── app/
│   │   ├── main.py                 # 应用入口与健康检查
│   │   ├── api/v1/                 # 业务路由聚合入口
│   │   ├── core/                   # 配置、响应、异常、日志、CORS
│   │   ├── db/                     # 数据库公共设施预留目录
│   │   └── modules/                # auth、user、admin 等模块预留包
│   └── tests/                      # 后端公共设施测试
└── db/                             # 数据库环境与脚本
    ├── docker-compose.yml          # MySQL 容器编排
    ├── .env.example                # 端口、账号与密码模板
    ├── init/                       # 建表与测试数据初始化
    └── scripts/                    # SQL 校验及 Python 连库验证
```

## 本地快速开始

前端、后端和数据库可以分别启动。仅浏览当前前端页面或运行后端健康检查时，无须先启动数据库。

### 1. 获取项目

```bash
git clone https://github.com/ZorraXiao/CampusTrading.git
cd CampusTrading
```

后续每个工程的启动命令均从仓库根目录开始，在独立终端中执行。

### 2. 启动前端

```bash
cd frontend
npm ci
npm run dev
```

默认访问 [http://localhost:5173](http://localhost:5173)。若端口被占用，以终端输出的地址为准。

前端开发服务器会将 `/api` 与 `/health` 请求代理到 `http://127.0.0.1:8000`。修改后端地址的方法见[配置与接口约定](#配置与接口约定)。

### 3. 启动后端

Windows / PowerShell：

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Linux / macOS（已安装 Python 3.13）：

```bash
cd backend
python3.13 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
test -f .env || cp .env.example .env
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

| 入口 | 默认地址 |
| --- | --- |
| 健康检查 | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) |
| Swagger UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| OpenAPI 定义 | [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json) |

`GET /health` 的预期响应为：

```json
{
  "code": "SUCCESS",
  "message": "ok",
  "data": { "status": "ok" }
}
```

此接口当前检查应用存活，不检查数据库连接。`--reload` 用于本地开发。

### 4. 启动数据库（数据库开发与后续联调用）

先安装并启动 Docker Desktop 或 Docker Engine，确保可以使用 `docker compose`。

Windows / PowerShell：

```powershell
cd db
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up -d
docker compose ps
```

Linux / macOS：

```bash
cd db
test -f .env || cp .env.example .env
docker compose up -d
docker compose ps
```

启动前可按需调整 `db/.env` 中的端口与密码。默认连接地址为 `127.0.0.1:3306`，数据库名为 `campus_trading_platform`，业务账号为 `campus_app`。

首次创建空数据卷时，MySQL 会依次执行 `01_schema.sql` 与 `02_seed.sql`，建立以下 7 张表并写入测试数据：

| 数据表 | 用途 |
| --- | --- |
| `users` | 用户与角色 |
| `product_categories` | 商品分类 |
| `products` | 二手商品 |
| `product_images` | 商品图片 |
| `lost_found_items` | 寻物与拾物信息 |
| `errands` | 跑腿任务 |
| `admin_audit_logs` | 管理员操作日志 |

已有数据卷时，重启容器不会重新执行初始化脚本。数据库连接验证、SQL 约束校验及本机 MySQL 配置见 [数据库文档](db/README.md)。

## 配置与接口约定

### 配置入口

| 工程 | 配置文件 | 主要配置 |
| --- | --- | --- |
| 前端 | `frontend/.env.development`；本地覆盖可用 `frontend/.env.local` | `VITE_API_BASE_URL`：Vite 开发代理的后端目标地址 |
| 后端 | 从 `backend/.env.example` 复制的 `backend/.env` | 应用环境、API 前缀、日志级别、CORS 来源 |
| 数据库 | 从 `db/.env.example` 复制的 `db/.env` | MySQL 监听地址、映射端口、数据库名和账号密码 |

例如，在 `frontend/.env.local` 中指定开发代理目标：

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

修改配置后重启对应服务。前端 Axios 的业务请求前缀固定为 `/api/v1`；若修改后端 `API_V1_PREFIX`，需同步调整前端请求封装。

后端 `.env` 中的 `HOST` / `PORT` 不会自动控制 Uvicorn CLI，监听地址和端口以启动命令的 `--host` / `--port` 为准。CORS 默认允许 `localhost:5173` 和 `127.0.0.1:5173`。

`VITE_API_BASE_URL` 当前用于开发服务器代理；生产构建后的 `/api` 请求转发需由部署环境另行配置。

### 联调数据约定

- 业务接口前缀为 `/api/v1`；健康检查单独使用 `/health`。
- 统一业务响应结构为 `{ "code": "SUCCESS", "message": "ok", "data": ... }`。
- JSON 字段使用 `snake_case`；对外业务 ID 按十进制字符串处理。
- 商品价格和跑腿费用以整数分传输，对应 `price_cents`、`fee_cents`。
- 时间按 UTC 处理，接口时间字段约定使用 ISO 8601，例如 `2026-11-20T08:00:00Z`。
- 失物招领、跑腿模块的字段、状态流转、接口清单、权限与错误码已在 [api-contract.md](docs/api-contract.md) 细化，后端实现前请以该文为准。

上述约定用于后续业务接口实现与联调，当前实际接口以运行后的 Swagger UI 为准。

## 开发检查

前端构建，在 `frontend/` 中执行：

```bash
npm run build
```

构建产物位于 `frontend/dist/`，可用 `npm run preview` 本地预览。

后端检查，在 `backend/` 中执行（PowerShell）：

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .
.\.venv\Scripts\python.exe -m pytest -q
```

Linux / macOS 将解释器路径替换为 `.venv/bin/python`。现有后端测试覆盖健康检查、响应、异常、配置、日志、CORS 和路由前缀等公共能力。

## 常见问题

**前端提示 Node.js 版本不兼容？** 以锁文件中 Vite 的 `engines.node` 为准。当前要求 `^20.19.0 || >=22.12.0`，Node.js 18 不满足要求。

**MySQL 无法启动，提示 3306 端口占用？** 将 `db/.env` 的 `MYSQL_PORT` 改为 `3307` 等空闲端口，然后重新执行 `docker compose up -d`，连库工具也需使用相同端口。

**页面没有业务数据、登录无效或业务请求返回 404？** 当前页面主要为基础骨架，登录表单与业务数据尚未接入真实接口；这与当前开发进度一致。

**能直接把 `DATABASE_URL` 加到后端 `.env` 吗？** 当前 `Settings` 尚未声明数据库配置字段，并启用了 `extra="forbid"`。数据库连接需待后端接入时同步修改配置模型与依赖；直接添加该字段可能导致启动校验失败。

## 模块文档

- [前端开发指南](frontend/README.md)：页面结构、公共组件、请求封装与视觉规范。
- [失物招领 & 跑腿接口契约](docs/api-contract.md)：两个模块的字段、状态流转、接口清单、权限与错误码约定。
- [后端开发指南](backend/README.md)：配置、统一响应、异常处理、模块分层与测试。
- [数据库开发指南](db/README.md)：Docker / 本机 MySQL、初始化、连接验证与测试数据。

本文件提供仓库总览与开发入口，各工程的详细用法见对应模块文档；实现状态以当前代码为准。
# -
