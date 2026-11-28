// 跑腿服务模块 · 本地 mock 数据源。
//
// 后端业务接口尚未实现，这里用内存数据模拟「列表 / 详情 / 发布 / 接单 / 送达 / 完成」操作。
// 字段、状态取值与时间格式对齐 README 约定：
//  - fee_cents：跑腿费，整数分
//  - status：pending-待接单，in_progress-进行中，pending_confirm-待确认，completed-已完成
//  - 时间：UTC ISO 8601
// 状态机：pending -> in_progress -> pending_confirm -> completed，且不能接自己发布的任务。
// 后端就绪后删除本文件，并将 src/api/errand.js 中的调用替换为真实 request。

import { useAuthStore } from '@/stores/auth'

const LATENCY = 280

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function httpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

// 从登录态读取当前用户（mock 用，后端就绪后由 token 在服务端解析）
function currentUser() {
  try {
    return useAuthStore().userInfo || null
  } catch {
    return null
  }
}

// 测试数据（与 db/init/02_seed.sql 的 errands 口径一致，并补充若干条覆盖全部状态）
const items = [
  {
    id: '301',
    publisher_id: '3',
    publisher_nickname: '王同学',
    accepter_id: null,
    accepter_nickname: null,
    start_location: '北门菜鸟驿站',
    end_location: '梅园 5 栋楼下',
    fee_cents: 500,
    item_desc: '代取中号快递一个，18 点前送达即可。',
    contact_info: '13800000003',
    image_url: '/illustrations/campus-errand-bike.jpg',
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T09:00:00Z',
    updated_at: '2026-11-25T09:00:00Z',
  },
  {
    id: '302',
    publisher_id: '3',
    publisher_nickname: '王同学',
    accepter_id: '2',
    accepter_nickname: '林同学',
    start_location: '西区打印店',
    end_location: '一教 105 教室',
    fee_cents: 300,
    item_desc: '帮忙取已打印好的实验报告两份。',
    contact_info: '13800000003',
    status: 'in_progress',
    accepted_at: '2026-11-25T09:20:00Z',
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T09:05:00Z',
    updated_at: '2026-11-25T09:20:00Z',
  },
  {
    id: '303',
    publisher_id: '4',
    publisher_nickname: '陈同学',
    accepter_id: '2',
    accepter_nickname: '林同学',
    start_location: '二食堂一楼窗口',
    end_location: '竹园 2 栋宿管处',
    fee_cents: 400,
    item_desc: '代买一份打包米饭，已送到宿管处待确认。',
    contact_info: '13800000004',
    status: 'pending_confirm',
    accepted_at: '2026-11-25T04:10:00Z',
    delivered_at: '2026-11-25T04:35:00Z',
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-25T04:00:00Z',
    updated_at: '2026-11-25T04:35:00Z',
  },
  {
    id: '304',
    publisher_id: '2',
    publisher_nickname: '林同学',
    accepter_id: '4',
    accepter_nickname: '陈同学',
    start_location: '南门丰巢快递柜',
    end_location: '兰园 3 栋楼下',
    fee_cents: 600,
    item_desc: '代取书籍包裹一件，已完成交付。',
    contact_info: '13800000002',
    status: 'completed',
    accepted_at: '2026-11-24T03:10:00Z',
    delivered_at: '2026-11-24T03:30:00Z',
    completed_at: '2026-11-24T03:45:00Z',
    moderation_status: 'normal',
    created_at: '2026-11-24T03:00:00Z',
    updated_at: '2026-11-24T03:45:00Z',
  },
  {
    id: '305',
    publisher_id: '5',
    publisher_nickname: '赵同学',
    accepter_id: null,
    accepter_nickname: null,
    start_location: '东门生活超市',
    end_location: '梅园 1 栋楼下',
    fee_cents: 350,
    item_desc: '代购两瓶矿泉水和一包纸巾。',
    contact_info: '13800000005',
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T02:00:00Z',
    updated_at: '2026-11-26T02:00:00Z',
  },
  {
    id: '306',
    publisher_id: '6',
    publisher_nickname: '孙同学',
    accepter_id: '3',
    accepter_nickname: '王同学',
    start_location: '图书馆一楼',
    end_location: '信息楼 203',
    fee_cents: 250,
    item_desc: '代还两本借阅图书，送到信息楼前台即可。',
    contact_info: '13800000006',
    status: 'in_progress',
    accepted_at: '2026-11-26T02:20:00Z',
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T02:10:00Z',
    updated_at: '2026-11-26T02:20:00Z',
  },
  {
    id: '307',
    publisher_id: '7',
    publisher_nickname: '周同学',
    accepter_id: null,
    accepter_nickname: null,
    start_location: '西门打印店',
    end_location: '一教 202',
    fee_cents: 300,
    item_desc: '代取打印好的课程设计封面三张。',
    contact_info: '13800000007',
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T03:00:00Z',
    updated_at: '2026-11-26T03:00:00Z',
  },
  {
    id: '308',
    publisher_id: '8',
    publisher_nickname: '吴同学',
    accepter_id: '5',
    accepter_nickname: '赵同学',
    start_location: '二食堂一楼',
    end_location: '竹园 3 栋',
    fee_cents: 450,
    item_desc: '代买一份晚餐，送到楼下联系取餐。',
    contact_info: '13800000008',
    status: 'pending_confirm',
    accepted_at: '2026-11-26T03:10:00Z',
    delivered_at: '2026-11-26T03:40:00Z',
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T03:05:00Z',
    updated_at: '2026-11-26T03:40:00Z',
  },
  {
    id: '309',
    publisher_id: '9',
    publisher_nickname: '郑同学',
    accepter_id: null,
    accepter_nickname: null,
    start_location: '北门菜鸟驿站',
    end_location: '兰园 5 栋',
    fee_cents: 400,
    item_desc: '代取一个小型快递包裹。',
    contact_info: '13800000009',
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T04:00:00Z',
    updated_at: '2026-11-26T04:00:00Z',
  },
  {
    id: '310',
    publisher_id: '10',
    publisher_nickname: '冯同学',
    accepter_id: '6',
    accepter_nickname: '孙同学',
    start_location: '图书馆一楼',
    end_location: '二教 305',
    fee_cents: 200,
    item_desc: '送一份纸质作业到指定教室。',
    contact_info: '13800000010',
    status: 'completed',
    accepted_at: '2026-11-25T06:10:00Z',
    delivered_at: '2026-11-25T06:25:00Z',
    completed_at: '2026-11-25T06:30:00Z',
    moderation_status: 'normal',
    created_at: '2026-11-25T06:00:00Z',
    updated_at: '2026-11-25T06:30:00Z',
  },
  {
    id: '311',
    publisher_id: '11',
    publisher_nickname: '蒋同学',
    accepter_id: null,
    accepter_nickname: null,
    start_location: '体育馆门口',
    end_location: '梅园 4 栋',
    fee_cents: 300,
    item_desc: '代取落下的球衣一件。',
    contact_info: '13800000011',
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T05:00:00Z',
    updated_at: '2026-11-26T05:00:00Z',
  },
  {
    id: '312',
    publisher_id: '12',
    publisher_nickname: '沈同学',
    accepter_id: '7',
    accepter_nickname: '周同学',
    start_location: '西区超市',
    end_location: '竹园 1 栋',
    fee_cents: 500,
    item_desc: '代购洗漱用品若干，具体清单私聊确认。',
    contact_info: '13800000012',
    status: 'in_progress',
    accepted_at: '2026-11-26T05:30:00Z',
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: '2026-11-26T05:20:00Z',
    updated_at: '2026-11-26T05:30:00Z',
  },
]

// 新发布任务的自增 ID（后端就绪后由数据库生成）
let nextId = 313

/** 列表查询：支持关键词（起点/终点/说明）、状态、分页，按发布时间倒序。 */
export async function listItems(params = {}) {
  await delay()
  const { keyword = '', status = '', page = 1, page_size = 10 } = params
  const kw = String(keyword || '').trim().toLowerCase()

  let result = items.filter((item) => item.moderation_status === 'normal')

  if (kw) {
    result = result.filter((item) =>
      `${item.start_location} ${item.end_location} ${item.item_desc}`.toLowerCase().includes(kw)
    )
  }

  if (status) {
    result = result.filter((item) => item.status === status)
  }

  const sorted = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const start = (page - 1) * page_size
  return {
    items: sorted.slice(start, start + page_size),
    total: sorted.length,
    page,
    page_size,
  }
}

/** 单条详情查询。 */
export async function getItem(id) {
  await delay()
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) throw httpError(404, '该任务不存在或已删除')
  return item
}

/** 发布任务，publisher 取自当前登录用户。 */
export async function createItem(payload) {
  await delay()
  const user = currentUser()
  if (!user || !user.id) throw httpError(401, '请先登录后再发布')
  const now = new Date().toISOString()
  const item = {
    id: String(nextId++),
    publisher_id: user.id,
    publisher_nickname: user.nickname || '我',
    accepter_id: null,
    accepter_nickname: null,
    start_location: payload.start_location,
    end_location: payload.end_location,
    fee_cents: payload.fee_cents,
    item_desc: payload.item_desc,
    contact_info: payload.contact_info,
    image_url: payload.image_url || null,
    status: 'pending',
    accepted_at: null,
    delivered_at: null,
    completed_at: null,
    moderation_status: 'normal',
    created_at: now,
    updated_at: now,
  }
  items.unshift(item)
  return item
}

/** 接单：pending -> in_progress，接单人为当前用户，不能接自己发布的任务。 */
export async function acceptItem(id) {
  await delay()
  const user = currentUser()
  if (!user || !user.id) throw httpError(401, '请先登录后再接单')
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) throw httpError(404, '该任务不存在或已删除')
  if (String(item.publisher_id) === String(user.id)) throw httpError(409, '不能接自己发布的任务')
  if (item.status !== 'pending') throw httpError(409, '该任务已被接单或已结束')
  item.status = 'in_progress'
  item.accepter_id = user.id
  item.accepter_nickname = user.nickname || '我'
  item.accepted_at = new Date().toISOString()
  item.updated_at = item.accepted_at
  return item
}

/** 确认送达：in_progress -> pending_confirm，仅接单者可操作。 */
export async function deliverItem(id) {
  await delay()
  const user = currentUser()
  if (!user || !user.id) throw httpError(401, '请先登录')
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) throw httpError(404, '该任务不存在或已删除')
  if (String(item.accepter_id) !== String(user.id)) throw httpError(403, '仅接单者可以确认送达')
  if (item.status !== 'in_progress') throw httpError(409, '当前状态不允许该操作')
  item.status = 'pending_confirm'
  item.delivered_at = new Date().toISOString()
  item.updated_at = item.delivered_at
  return item
}

/** 确认完成：pending_confirm -> completed，仅发布者可操作。 */
export async function completeItem(id) {
  await delay()
  const user = currentUser()
  if (!user || !user.id) throw httpError(401, '请先登录')
  const item = items.find((entry) => String(entry.id) === String(id))
  if (!item) throw httpError(404, '该任务不存在或已删除')
  if (String(item.publisher_id) !== String(user.id)) throw httpError(403, '仅发布者可以确认完成')
  if (item.status !== 'pending_confirm') throw httpError(409, '当前状态不允许该操作')
  item.status = 'completed'
  item.completed_at = new Date().toISOString()
  item.updated_at = item.completed_at
  return item
}
