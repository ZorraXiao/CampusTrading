<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, MapPin, Plus } from 'lucide-vue-next'
import { fetchErrandList } from '@/api/errand'
import AppPagination from '@/components/AppPagination.vue'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import EmptyState from '@/components/EmptyState.vue'
import ItemThumb from '@/components/ItemThumb.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'

const router = useRouter()

const keyword = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const items = ref([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  try {
    const data = await fetchErrandList({
      keyword: keyword.value,
      status: statusFilter.value,
      page: page.value,
      page_size: pageSize.value,
    })
    items.value = data.items
    total.value = data.total
  } catch {
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const quickStatuses = [
  { label: '全部任务', value: '' },
  { label: '待接单', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
]

function handleSearch() {
  page.value = 1
  fetchList()
}

function handleStatusChange() {
  page.value = 1
  fetchList()
}

function handlePageChange() {
  fetchList()
}

function selectStatus(value) {
  statusFilter.value = value
  handleSearch()
}

onMounted(fetchList)
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="03 · 跑腿服务"
      title="任务大厅"
      description="取快递、带饭、代送文件，看看有没有顺路就能帮上的忙。"
    >
      <template #actions>
        <el-button type="primary" round class="hall-btn" @click="router.push('/errands/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布跑腿</span>
        </el-button>
      </template>
    </PageHeader>

    <section class="hall-showcase" aria-label="任务状态导航">
      <div class="hall-showcase__thumb" aria-hidden="true">
        <img
          src="/illustrations/campus-errand-bike.jpg"
          alt=""
          class="hall-showcase__img is-cropped-lg"
        />
      </div>

      <div class="hall-showcase__body">
        <span class="hall-showcase__title">校内顺路委托</span>
        <p class="hall-showcase__desc">
          代取驿站快递、食堂带饭与纸质材料转交，明确起点终点与酬劳即可顺路接单。
        </p>
        <div class="hall-showcase__tabs" role="tablist" aria-label="任务状态快捷筛选">
          <button
            v-for="item in quickStatuses"
            :key="item.value"
            type="button"
            :class="['hall-chip', { 'is-active': statusFilter === item.value }]"
            @click="selectStatus(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <EditorialIllustration scene="stamp" :size="76" class="hall-showcase__stamp" />
    </section>

    <SearchBar
      v-model="keyword"
      placeholder="搜索起点、终点或物品说明..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select
          v-model="statusFilter"
          clearable
          placeholder="全部状态"
          style="width: 140px"
          @change="handleStatusChange"
        >
          <el-option label="待接单" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="待确认" value="pending_confirm" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部任务</span>
        <div class="ct-legend">
          <StatusTag type="errand" status="pending" size="small" />
          <StatusTag type="errand" status="in_progress" size="small" />
          <StatusTag type="errand" status="pending_confirm" size="small" />
          <StatusTag type="errand" status="completed" size="small" />
        </div>
      </div>

      <div v-loading="loading" class="ct-panel__body er-body">
        <div v-if="items.length" class="er-list">
          <router-link
            v-for="item in items"
            :key="item.id"
            :to="`/errands/${item.id}`"
            class="er-item"
          >
            <ItemThumb :src="item.image_url" :alt="item.item_desc" class="er-item__thumb" />

            <div class="er-item__main">
              <div class="er-item__head">
                <span class="er-item__fee ct-mono">¥{{ formatCentsToYuan(item.fee_cents) }}</span>
                <StatusTag type="errand" :status="item.status" size="small" />
              </div>

              <p class="er-item__desc">{{ item.item_desc }}</p>

              <div class="er-item__route">
                <span class="er-item__place">
                  <MapPin :size="14" :stroke-width="1.5" />
                  <span>{{ item.start_location }}</span>
                </span>
                <ArrowRight :size="14" :stroke-width="1.5" class="er-item__arrow" />
                <span class="er-item__place">
                  <MapPin :size="14" :stroke-width="1.5" />
                  <span>{{ item.end_location }}</span>
                </span>
              </div>

              <div class="er-item__foot">
                <span class="er-item__time ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
                <span class="ct-link">
                  <span>查看详情</span>
                  <ArrowRight :size="14" :stroke-width="1.5" />
                </span>
              </div>
            </div>
          </router-link>
        </div>

        <EmptyState
          v-else-if="!loading"
          scene="errands"
          description="没有找到符合条件的跑腿任务"
        >
          <el-button type="primary" round @click="router.push('/errands/create')">发布跑腿</el-button>
        </EmptyState>
      </div>

      <div class="ct-panel__footer">
        <AppPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
          @change="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(.hall-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.er-body {
  padding: 12px 20px;
}

.er-list {
  display: flex;
  flex-direction: column;
}

.er-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 4px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.er-item__thumb {
  margin-top: 2px;
}

.er-item__main {
  flex: 1;
  min-width: 0;
}

.er-item:last-child {
  border-bottom: none;
}

.er-item:hover .er-item__desc {
  color: var(--ct-accent);
}

.er-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.er-item__fee {
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
  color: var(--ct-accent);
}

.er-item__desc {
  margin-top: 8px;
  font-size: var(--ct-font-size-md);
  font-weight: 500;
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.er-item__route {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}

.er-item__place {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.er-item__arrow {
  color: var(--ct-text-tertiary);
}

.er-item__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.er-item__time {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.er-item__foot .ct-link {
  font-size: var(--ct-font-size-sm);
}

.hall-showcase {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-lg);
  overflow: hidden;
}

.hall-showcase__thumb {
  width: 160px;
  height: 108px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--ct-radius-md);
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
}

.hall-showcase__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hall-showcase__img.is-cropped-lg {
  transform: scale(1.11);
}

.hall-showcase__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hall-showcase__title {
  font-size: var(--ct-font-size-sm);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.hall-showcase__desc {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}

.hall-showcase__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.hall-chip {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-round);
  background-color: var(--ct-bg-canvas);
  font-family: inherit;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  color: var(--ct-text-secondary);
  cursor: pointer;
  transition: var(--ct-transition);
}

.hall-chip:hover {
  border-color: var(--ct-border-strong);
  background-color: var(--ct-bg-subtle);
  color: var(--ct-text-primary);
}

.hall-chip.is-active {
  background-color: var(--ct-accent);
  border-color: var(--ct-accent);
  color: var(--ct-bg-surface);
}

.hall-showcase__stamp {
  opacity: 0.28;
  transform: rotate(10deg);
  pointer-events: none;
}

@media (max-width: 720px) {
  .hall-showcase {
    flex-direction: column;
    align-items: flex-start;
  }

  .hall-showcase__thumb {
    width: 100%;
    height: 132px;
  }

  .hall-showcase__stamp {
    display: none;
  }
}
</style>
