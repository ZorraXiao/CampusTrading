<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CheckCircle2 } from 'lucide-vue-next'
import { fetchLostFoundDetail, resolveLostFoundItem, ITEM_TYPE_LABEL } from '@/api/lostFound'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatUtcToLocal } from '@/utils/format'

const route = useRoute()

const loading = ref(true)
const notFound = ref(false)
const resolving = ref(false)
const item = ref(null)

const itemTypeLabel = computed(() =>
  item.value ? ITEM_TYPE_LABEL[item.value.item_type] : '--'
)

const isFound = computed(() => item.value?.item_type === 'found')

const canResolve = computed(() => Boolean(item.value) && item.value.status !== 'resolved')

const actionLabel = computed(() => {
  if (!item.value) return ''
  return isFound.value ? '认领该物品' : '标记已找回'
})

const actionHint = computed(() => {
  if (!item.value) return ''
  return isFound.value
    ? '确认你是该物品的失主，核对信息无误后即可完成认领。'
    : '物品已找回后，可将该信息标记为已完结。'
})

async function load() {
  loading.value = true
  notFound.value = false
  try {
    item.value = await fetchLostFoundDetail(route.params.id)
  } catch {
    notFound.value = true
    item.value = null
  } finally {
    loading.value = false
  }
}

async function handleResolve() {
  if (!item.value) return

  try {
    await ElMessageBox.confirm(actionHint.value, actionLabel.value, {
      confirmButtonText: '确认完结',
      cancelButtonText: '再想想',
      type: 'info',
    })
  } catch {
    return // 用户取消
  }

  resolving.value = true
  try {
    item.value = await resolveLostFoundItem(item.value.id)
    ElMessage.success(
      isFound.value ? '认领成功，该信息已完结' : '已标记找回，该信息已完结'
    )
  } catch (err) {
    ElMessage.error(err?.message || '操作失败，请稍后再试')
  } finally {
    resolving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="ct-page detail-page">
    <PageHeader
      :back="{ to: '/lost-found', label: '信息大厅' }"
      title="失物 / 寻物详情"
      description="核对物品特征，确认后联系发布者认领或归还。"
    >
      <template #meta>
        <span class="ct-mono">编号 #{{ route.params.id }}</span>
      </template>
    </PageHeader>

    <section v-loading="loading" class="ct-panel">
      <template v-if="item">
        <div class="ct-panel__body">
          <div class="detail-head">
            <span
              :class="['detail-type', item.item_type === 'lost' ? 'detail-type--lost' : 'detail-type--found']"
            >
              {{ itemTypeLabel }}
            </span>
            <StatusTag type="lost_found" :status="item.status" size="small" />
          </div>

          <div v-if="item.image_url" class="detail-image">
            <img :src="item.image_url" :alt="item.item_name" />
          </div>

          <h2 class="detail-name">{{ item.item_name }}</h2>

          <div class="ct-kv detail-kv">
            <div class="ct-kv__row">
              <span class="ct-kv__label">信息类型</span>
              <span class="ct-kv__value">{{ itemTypeLabel }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">{{ isFound ? '拾取地点' : '丢失地点' }}</span>
              <span class="ct-kv__value">{{ item.location }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">详细描述</span>
              <span class="ct-kv__value detail-desc">{{ item.description }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">联系方式</span>
              <span class="ct-kv__value ct-num">
                {{ item.status === 'resolved' ? '信息已隐藏' : item.contact_info }}
              </span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布者</span>
              <span class="ct-kv__value">{{ item.publisher_nickname }}</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
            </div>
            <div v-if="item.status === 'resolved'" class="ct-kv__row">
              <span class="ct-kv__label">完结时间</span>
              <span class="ct-kv__value ct-num">{{ formatUtcToLocal(item.resolved_at) }}</span>
            </div>
          </div>
        </div>

        <div class="ct-panel__footer detail-actions">
          <router-link to="/lost-found">
            <el-button>返回信息大厅</el-button>
          </router-link>
          <el-button
            v-if="canResolve"
            type="primary"
            :loading="resolving"
            @click="handleResolve"
          >
            <CheckCircle2 v-if="!resolving" :size="15" :stroke-width="1.5" />
            <span>{{ actionLabel }}</span>
          </el-button>
        </div>
      </template>

      <div v-else-if="notFound" class="ct-panel__body">
        <EmptyState description="该信息不存在或已被删除">
          <router-link to="/lost-found">
            <el-button type="primary">返回信息大厅</el-button>
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
  margin-bottom: 12px;
}

.detail-type {
  padding: 2px 8px;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  line-height: 1.6;
  border-radius: var(--ct-radius-sm);
  border: 1px solid transparent;
}

.detail-type--lost {
  color: var(--ct-accent);
  background-color: var(--ct-accent-soft);
}

.detail-type--found {
  color: var(--ct-success);
  background-color: var(--ct-bg-subtle);
}

.detail-name {
  font-size: var(--ct-font-size-xl);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.detail-image {
  margin: 14px 0 16px;
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

.detail-actions .el-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
