<script setup>
import { Search } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入关键词搜索...',
  },
  maxlength: {
    type: Number,
    default: 100,
  },
  searchText: {
    type: String,
    default: '搜索',
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

function handleInput(val) {
  emit('update:modelValue', val)
}

function triggerSearch() {
  const keyword = (props.modelValue || '').trim()
  if (keyword !== props.modelValue) {
    emit('update:modelValue', keyword)
  }
  emit('search', keyword)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
}
</script>

<template>
  <section class="ct-search-bar">
    <template v-if="$slots.filters">
      <div class="ct-search-bar__filters">
        <slot name="filters" />
      </div>
      <span class="ct-search-bar__divider" aria-hidden="true" />
    </template>

    <div class="ct-search-bar__keyword">
      <el-input
        :model-value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        clearable
        class="ct-search-bar__input"
        @update:model-value="handleInput"
        @keyup.enter="triggerSearch"
        @clear="handleClear"
      >
        <template #prefix>
          <Search :size="16" :stroke-width="1.5" class="ct-search-bar__icon" />
        </template>
      </el-input>

      <el-button type="primary" class="ct-search-bar__submit" @click="triggerSearch">
        {{ searchText }}
      </el-button>
    </div>

    <template v-if="$slots.actions">
      <span class="ct-search-bar__divider" aria-hidden="true" />
      <div class="ct-search-bar__actions">
        <slot name="actions" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.ct-search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 8px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
  transition: var(--ct-transition);
}

.ct-search-bar:hover {
  border-color: var(--ct-border-strong);
}

.ct-search-bar:focus-within {
  border-color: var(--ct-accent);
  box-shadow: 0 0 0 3px rgba(74, 56, 43, 0.07);
}

.ct-search-bar__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.ct-search-bar__divider {
  width: 1px;
  height: 20px;
  background-color: var(--ct-border);
  flex-shrink: 0;
}

.ct-search-bar__keyword {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 260px;
  min-width: 0;
}

.ct-search-bar__input {
  flex: 1;
}

.ct-search-bar__icon {
  color: var(--ct-text-tertiary);
}

.ct-search-bar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 2px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: none !important;
  background-color: transparent;
}

:deep(.ct-search-bar__filters .el-select__wrapper:hover) {
  background-color: var(--ct-bg-subtle);
  border-radius: var(--ct-radius-sm);
}

@media (max-width: 640px) {
  .ct-search-bar__divider {
    display: none;
  }

  .ct-search-bar__keyword {
    flex: 1 1 100%;
  }
}
</style>
