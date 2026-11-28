<script setup>
import { ImageOff } from 'lucide-vue-next'

defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '物品图片',
  },
})
</script>

<template>
  <div class="item-thumb" :class="{ 'is-empty': !src }">
    <img v-if="src" :src="src" :alt="alt" class="item-thumb__img" />
    <div v-else class="item-thumb__empty">
      <ImageOff :size="18" :stroke-width="1.5" />
      <span>暂无图像</span>
    </div>
  </div>
</template>

<style scoped>
.item-thumb {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--ct-radius-md);
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
}

.item-thumb__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item-thumb__empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: var(--ct-font-size-xs);
  line-height: 1.3;
  color: var(--ct-text-tertiary);
}

.item-thumb__empty svg {
  opacity: 0.65;
}
</style>
