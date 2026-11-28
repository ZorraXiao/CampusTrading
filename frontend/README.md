# 校园交易平台 · 前端工程（Vue 3 + Vite）

本项目为校园交易平台前端工程（JavaScript），已完成基础框架搭建（项目初始化、请求封装、Pinia 状态管理、公共工具、全站路由守卫、双布局与通用组件），并基于本地 mock 数据完成失物招领、跑腿两个业务模块的完整页面与交互流转。

---

## 1. 环境要求与常用命令

- **Node.js**：建议使用 `Node.js >= 18.18`（推荐 `20+`，当前已在 `v24.15.0` 验证通过）
- **包管理器**：`npm`

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动本地开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建（输出至 dist/）
npm run build

# 本地预览生产构建产物
npm run preview
```

---

## 2. 代理与环境变量配置

- 默认配置文件：[`.env.development`](.env.development)，默认设置：
  ```dotenv
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```
- [`vite.config.js`](vite.config.js) 已配置：
  - 路径别名 `@` 指向 `src/`
  - 开发代理将 `/api`（覆盖业务前缀 `/api/v1`）与 `/health` 转发至 `VITE_API_BASE_URL`
- 如需本地覆盖后端地址（例如联调远程/局域网后端），请在 `frontend/` 下新建 `.env.local`（已被 `.gitignore` 忽略，切勿提交到仓库）：
  ```dotenv
  VITE_API_BASE_URL=http://192.168.1.100:8000
  ```

---

## 3. 目录结构与第三阶段团队分工

```text
frontend/src/
├── main.js                   # 入口：挂载 Pinia、Router、Element Plus（zh-cn），接入 401 跳转钩子
├── App.vue                   # 根路由出口 <router-view />
├── api/                      # 接口封装层（页面只依赖此层，不直接引用 mock）
│   ├── lostFound.js          # 失物招领：列表 / 详情 / 发布 / 完结
│   ├── errand.js             # 跑腿：列表 / 详情 / 发布 / 接单 / 送达 / 完成
│   └── mock/                 # 本地 mock 数据源（后端就绪后替换为 request 调用）
│       ├── lostFound.js
│       └── errand.js
├── styles/
│   ├── variables.css         # Editorial 暖调纸感设计令牌（暖棕咖强调色，覆写 Element Plus 变量）
│   └── global.css            # 全局基础样式、.ct-page 版心与骨架工具类
├── layouts/
│   ├── MainLayout.vue        # 前台通用布局（吸顶微磨砂顶栏、用户下拉菜单、单行页脚）
│   └── AdminLayout.vue       # 后台管理布局（左侧极简工作台菜单、面包屑顶栏与退出入口）
├── components/               # 全站公共组件
│   ├── AppPagination.vue     # 统一分页器
│   ├── SearchBar.vue         # 大厅搜索与操作条
│   ├── StatusTag.vue         # 业务/治理状态标签
│   ├── EmptyState.vue        # 统一空状态
│   ├── PageHeader.vue        # 统一页面头部（支持 eyebrow 或返回链接）
│   ├── ItemThumb.vue         # 列表卡片物品缩略图（无图时展示「暂无图像」占位）
│   ├── ImageUploadField.vue  # 图片上传（本地预览 + 可移除，选填）
│   └── EditorialIllustration.vue # 编辑部风格插画（stamp/books/lost-found/errands 等场景）
├── router/index.js           # 全站路由表与权限守卫（requiresAuth / requiresAdmin / guestOnly）
├── stores/auth.js            # 用户认证与资料 Pinia Store（含 localStorage 持久化）
├── utils/
│   ├── request.js            # Axios 实例、Token 注入、FormData 兼容与统一错误处理
│   └── format.js             # 金额分↔元防精度误差转换、UTC 时间转本地时间
└── views/                    # 按模块隔离，避免多人并行开发冲突
    ├── auth/                 # 登录/注册（/login）
    ├── home/                 # 首页（/）
    ├── products/             # 商品大厅、发布商品、商品详情（/products*）
    ├── lost-found/           # 失物信息大厅、发布失物、信息详情（/lost-found*）
    ├── errands/              # 跑腿任务大厅、发布跑腿、任务详情（/errands*）
    ├── profile/              # 个人中心、我的发布、我的接单任务（/profile*）
    ├── admin/                # 后台用户与内容管理（/admin/*）
    └── error/                # 404 兜底页
```

> **接口与字段约定提醒**：业务接口统一返回 `{ code, message, data }`，JSON 字段为 `snake_case`；所有主键/外键 `id` 按**字符串**处理；商品价格与跑腿费以**整数分**（`price_cents`、`fee_cents`）传输；时间字段为 UTC `ISO 8601`（如 `2026-11-20T08:00:00Z`）。失物招领与跑腿模块的接口封装已落在 `src/api/`，字段与接口清单详见仓库根目录的 [接口契约](../docs/api-contract.md)。

---

## 4. 基础设施与公共组件使用示例

### 4.1 `request.js`（JSON 与 FormData 上传）

```javascript
import request from '@/utils/request'

// GET 查询（返回体已解包为 { code, message, data }）
const res = await request.get('/products', { params: { page: 1, page_size: 20 } })

// POST JSON
await request.post('/auth/login', { username, password })

// FormData 图片上传（无需手动设置 Content-Type，拦截器已处理 boundary）
const formData = new FormData()
formData.append('file', file)
await request.post('/uploads/images', formData)
```

- 默认自动在 `401 / 403 / 422 / 400 / 404 / 409 / 429 / 500` 时弹出 `ElMessage.error` 并将 `Promise.reject(error)` 透传给调用方；`401` 会自动清空登录态并跳转 `/login?redirect=...`。
- 如需在特定接口自行处理报错提示，可在请求配置中传入 `{ skipErrorToast: true }`。

### 4.2 Pinia `useAuthStore`

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 登录成功后写入凭据与用户信息（id 会自动转为字符串并持久化到 localStorage）
authStore.setAuth(res.data.access_token, res.data.user)

// 判断登录态与管理员身份
if (authStore.isLoggedIn && authStore.isAdmin) { ... }

// 修改个人资料后局部刷新
authStore.updateUserInfo({ nickname: '新昵称', phone: '13800000000' })

// 退出登录
authStore.clearAuth()
```

### 4.3 `format.js`（金额分↔元与 UTC 转本地时间）

```javascript
import { formatCentsToYuan, yuanToCents, formatUtcToLocal } from '@/utils/format'

formatCentsToYuan(2500)                 // "25.00"
yuanToCents('19.99')                    // 1999（避免浮点数精度误差）
formatUtcToLocal('2026-11-20T08:00:00Z') // "2026-11-20 16:00"（按本地时区）
```

### 4.4 公共组件

```vue
<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'

const keyword = ref('')
const page = ref(1)
const pageSize = ref(20)

const fetchList = () => { /* 请求后端列表 */ }
</script>

<template>
  <SearchBar v-model="keyword" placeholder="输入关键词搜索" @search="() => { page = 1; fetchList() }">
    <template #filters><!-- 可选：分类或状态筛选器 --></template>
    <template #actions><el-button type="primary">发布</el-button></template>
  </SearchBar>

  <!-- 业务状态 / 治理状态标签：product | lost_found | errand | moderation -->
  <StatusTag type="product" status="on_sale" />
  <StatusTag type="errand" status="pending_confirm" />
  <StatusTag type="moderation" status="taken_down" />

  <EmptyState description="暂无相关记录">
    <el-button type="primary" plain>去发布第一条</el-button>
  </EmptyState>

  <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="100" @change="fetchList" />
</template>
```

---

## 5. 视觉规范（阶段 2 改版）

- **设计令牌（`styles/variables.css`）**：Editorial 暖调纸感风格——画布 `#FAF7F2`、纸面 `#FFFEFB`、主文字 `#1E1A17`、次级 `#5E554E`、辅助 `#8C8279`、细框 `#E5DDD2`，核心强调色为低饱和暖棕咖 `#4A382B`（hover `#35271D`，浅底 `#EFE7DD`）。字体为杂志级混排（标题衬线 `--ct-font-display`、正文无衬线 `--ct-font-sans`、等宽数字 `--ct-font-mono`）。新增组件与页面请优先引用 `--ct-*` 变量，避免硬编码颜色、渐变或重阴影。
- **图标规范**：全站统一使用 `lucide-vue-next`，严禁使用 Emoji 作为界面图标，图标统一设置细线宽 `:stroke-width="1.5"`：
  ```vue
  <script setup>
  import { Plus } from 'lucide-vue-next'
  </script>

  <template>
    <el-button type="primary">
      <Plus :size="15" :stroke-width="1.5" />
      <span>发布商品</span>
    </el-button>
  </template>
  ```
- **通用骨架与排版工具类（`styles/global.css`）**：
  - `.ct-page`：页面纵向容器（块间距 `24px`）。
  - `.ct-panel` / `.ct-panel__header` / `.ct-panel__body` / `.ct-panel__footer`：白底 `1px` 细边框模块化面板；待接入骨架或草稿区可叠加 `.ct-panel--dashed`。
  - `.ct-kv` / `.ct-kv__row` / `.ct-kv__label` / `.ct-kv__value` / `.ct-kv__hint`：键值对信息列表。
  - `.ct-num` / `.ct-mono`：开启等宽数字（`tabular-nums`），用于金额、时间、编号与计数。
  - `.ct-link`：带方向箭头的文字链接。
- **`PageHeader` 页面头部组件**：
  ```vue
  <PageHeader
    eyebrow="二手交易"
    title="商品大厅"
    description="浏览同校师生发布的闲置物品，按分类与关键词快速筛选。"
  >
    <template #actions>
      <el-button type="primary">发布商品</el-button>
    </template>
  </PageHeader>
  ```
  详情或发布页可传入 `:back="{ to: '/products', label: '商品大厅' }"` 替代 `eyebrow`。

---

## 6. 接口对接（mock → 真实接口）

失物招领、跑腿两个模块的接口封装已按「页面只依赖 `src/api/*.js`，不直接引用 mock」的方式组织：

```text
src/api/
├── lostFound.js   # fetchLostFoundList / fetchLostFoundDetail / createLostFoundItem / resolveLostFoundItem
├── errand.js      # fetchErrandList / fetchErrandDetail / createErrand / acceptErrand / deliverErrand / completeErrand
└── mock/
    ├── lostFound.js   # 本地 mock 数据与状态流转（含若干条演示数据）
    └── errand.js      # 本地 mock 数据与状态流转
```

- 每个封装函数内部目前返回 mock 结果，并以 `// TODO(阶段3): return request.get(...)` 标注了对应的真实请求。
- 后端按 [接口契约](../docs/api-contract.md) 实现后，只需把 `src/api/*.js` 里的 mock 调用替换为注释中的 `request` 调用，**页面与组件代码无需改动**（返回结构保持一致：直接返回业务 `data`）。
- mock 已对权限做了简化（例如失物「认领」未区分失主发起与发布者确认），联调时以契约第 5 节权限规则为准，并按后端实现同步微调按钮显隐逻辑。
