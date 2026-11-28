<script setup>
import { h } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

const PrevIcon = () => h(ChevronLeft, { size: 16, strokeWidth: 1.5 })
const NextIcon = () => h(ChevronRight, { size: 16, strokeWidth: 1.5 })

function handlePageChange(nextPage) {
  emit('update:page', nextPage)
  emit('change', { page: nextPage, pageSize: props.pageSize })
}

function handleSizeChange(nextSize) {
  const maxPage = Math.max(1, Math.ceil(props.total / nextSize))
  const nextPage = props.page > maxPage ? 1 : props.page
  if (nextPage !== props.page) {
    emit('update:page', nextPage)
  }
  emit('update:pageSize', nextSize)
  emit('change', { page: nextPage, pageSize: nextSize })
}
</script>

<template>
  <div class="ct-pagination ct-num">
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :hide-on-single-page="hideOnSinglePage"
      :prev-icon="PrevIcon"
      :next-icon="NextIcon"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped>
.ct-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

:deep(.el-pagination) {
  --el-pagination-font-size: var(--ct-font-size-sm);
  --el-pagination-button-width: 32px;
  --el-pagination-button-height: 32px;
  --el-pagination-text-color: var(--ct-text-secondary);
  --el-pagination-bg-color: transparent;
  --el-pagination-button-bg-color: transparent;
  gap: 4px;
  flex-wrap: wrap;
}

:deep(.el-pager) {
  gap: 4px;
}

:deep(.el-pager li) {
  min-width: 32px;
  height: 32px;
  line-height: 30px;
  border: 1px solid transparent;
  border-radius: var(--ct-radius-sm);
  font-family: var(--ct-font-mono);
  font-weight: 500;
  color: var(--ct-text-secondary);
  font-variant-numeric: tabular-nums;
  transition: var(--ct-transition);
}

:deep(.el-pager li:hover) {
  background-color: var(--ct-bg-subtle);
  color: var(--ct-text-primary);
}

:deep(.el-pager li.is-active) {
  background-color: var(--ct-accent);
  border-color: var(--ct-accent);
  color: var(--ct-bg-surface);
  font-weight: 500;
}

:deep(.btn-prev),
:deep(.btn-next) {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-sm);
  background-color: var(--ct-bg-surface);
  color: var(--ct-text-secondary);
  transition: var(--ct-transition);
}

:deep(.btn-prev:hover:not(:disabled)),
:deep(.btn-next:hover:not(:disabled)) {
  border-color: var(--ct-border-strong);
  color: var(--ct-text-primary);
}

:deep(.btn-prev .el-icon),
:deep(.btn-next .el-icon) {
  font-size: 16px;
}

:deep(.el-pagination__total),
:deep(.el-pagination__jump) {
  color: var(--ct-text-tertiary);
  font-size: var(--ct-font-size-sm);
  font-variant-numeric: tabular-nums;
}
</style>
