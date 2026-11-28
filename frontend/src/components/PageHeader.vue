<script setup>
import { ArrowLeft } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    default: '',
  },
  back: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <header class="ct-page-header">
    <div class="ct-page-header__main">
      <div v-if="back || eyebrow" class="ct-page-header__kicker">
        <router-link v-if="back" :to="back.to" class="ct-page-header__back">
          <ArrowLeft :size="14" :stroke-width="1.5" />
          <span>{{ back.label }}</span>
        </router-link>
        <span v-if="back && eyebrow" class="ct-page-header__kicker-sep" aria-hidden="true">/</span>
        <p v-if="eyebrow" class="ct-page-header__eyebrow ct-eyebrow">{{ eyebrow }}</p>
      </div>

      <h1 class="ct-page-header__title">{{ title }}</h1>
      <p v-if="description" class="ct-page-header__desc">{{ description }}</p>

      <div v-if="$slots.meta" class="ct-page-header__meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.actions" class="ct-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.ct-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--ct-border);
}

.ct-page-header__main {
  min-width: 0;
}

.ct-page-header__kicker {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.ct-page-header__eyebrow {
  margin: 0;
}

.ct-page-header__kicker-sep {
  font-family: var(--ct-font-mono);
  font-size: 11px;
  color: var(--ct-border-strong);
}

.ct-page-header__back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  color: var(--ct-text-secondary);
  transition: var(--ct-transition);
}

.ct-page-header__back:hover {
  color: var(--ct-accent);
}

.ct-page-header__title {
  font-family: var(--ct-font-serif);
  font-size: clamp(24px, 3vw, 30px);
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: -0.015em;
  color: var(--ct-text-primary);
}

:global(.ct-admin-content) .ct-page-header__title {
  font-family: var(--ct-font-sans);
  font-size: 22px;
}

.ct-page-header__desc {
  margin-top: 8px;
  max-width: 620px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.ct-page-header__meta {
  margin-top: 10px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.ct-page-header__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}
</style>
