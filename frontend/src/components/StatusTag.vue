<script>
export const STATUS_MAP = {
  product: {
    on_sale: { label: '在售', tagType: 'success' },
    off_shelf: { label: '已下架', tagType: 'info' },
  },
  lost_found: {
    searching: { label: '寻找中', tagType: 'warning' },
    unclaimed: { label: '待认领', tagType: 'primary' },
    resolved: { label: '已完结', tagType: 'info' },
  },
  errand: {
    pending: { label: '待接单', tagType: 'warning' },
    in_progress: { label: '进行中', tagType: 'primary' },
    pending_confirm: { label: '待确认', tagType: 'primary', customClass: 'is-pending-confirm' },
    completed: { label: '已完成', tagType: 'success' },
  },
  moderation: {
    normal: { label: '正常', tagType: 'success' },
    taken_down: { label: '违规下架', tagType: 'danger' },
  },
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (val) => ['product', 'lost_found', 'lost-found', 'errand', 'moderation'].includes(val),
  },
  status: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'default',
  },
  effect: {
    type: String,
    default: 'light',
  },
})

const normalizedCategory = computed(() =>
  props.type === 'lost-found' ? 'lost_found' : props.type
)

const resolvedMeta = computed(() => {
  const group = STATUS_MAP[normalizedCategory.value] || {}
  return (
    group[props.status] || {
      label: props.status || '未知状态',
      tagType: 'info',
    }
  )
})
</script>

<template>
  <span
    :class="[
      'ct-status-tag',
      `is-${resolvedMeta.tagType}`,
      `is-size-${size}`,
      `is-effect-${effect}`,
      resolvedMeta.customClass,
    ]"
  >
    <span class="ct-status-tag__dot" aria-hidden="true" />
    <span>{{ resolvedMeta.label }}</span>
  </span>
</template>

<style scoped>
.ct-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 9px;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  line-height: 1;
  border-radius: var(--ct-radius-round);
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
  color: var(--ct-text-secondary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: var(--ct-transition);
}

.ct-status-tag__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--ct-radius-round);
  background-color: var(--dot-color, var(--ct-info));
  flex-shrink: 0;
}

.ct-status-tag.is-success {
  --dot-color: var(--ct-success);
  background-color: var(--ct-success-soft);
  border-color: #CFE0D6;
  color: #355947;
}

.ct-status-tag.is-warning {
  --dot-color: var(--ct-warning);
  background-color: var(--ct-warning-soft);
  border-color: #E6D5B8;
  color: #845D22;
}

.ct-status-tag.is-primary {
  --dot-color: var(--ct-accent);
  background-color: var(--ct-accent-soft);
  border-color: #D8CBBF;
  color: var(--ct-accent);
}

.ct-status-tag.is-info {
  --dot-color: var(--ct-info);
  background-color: var(--ct-info-soft);
  border-color: var(--ct-border);
  color: var(--ct-text-secondary);
}

.ct-status-tag.is-danger {
  --dot-color: var(--ct-danger);
  background-color: var(--ct-danger-soft);
  border-color: #E6CBC7;
  color: #8F4A43;
}

.ct-status-tag.is-pending-confirm {
  --dot-color: var(--ct-violet);
  background-color: var(--ct-violet-soft);
  border-color: #DDD4DD;
  color: #5C4D5C;
}

.ct-status-tag.is-size-small {
  height: 20px;
  padding: 0 7px;
  font-size: 11px;
}

.ct-status-tag.is-size-large {
  height: 26px;
  padding: 0 11px;
  font-size: var(--ct-font-size-sm);
}

.ct-status-tag.is-effect-plain {
  background-color: transparent;
}

.ct-status-tag.is-effect-dark {
  background-color: var(--ct-text-primary);
  border-color: var(--ct-text-primary);
  color: var(--ct-bg-surface);
}
</style>
