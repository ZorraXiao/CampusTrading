<script setup>
import { computed } from 'vue'
import EditorialIllustration from '@/components/EditorialIllustration.vue'

const props = defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
  imageSize: {
    type: Number,
    default: 120,
  },
  scene: {
    type: String,
    default: 'archive-empty',
  },
})

const illusWidth = computed(() => Math.min(220, Math.max(120, Math.round(props.imageSize * 1.35))))
</script>

<template>
  <div class="ct-empty-state">
    <div class="ct-empty-state__art" aria-hidden="true">
      <EditorialIllustration :scene="scene" :size="illusWidth" />
    </div>
    <p class="ct-empty-state__desc">{{ description }}</p>
    <div v-if="$slots.default" class="ct-empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ct-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 24px;
  text-align: center;
}

.ct-empty-state__art {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ct-empty-state__desc {
  margin-top: 14px;
  max-width: 380px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.ct-empty-state__actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
