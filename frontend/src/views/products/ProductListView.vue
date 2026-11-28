<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Plus } from 'lucide-vue-next'
import AppPagination from '@/components/AppPagination.vue'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'

const router = useRouter()

const keyword = ref('')
const selectedCategory = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const quickCategories = [
  { label: '全部闲置', value: '' },
  { label: '书籍教材', value: 'books' },
  { label: '数码电子', value: 'electronics' },
  { label: '生活用品', value: 'daily' },
]

function handleSearch() {
  page.value = 1
}

function selectCategory(value) {
  selectedCategory.value = value
  handleSearch()
}
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="01 · 二手交易"
      title="商品大厅"
      description="浏览同校师生发布的闲置物品，按分类与关键词快速筛选。"
    >
      <template #actions>
        <el-button type="primary" round class="hall-btn" @click="router.push('/products/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布商品</span>
        </el-button>
      </template>
    </PageHeader>

    <section class="hall-showcase" aria-label="商品分类导航">
      <div class="hall-showcase__thumb" aria-hidden="true">
        <img
          src="/illustrations/campus-desk-books.jpg"
          alt=""
          class="hall-showcase__img is-cropped"
        />
      </div>

      <div class="hall-showcase__body">
        <span class="hall-showcase__title">校园闲置分类索引</span>
        <p class="hall-showcase__desc">
          教材教辅、数码外设与宿舍日用，按分类快速浏览同校师生发布的闲置好物。
        </p>
        <div class="hall-showcase__tabs" role="tablist" aria-label="快捷分类筛选">
          <button
            v-for="item in quickCategories"
            :key="item.value"
            type="button"
            :class="['hall-chip', { 'is-active': selectedCategory === item.value }]"
            @click="selectCategory(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <EditorialIllustration scene="stamp" :size="76" class="hall-showcase__stamp" />
    </section>

    <SearchBar
      v-model="keyword"
      placeholder="搜索商品标题或描述（最多 100 字）"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="selectedCategory" clearable placeholder="全部分类" style="width: 140px">
          <el-option label="书籍教材" value="books" />
          <el-option label="数码电子" value="electronics" />
          <el-option label="生活用品" value="daily" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部商品</span>
        <div class="ct-legend">
          <StatusTag type="product" status="on_sale" size="small" />
          <StatusTag type="product" status="off_shelf" size="small" />
        </div>
      </div>

      <div class="ct-panel__body">
        <EmptyState scene="books" description="还没有在售的闲置，成为第一个发布的同学吧">
          <el-button type="primary" round @click="router.push('/products/create')">发布商品</el-button>
          <router-link to="/products/101" class="ct-link hall-example-link">
            <span>查看示例商品详情</span>
            <ArrowRight :size="14" :stroke-width="1.5" />
          </router-link>
        </EmptyState>
      </div>

      <div class="ct-panel__footer">
        <AppPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
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

.hall-showcase__img.is-cropped {
  transform: scale(1.08);
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

.hall-example-link {
  padding: 0 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
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
