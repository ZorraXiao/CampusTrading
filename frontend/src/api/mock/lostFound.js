// 失物招领模块 · 本地 mock 数据源。
//
// 后端业务接口尚未实现，这里用内存数据模拟「列表 / 详情 / 发布 / 完结」四类操作，
// 供前端页面开发与交互演示使用。字段命名、状态取值与时间格式均对齐 README 约定：
//  - id 按字符串处理
//  - item_type: lost-寻物, found-拾物
//  - status: searching-寻找中, unclaimed-待认领, resolved-已完结
//  - 时间为 UTC ISO 8601
// 后端就绪后删除本文件，并将 src/api/lostFound.js 中的调用替换为真实 request。

const LATENCY = 280

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 测试数据（与 db/init/02_seed.sql 的 lost_found_items 口径一致）
const items = [
  {
    id: '201',
    publisher_id: '2',
    publisher_nickname: '林同学',
    item_type: 'lost',
    item_name: '黑色不锈钢保温杯',
    location: '第二教学楼 302 教室',
    contact_info: '13800000002',
    description: '杯身贴有航天主题贴纸，昨日下午下课后遗落在靠窗座位旁，杯盖为银灰色。',
    status: 'searching',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T08:30:00Z',
    updated_at: '2026-11-25T08:30:00Z',
  },
  {
    id: '202',
    publisher_id: '3',
    publisher_nickname: '王同学',
    item_type: 'found',
    item_name: '校园一卡通（尾号 6821）',
    location: '图书馆二楼自习区',
    contact_info: '13800000003',
    description: '在北侧靠窗桌上拾到，带透明卡套，请失主核对卡号后联系认领。',
    status: 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T09:10:00Z',
    updated_at: '2026-11-25T09:10:00Z',
  },
  {
    id: '203',
    publisher_id: '4',
    publisher_nickname: '陈同学',
    item_type: 'lost',
    item_name: '无线蓝牙耳机充电盒',
    location: '南区操场看台',
    contact_info: '13800000004',
    description: '已找回，用于测试完结状态隐藏联系方式。',
    status: 'resolved',
    resolved_at: '2026-11-24T14:30:00Z',
    moderation_status: 'normal',
    created_at: '2026-11-24T06:00:00Z',
    updated_at: '2026-11-24T14:30:00Z',
  },
  {
    id: '204',
    publisher_id: '5',
    publisher_nickname: '赵同学',
    item_type: 'found',
    item_name: '银色钥匙串',
    location: '一食堂一楼',
    contact_info: '13800000005',
    description: '三把钥匙加一个蓝色挂件，在打饭窗口旁拾到。',
    image_url: '/illustrations/campus-lost-keys.jpg',
    status: 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T10:00:00Z',
    updated_at: '2026-11-25T10:00:00Z',
  },
  {
    id: '205',
    publisher_id: '2',
    publisher_nickname: '林同学',
    item_type: 'lost',
    item_name: '蓝色折叠雨伞',
    location: '第三教学楼 201 教室',
    contact_info: '13800000002',
    description: '伞面深蓝，手柄有挂绳，昨天下午上完课忘记带走。',
    status: 'searching',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T02:00:00Z',
    updated_at: '2026-11-26T02:00:00Z',
  },
  {
    id: '206',
    publisher_id: '6',
    publisher_nickname: '孙同学',
    item_type: 'found',
    item_name: '学生证（尾号 0912）',
    location: '体育馆入口',
    contact_info: '13800000006',
    description: '体育课后在入口长椅下拾到，已交至体育馆值班室暂存。',
    status: 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T12:00:00Z',
    updated_at: '2026-11-25T12:00:00Z',
  },
  {
    id: '207',
    publisher_id: '7',
    publisher_nickname: '周同学',
    item_type: 'lost',
    item_name: '灰色双肩包',
    location: '图书馆三楼',
    contact_info: '13800000007',
    description: '包内有两本教材和一个笔袋，拉链处有褪色痕迹。',
    status: 'searching',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T03:30:00Z',
    updated_at: '2026-11-26T03:30:00Z',
  },
  {
    id: '208',
    publisher_id: '8',
    publisher_nickname: '吴同学',
    item_type: 'found',
    item_name: '黑色无线耳机',
    location: '梅园 4 栋楼下',
    contact_info: '13800000008',
    description: '已联系失主并归还，用于测试完结状态。',
    status: 'resolved',
    resolved_at: '2026-11-23T15:00:00Z',
    moderation_status: 'normal',
    created_at: '2026-11-23T09:00:00Z',
    updated_at: '2026-11-23T15:00:00Z',
  },
  {
    id: '209',
    publisher_id: '9',
    publisher_nickname: '郑同学',
    item_type: 'lost',
    item_name: '校园卡（尾号 7723）',
    location: '西区篮球场',
    contact_info: '13800000009',
    description: '下午打球时遗失，卡面右下角有轻微磨损。',
    status: 'searching',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T04:20:00Z',
    updated_at: '2026-11-26T04:20:00Z',
  },
  {
    id: '210',
    publisher_id: '10',
    publisher_nickname: '冯同学',
    item_type: 'found',
    item_name: '粉色保温饭盒',
    location: '二食堂一楼',
    contact_info: '13800000010',
    description: '两层分隔保温饭盒，中午在靠近出口的餐桌上拾到。',
    status: 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T05:00:00Z',
    updated_at: '2026-11-26T05:00:00Z',
  },
  {
    id: '211',
    publisher_id: '11',
    publisher_nickname: '蒋同学',
    item_type: 'lost',
    item_name: '白色电动车钥匙',
    location: '北门快递点',
    contact_info: '13800000011',
    description: '取快递时遗失，钥匙扣是黄色笑脸图案。',
    status: 'searching',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T06:00:00Z',
    updated_at: '2026-11-26T06:00:00Z',
  },
  {
    id: '212',
    publisher_id: '12',
    publisher_nickname: '沈同学',
    item_type: 'found',
    item_name: '蓝色篮球',
    location: '南区篮球场',
    contact_info: '13800000012',
    description: '篮球上有黑色签名痕迹，傍晚散场时留在三分线附近。',
    status: 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T07:00:00Z',
    updated_at: '2026-11-26T07:00:00Z',
  },
]

// 新发布信息的自增 ID（后端就绪后由数据库生成，前端不再维护）
let nextId = 213

/** 列表查询：支持关键词（名称/地点/描述）、类型、分页，按发布时间倒序。 */
export async function listItems(params = {}) {
  await delay()
  const { keyword = '', item_type = '', page = 1, page_size = 10 } = params
  const kw = String(keyword || '').trim().toLowerCase()

  let result = items.filter((item) => item.moderation_status === 'normal')

  if (kw) {
    result = result.filter((item) =>
      `${item.item_name} ${item.location} ${item.description}`.toLowerCase().includes(kw)
    )
  }

  if (item_type) {
    result = result.filter((item) => item.item_type === item_type)
  }

  const sorted = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const start = (page - 1) * page_size
  const paged = sorted.slice(start, start + page_size)

  return {
    items: paged,
    total: sorted.length,
    page,
    page_size,
  }
}

/** 单条详情查询，未找到时抛出 404。 */
export async function getItem(id) {
  await delay()
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) {
    const error = new Error('该信息不存在或已删除')
    error.status = 404
    throw error
  }
  return item
}

/** 发布信息：lost -> searching，found -> unclaimed，插入到列表最前。 */
export async function createItem(payload) {
  await delay()
  const now = new Date().toISOString()
  const item = {
    id: String(nextId++),
    publisher_id: '2', // mock：接入认证后从登录态获取当前用户 ID
    publisher_nickname: '我',
    item_type: payload.item_type,
    item_name: payload.item_name,
    location: payload.location,
    contact_info: payload.contact_info,
    description: payload.description,
    image_url: payload.image_url || null,
    status: payload.item_type === 'lost' ? 'searching' : 'unclaimed',
    resolved_at: null,
    moderation_status: 'normal',
    created_at: now,
    updated_at: now,
  }
  items.unshift(item)
  return item
}

/** 完结信息：失主认领拾物 / 发布者标记已找回，状态置为 resolved。 */
export async function resolveItem(id) {
  await delay()
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) {
    const error = new Error('该信息不存在或已删除')
    error.status = 404
    throw error
  }
  if (item.status === 'resolved') {
    const error = new Error('该信息已完结，请勿重复操作')
    error.status = 409
    throw error
  }
  item.status = 'resolved'
  item.resolved_at = new Date().toISOString()
  item.updated_at = item.resolved_at
  return item
}
