# 失物招领 & 跑腿服务 · 接口对接要求（前端提案）

> - **提出方**：前端（失物招领 / 跑腿模块）
> - **状态**：待后端确认。后端实现前请逐条核对，字段名、状态值与路径以本文为准；如有调整，请同步回前端。
> - **日期**：2026-11-26
> - **适用范围**：`/api/v1` 前缀下的失物招领与跑腿服务接口（健康检查 `GET /health` 不在此列）。

---

## 1. 通用约定

以下约定全站统一，详见仓库根 README「配置与接口约定」一节，此处仅列出与本模块相关部分：

| 约定 | 说明 |
| --- | --- |
| 响应结构 | 统一为 `{ "code": "SUCCESS", "message": "ok", "data": ... }`；失败时 `code` 为错误码、`message` 为可读提示 |
| 字段命名 | JSON 一律 `snake_case` |
| 主键 / 外键 | 对外以**十进制字符串**传输（BIGINT 精度问题），如 `"id": "201"` |
| 金额 | 跑腿费以**整数分**传输，字段 `fee_cents`（> 0） |
| 时间 | UTC ISO 8601，如 `"2026-11-20T08:00:00Z"`；可空时间字段用 `null` |
| 分页参数 | 查询参数 `page`（从 1 起）、`page_size`；列表 `data` 返回 `{ items, total, page, page_size }` |
| 鉴权 | 写操作需在请求头携带 `Authorization: Bearer <token>`；当前登录用户 ID 由后端从 token 解析，**不信任前端传入的 user id** |

---

## 2. 失物招领（lost-found）

### 2.1 数据模型

字段对齐 `lost_found_items` 表，对外暴露（不含 `is_deleted`、`deleted_by` 等内部字段）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 信息 ID |
| `publisher_id` | string | 发布者用户 ID |
| `publisher_nickname` | string | 发布者昵称（由后端 join `users` 返回，供列表/详情展示） |
| `item_type` | string | 类型：`lost`-寻物启事，`found`-拾物招领 |
| `item_name` | string | 物品名称（≤ 64） |
| `location` | string | 丢失 / 拾取地点（≤ 100） |
| `contact_info` | string | 发布者联系方式快照（≤ 100） |
| `description` | string | 详细描述 |
| `image_url` | string \| null | 物品图片 URL（发布时上传，可选；为空前端展示「暂无图像」占位） |
| `status` | string | 状态：`searching` / `unclaimed` / `resolved` |
| `resolved_at` | string \| null | 完结时间（UTC） |
| `created_at` | string | 发布时间（UTC） |
| `updated_at` | string | 更新时间（UTC） |

### 2.2 状态与流转

| 类型 | 初始状态 | 可流转到 |
| --- | --- | --- |
| `lost`（寻物） | `searching`（寻找中） | `resolved`（已完结） |
| `found`（拾物） | `unclaimed`（待认领） | `resolved`（已完结） |

> `resolved` 状态的详情**不返回联系方式**（或前端隐藏），用于保护已完结信息的隐私。

### 2.3 接口清单

#### 2.3.1 列表 `GET /lost-found`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 否 | 模糊匹配 `item_name` / `location` / `description` |
| `item_type` | string | 否 | `lost` 或 `found` |
| `page` | int | 否 | 默认 1 |
| `page_size` | int | 否 | 默认 10 |

响应 `data`：

```json
{
  "items": [
    {
      "id": "201",
      "publisher_id": "2",
      "publisher_nickname": "林同学",
      "item_type": "lost",
      "item_name": "黑色不锈钢保温杯",
      "location": "第二教学楼 302 教室",
      "contact_info": "13800000002",
      "description": "杯身贴有航天主题贴纸……",
      "image_url": null,
      "status": "searching",
      "resolved_at": null,
      "created_at": "2026-11-25T08:30:00Z",
      "updated_at": "2026-11-25T08:30:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "page_size": 10
}
```

> 列表默认按 `created_at` 倒序，仅返回 `moderation_status = normal` 且未逻辑删除的记录。

#### 2.3.2 详情 `GET /lost-found/{id}`

响应 `data`：单条完整对象（同 2.3.1 中元素结构）。

- 不存在或已删除：`404`。

#### 2.3.3 发布 `POST /lost-found`（需登录）

请求体：

```json
{
  "item_type": "lost",
  "item_name": "黑色不锈钢保温杯",
  "location": "第二教学楼 302 教室",
  "contact_info": "13800000002",
  "description": "杯身贴有航天主题贴纸……",
  "image_url": "https://cdn.example.com/lost-found/xxx.jpg"
}
```

- `publisher_id` 由后端从 token 解析，不由前端传入。
- `image_url` 可选，不上传则为 `null`（真实接口建议上传到对象存储后返回可访问 URL）。
- 后端按 `item_type` 初始化状态：`lost` → `searching`，`found` → `unclaimed`。
- 响应 `data`：创建后的完整对象。

#### 2.3.4 完结信息 `PATCH /lost-found/{id}/resolve`（需登录）

- 语义：`lost` 发布者标记「已找回」；`found` 发布者确认物品已被认领并完结。
- 权限：**仅发布者本人**可操作（`403` 否则）。
- 状态约束：`searching` / `unclaimed` → `resolved`；已是 `resolved` 返回 `409`。
- 副作用：设置 `resolved_at`、`updated_at`。
- 响应 `data`：更新后的完整对象。

> 拾物认领的更完整产品形态为「失主发起认领 → 发布者确认」两步，可后续拆为 `POST /lost-found/{id}/claim`（失主发起）+ 发布者调用 `resolve` 确认。当前阶段前端以单一 `resolve` 按钮演示，后端可先按此实现。

---

## 3. 跑腿服务（errands）

### 3.1 数据模型

字段对齐 `errands` 表，对外暴露：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 任务 ID |
| `publisher_id` | string | 发布者用户 ID |
| `publisher_nickname` | string | 发布者昵称（后端 join 返回） |
| `accepter_id` | string \| null | 接单人用户 ID（待接单为 `null`） |
| `accepter_nickname` | string \| null | 接单人昵称（未接单为 `null`） |
| `start_location` | string | 取件起点（≤ 100） |
| `end_location` | string | 送达终点（≤ 100） |
| `fee_cents` | int | 跑腿费（分，> 0） |
| `item_desc` | string | 物品及任务说明 |
| `image_url` | string \| null | 物品图片 URL（发布时上传，可选；为空前端展示「暂无图像」占位） |
| `contact_info` | string | 发布者联系方式快照（≤ 100） |
| `status` | string | 状态：`pending` / `in_progress` / `pending_confirm` / `completed` |
| `accepted_at` | string \| null | 接单时间（UTC） |
| `delivered_at` | string \| null | 确认送达时间（UTC） |
| `completed_at` | string \| null | 确认完成时间（UTC） |
| `created_at` | string | 发布时间（UTC） |
| `updated_at` | string | 更新时间（UTC） |

### 3.2 状态与流转

```
pending（待接单）──接单──▶ in_progress（进行中）──确认送达──▶ pending_confirm（待确认）──确认完成──▶ completed（已完成）
```

| 动作 | 触发方 | 前置状态 | 结果状态 | 副作用 |
| --- | --- | --- | --- | --- |
| 接单 | 非发布者 | `pending` | `in_progress` | 写 `accepter_id`、`accepted_at` |
| 确认送达 | 接单人 | `in_progress` | `pending_confirm` | 写 `delivered_at` |
| 确认完成 | 发布者 | `pending_confirm` | `completed` | 写 `completed_at` |

> 约束：**不能接自己发布的任务**（`accepter_id ≠ publisher_id`）。

### 3.3 接口清单

#### 3.3.1 列表 `GET /errands`

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `keyword` | string | 否 | 模糊匹配 `start_location` / `end_location` / `item_desc` |
| `status` | string | 否 | `pending` / `in_progress` / `pending_confirm` / `completed` |
| `page` | int | 否 | 默认 1 |
| `page_size` | int | 否 | 默认 10 |

响应 `data`：同失物招领列表结构，`items` 为完整对象数组（含 `fee_cents`、`start_location`、`end_location`、`status`、`created_at` 等），默认按 `created_at` 倒序。

#### 3.3.2 详情 `GET /errands/{id}`

响应 `data`：单条完整对象。不存在或已删除返回 `404`。

#### 3.3.3 发布 `POST /errands`（需登录）

请求体：

```json
{
  "start_location": "北门菜鸟驿站",
  "end_location": "梅园 5 栋楼下",
  "fee_cents": 500,
  "item_desc": "代取中号快递一个，18 点前送达即可。",
  "contact_info": "13800000003",
  "image_url": "https://cdn.example.com/errands/xxx.jpg"
}
```

- `publisher_id` 由后端从 token 解析。
- `image_url` 可选，不上传则为 `null`。
- 后端初始化 `status = pending`，`accepter_id` 等为 `null`。
- 校验 `fee_cents > 0`（`400` 否则）。
- 响应 `data`：创建后的完整对象。

#### 3.3.4 接单 `POST /errands/{id}/accept`（需登录）

- 权限：**非发布者**可接；接自己发布的任务返回 `409`。
- 状态约束：仅 `pending` 可接，否则 `409`。
- 副作用：`accepter_id` = 当前用户，`accepted_at` = now，状态 → `in_progress`。
- 响应 `data`：更新后的完整对象。

#### 3.3.5 确认送达 `POST /errands/{id}/deliver`（需登录）

- 权限：**仅接单人本人**，否则 `403`。
- 状态约束：仅 `in_progress`，否则 `409`。
- 副作用：`delivered_at` = now，状态 → `pending_confirm`。
- 响应 `data`：更新后的完整对象。

#### 3.3.6 确认完成 `POST /errands/{id}/complete`（需登录）

- 权限：**仅发布者本人**，否则 `403`。
- 状态约束：仅 `pending_confirm`，否则 `409`。
- 副作用：`completed_at` = now，状态 → `completed`。
- 响应 `data`：更新后的完整对象。

---

## 4. 错误码约定

与前端 `request.js` 的兜底文案对齐：

| HTTP 状态 | 含义 | 典型场景 |
| --- | --- | --- |
| 400 | 参数不合法 | 字段缺失 / `fee_cents ≤ 0` / 长度超限 |
| 401 | 未登录或 token 失效 | 写操作未带合法 token |
| 403 | 无权限 | 非发布者完结信息、非接单人确认送达、非发布者确认完成 |
| 404 | 资源不存在 | 信息 / 任务不存在或已删除 |
| 409 | 状态冲突 | 重复接单、状态不允许该操作、接自己发布的单 |
| 422 | 校验失败 | 请求体字段校验错误（`message` 给出可读提示） |

---

## 5. 权限规则汇总

| 操作 | 允许身份 |
| --- | --- |
| 发布失物 / 寻物、发布跑腿 | 任意登录用户 |
| 完结失物信息（resolve） | 仅发布者本人 |
| 接单（accept） | 登录用户，且非该任务发布者 |
| 确认送达（deliver） | 仅接单人本人 |
| 确认完成（complete） | 仅发布者本人 |

---

## 6. 前端当前实现状态（mock → 联调切换）

- 前端业务代码已按上述契约完成，但后端接口尚未实现，故当前数据与交互来自本地 mock：
  - 接口封装：[`frontend/src/api/lostFound.js`](../frontend/src/api/lostFound.js)、[`frontend/src/api/errand.js`](../frontend/src/api/errand.js)
  - mock 数据源：[`frontend/src/api/mock/lostFound.js`](../frontend/src/api/mock/lostFound.js)、[`frontend/src/api/mock/errand.js`](../frontend/src/api/mock/errand.js)
- 每个接口函数内均以 `// TODO(阶段3): return request.xxx(...)` 标注了对应的真实请求调用。
- 后端按本文实现接口后，只需把 `src/api/*.js` 中的 mock 调用替换为注释中的 `request` 调用，**页面代码无需改动**。
- 前端 mock 对权限做了简化（如「认领」未区分发起认领与发布者确认），联调时以本文第 5 节为准，并按后端实现同步微调按钮显隐逻辑。
