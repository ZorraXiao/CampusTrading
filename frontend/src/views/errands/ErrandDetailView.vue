<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight, MapPin } from 'lucide-vue-next'
import {
  acceptErrand,
  completeErrand,
  deliverErrand,
  fetchErrandDetail,
} from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useAuthStore } from '@/stores/auth'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const notFound = ref(false)
const acting = ref(false)
const item = ref(null)

const currentUserId = computed(() => authStore.userInfo?.id || '')
const isLoggedIn = computed(() => authStore.isLoggedIn)

const isPublisher = computed(
  () => item.value && String(item.value.publisher_id) === String(currentUserId.value)
)
const isAccepter = computed(
  () => item.value && String(item.value.accepter_id) === String(currentUserId.value)
)

// 根据状态与当前用户身份决定可执行动作
const action = computed(() => {
  if (!item.value) return null
  const status = item.value.status

  if (status === 'completed') return null

  if (status === 'pending') {
    if (!isLoggedIn.value) {
      return { type: 'login', label: '登录后接单' }
    }
    if (isPublisher.value) {
      return { type: 'hint', label: '等待同学接单' }
    }
    return {
      type: 'accept',
      label: '接单',
      confirmText: '确认接下这个跑腿任务？接单后请按时完成。',
      successText: '接单成功',
    }
  }

  if (status === 'in_progress') {
    if (isAccepter.value) {
      return {
        type: 'deliver',
        label: '确认送达',
        confirmText: '确认已将物品送达终点？',
        successText: '已确认送达，等待发布者确认',
      }
    }
    return { type: 'hint', label: '任务进行中' }
  }

  if (status === 'pending_confirm') {
    if (isPublisher.value) {
      return {
        type: 'complete',
        label: '确认完成',
        confirmText: '确认任务已顺利完成？',
        successText: '任务已完成',
      }
    }
    return { type: 'hint', label: '等待发布者确认' }
  }

  return null
})

async function load() {
  loading.value = true
  notFound.value = false
  try {
    item.value = await fetchErrandDetail(route.params.id)
  } catch {
    notFound.value = true
    item.value = null
  } finally {
    loading.value = false
  }
}

async function handleAction() {
  const act = action.value
  if (!act || !item.value) return

  if (act.type === 'login') {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  if (act.type === 'hint') return

  try {
    await ElMessageBox.confirm(act.confirmText, act.label, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })
  } catch {
    return // 用户取消
  }

  acting.value = true
  try {
    if (act.type === 'accept') {
      item.value = await acceptErrand(item.value.id)
    } else if (act.type === 'deliver') {
      item.value = await deliverErrand(item.value.id)
    } else if (act.type === 'complete') {
      item.value = await completeErrand(item.value.id)
    }
    ElMessage.success(act.successText)
  } catch (err) {
    ElMessage.error(err?.message || '操作失败，请稍后再试')
  } finally {
    acting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="ct-page detail-page">
    <PageHeader
      :back="{ to: '/errands', label: '任务大厅' }"
      title="跑腿任务详情"
      description="确认取送地点与酬劳后即可接单。"
    >
      <template #meta>
        <span class="ct-mono">编号 #{{ route.params.id }}</span>
      </template>
    </PageHeader>

    <section v-loading="loading" class="ct-panel">
      <template v-if="item">
        <div class="ct-panel__body">
          <div class="detail-head">
            <span class="detail-fee ct-mono">¥{{ formatCentsToYuan(item.fee_cents) }}</span>
            <StatusTag type="errand" :status="item.status" size="small" />
          </div>

          <div v-if="item.image_url" class="detail-image">
            <img :src="item.image_url" :alt="item.item_desc" />
          </div>

          <div class="detail-route">
            <div class="detail-route__head">
              <MapPin :size="15" :stroke-width="1.5" />
              <span class="detail-route__kicker">起点 → 终点</span>
            </div>
            <div class="detail-route__body">
              <span class="detail-route__place">{{ item.start_location }}</span>
              <ArrowRight :size="15" :stroke-width="1.5" class="detail-route__arrow" />
              <span class="detail-route__place">{{ item.end_location }}</span>
            </div>
          </div>

          <div class="ct-kv detail-kv">
            <div class="ct-kv__row">
              <span class="ct-kv__label">任务说明</span>
              <span class="ct-kv__value detail-desc">{{ item.item_desc }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">跑腿酬劳</span>
              <span class="ct-kv__value ct-mono">¥{{ formatCentsToYuan(item.fee_cents) }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">联系方式</span>
              <span class="ct-kv__value ct-num">{{ item.contact_info }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布者</span>
              <span class="ct-kv__value">{{ item.publisher_nickname }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">接单人</span>
              <span class="ct-kv__value">{{ item.accepter_nickname || '暂无' }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
            </div>
            <div v-if="item.accepted_at" class="ct-kv__row">
              <span class="ct-kv__label">接单时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.accepted_at) }}</span>
            </div>
            <div v-if="item.delivered_at" class="ct-kv__row">
              <span class="ct-kv__label">送达时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.delivered_at) }}</span>
            </div>
            <div v-if="item.completed_at" class="ct-kv__row">
              <span class="ct-kv__label">完成时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.completed_at) }}</span>
            </div>
          </div>
        </div>

        <div class="ct-panel__footer detail-actions">
          <router-link to="/errands">
            <el-button>返回任务大厅</el-button>
          </router-link>

          <el-button
            v-if="action && action.type === 'login'"
            type="primary"
            @click="handleAction"
          >
            {{ action.label }}
          </el-button>

          <el-button
            v-else-if="action && action.type === 'hint'"
            disabled
          >
            {{ action.label }}
          </el-button>

          <el-button
            v-else-if="action"
            type="primary"
            :loading="acting"
            @click="handleAction"
          >
            {{ action.label }}
          </el-button>
        </div>
      </template>

      <div v-else-if="notFound" class="ct-panel__body">
        <EmptyState description="该任务不存在或已被删除">
          <router-link to="/errands">
            <el-button type="primary">返回任务大厅</el-button>
          </router-link>
        </EmptyState>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 760px;
  margin: 0 auto;
}

.detail-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.detail-fee {
  font-size: var(--ct-font-size-2xl);
  font-weight: 600;
  color: var(--ct-accent);
}

.detail-image {
  margin-bottom: 16px;
  border-radius: var(--ct-radius-md);
  border: 1px solid var(--ct-border);
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.detail-route {
  padding: 20px;
  background-color: var(--ct-bg-canvas);
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
}

.detail-route__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: var(--ct-accent);
}

.detail-route__kicker {
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-secondary);
}

.detail-route__body {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: var(--ct-font-size-md);
  font-weight: 500;
  color: var(--ct-text-primary);
}

.detail-route__place {
  padding: 4px 10px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-sm);
}

.detail-route__arrow {
  color: var(--ct-text-tertiary);
}

.detail-kv {
  margin-top: 16px;
}

.detail-desc {
  line-height: 1.7;
  white-space: pre-wrap;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
