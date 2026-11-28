// 失物招领模块 · 接口封装。
//
// 当前后端业务接口尚未实现，各函数暂时调用本地 mock（见 ./mock/lostFound.js），
// 以支撑页面开发与交互演示。待后端接口就绪后，把每个函数内部替换为注释中的
// request 调用即可，页面代码无需改动（返回结构保持一致：直接返回业务 data）。

import {
  listItems,
  getItem,
  createItem,
  resolveItem,
} from '@/api/mock/lostFound'

/** 信息类型文案映射，供列表 / 详情 / 发布页共用。 */
export const ITEM_TYPE_LABEL = {
  lost: '寻物启事',
  found: '拾物招领',
}

/** 查询信息列表，params: { keyword, item_type, page, page_size }。 */
export function fetchLostFoundList(params) {
  return listItems(params)
  // TODO(阶段3): return request.get('/lost-found', { params }).then((res) => res.data)
}

/** 查询单条信息详情。 */
export function fetchLostFoundDetail(id) {
  return getItem(id)
  // TODO(阶段3): return request.get(`/lost-found/${id}`).then((res) => res.data)
}

/** 发布寻物 / 拾物信息，payload: { item_type, item_name, location, contact_info, description }。 */
export function createLostFoundItem(payload) {
  return createItem(payload)
  // TODO(阶段3): return request.post('/lost-found', payload).then((res) => res.data)
}

/** 完结信息：失主认领拾物 / 发布者标记已找回。 */
export function resolveLostFoundItem(id) {
  return resolveItem(id)
  // TODO(阶段3): return request.patch(`/lost-found/${id}/resolve`).then((res) => res.data)
}
