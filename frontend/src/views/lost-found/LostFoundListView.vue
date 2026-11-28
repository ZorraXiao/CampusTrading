<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, MapPin, Plus } from 'lucide-vue-next'
import { fetchLostFoundList, ITEM_TYPE_LABEL } from '@/api/lostFound'
import AppPagination from '@/components/AppPagination.vue'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import EmptyState from '@/components/EmptyState.vue'
import ItemThumb from '@/components/ItemThumb.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatUtcToLocal } from '@/utils/format'

const router = useRouter()

const keyword = ref('')
const itemType = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const items = ref([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  try {
    const data = await fetchLostFoundList({
      keyword: keyword.value,
      item_type: itemType.value,
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

const quickTypes = [
  { label: '全部启事', value: '' },
  { label: '寻物启事', value: 'lost' },
  { label: '拾物招领', value: 'found' },
]

function handleSearch() {
  page.value = 1
  fetchList()
}

function handleTypeChange() {
  page.value = 1
  fetchList()
}

function handlePageChange() {
  fetchList()
}

function selectType(value) {
  itemType.value = value
  handleSearch()
}

onMounted(fetchList)
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="02 · 失物招领"
      title="信息大厅"
      description="汇总校园内的寻物启事与拾物招领，帮失物尽快回到主人手中。"
    >
      <template #actions>
        <el-button type="primary" round class="hall-btn" @click="router.push('/lost-found/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布信息</span>
        </el-button>
      </template>
    </PageHeader>

    <section class="hall-showcase" aria-label="信息类型导航">
      <div class="hall-showcase__thumb" aria-hidden="true">
        <img
          src="/illustrations/campus-lost-keys.jpg"
          alt=""
          class="hall-showcase__img"
        />
      </div>

      <div class="hall-showcase__body">
        <span class="hall-showcase__title">寻物与招领索引</span>
        <p class="hall-showcase__desc">
          校园卡、钥匙、眼镜与笔记本遗失拾获，写明特征与地点尽快核对认领。
        </p>
        <div class="hall-showcase__tabs" role="tablist" aria-label="信息类型快捷筛选">
          <button
            v-for="item in quickTypes"
            :key="item.value"
            type="button"
            :class="['hall-chip', { 'is-active': itemType === item.value }]"
            @click="selectType(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <EditorialIllustration scene="stamp" :size="76" class="hall-showcase__stamp" />
    </section>

    <SearchBar
      v-model="keyword"
      placeholder="搜索失物或拾物名称、地点..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select
          v-model="itemType"
          clearable
          placeholder="全部类型"
          style="width: 140px"
          @change="handleTypeChange"
        >
          <el-option label="寻物启事" value="lost" />
          <el-option label="拾物招领" value="found" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部信息</span>
        <div class="ct-legend">
          <StatusTag type="lost_found" status="searching" size="small" />
          <StatusTag type="lost_found" status="unclaimed" size="small" />
          <StatusTag type="lost_found" status="resolved" size="small" />
        </div>
      </div>

      <div v-loading="loading" class="ct-panel__body lf-body">
        <div v-if="items.length" class="lf-list">
          <router-link
            v-for="item in items"
            :key="item.id"
            :to="`/lost-found/${item.id}`"
            class="lf-item"
          >
            <ItemThumb :src="item.image_url" :alt="item.item_name" class="lf-item__thumb" />

            <div class="lf-item__main">
              <div class="lf-item__head">
                <span
                  :class="['lf-type', item.item_type === 'lost' ? 'lf-type--lost' : 'lf-type--found']"
                >
                  {{ ITEM_TYPE_LABEL[item.item_type] }}
                </span>
                <StatusTag type="lost_found" :status="item.status" size="small" />
              </div>

              <h3 class="lf-item__name">{{ item.item_name }}</h3>

              <div class="lf-item__meta">
                <span class="lf-item__loc">
                  <MapPin :size="14" :stroke-width="1.5" />
                  <span>{{ item.location }}</span>
                </span>
                <span class="lf-item__time ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
              </div>

              <p class="lf-item__desc">{{ item.description }}</p>

              <span class="lf-item__foot ct-link">
                <span>查看详情</span>
                <ArrowRight :size="14" :stroke-width="1.5" />
              </span>
            </div>
          </router-link>
        </div>

        <EmptyState
          v-else-if="!loading"
          scene="lost-found"
          description="没有找到符合条件的失物或拾物信息"
        >
          <el-button type="primary" round @click="router.push('/lost-found/create')">发布信息</el-button>
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

.lf-body {
  padding: 12px 20px;
}

.lf-list {
  display: flex;
  flex-direction: column;
}

.lf-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 4px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.lf-item__thumb {
  margin-top: 2px;
}

.lf-item__main {
  flex: 1;
  min-width: 0;
}

.lf-item:last-child {
  border-bottom: none;
}

.lf-item:hover .lf-item__name {
  color: var(--ct-accent);
}

.lf-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lf-type {
  padding: 2px 8px;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  line-height: 1.6;
  border-radius: var(--ct-radius-sm);
  border: 1px solid transparent;
}

.lf-type--lost {
  color: var(--ct-accent);
  background-color: var(--ct-accent-soft);
}

.lf-type--found {
  color: var(--ct-success);
  background-color: var(--ct-bg-subtle);
}

.lf-item__name {
  margin-top: 10px;
  font-size: var(--ct-font-size-md);
  font-weight: 600;
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
}

.lf-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin-top: 6px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.lf-item__loc {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.lf-item__time {
  color: var(--ct-text-tertiary);
}

.lf-item__desc {
  margin-top: 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lf-item__foot {
  margin-top: 10px;
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
