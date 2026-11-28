// 跑腿服务模块 · 接口封装。
//
// 当前后端业务接口尚未实现，各函数暂时调用本地 mock（见 ./mock/errand.js），
// 以支撑页面开发与交互演示。待后端接口就绪后，把每个函数内部替换为注释中的
// request 调用即可，页面代码无需改动（返回结构保持一致：直接返回业务 data）。

import {
  listItems,
  getItem,
  createItem,
  acceptItem,
  deliverItem,
  completeItem,
} from '@/api/mock/errand'

/** 查询任务列表，params: { keyword, status, page, page_size }。 */
export function fetchErrandList(params) {
  return listItems(params)
  // TODO(阶段3): return request.get('/errands', { params }).then((res) => res.data)
}

/** 查询单条任务详情。 */
export function fetchErrandDetail(id) {
  return getItem(id)
  // TODO(阶段3): return request.get(`/errands/${id}`).then((res) => res.data)
}

/** 发布任务，payload: { start_location, end_location, fee_cents, item_desc, contact_info }。 */
export function createErrand(payload) {
  return createItem(payload)
  // TODO(阶段3): return request.post('/errands', payload).then((res) => res.data)
}

/** 接单：pending -> in_progress。 */
export function acceptErrand(id) {
  return acceptItem(id)
  // TODO(阶段3): return request.post(`/errands/${id}/accept`).then((res) => res.data)
}

/** 确认送达：in_progress -> pending_confirm。 */
export function deliverErrand(id) {
  return deliverItem(id)
  // TODO(阶段3): return request.post(`/errands/${id}/deliver`).then((res) => res.data)
}

/** 确认完成：pending_confirm -> completed。 */
export function completeErrand(id) {
  return completeItem(id)
  // TODO(阶段3): return request.post(`/errands/${id}/complete`).then((res) => res.data)
}
