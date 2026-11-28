<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <main class="not-found">
    <div class="not-found__folio">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">页面不存在</h1>
      <p class="not-found__desc">
        你访问的地址 <code>{{ route.fullPath }}</code> 不存在或已被移除。
      </p>
      <div class="not-found__actions">
        <router-link to="/">
          <el-button type="primary" round>返回首页</el-button>
        </router-link>
        <el-button round @click="router.back()">返回上一页</el-button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ct-bg-canvas);
}

.not-found__folio {
  width: min(480px, 100%);
  padding: 40px 32px;
  text-align: center;
  background-color: var(--ct-bg-surface);
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-lg);
}

.not-found__code {
  margin-top: 0;
  font-family: var(--ct-font-display);
  font-style: italic;
  font-size: 76px;
  line-height: 1;
  color: var(--ct-accent);
}

.not-found__title {
  margin-top: 12px;
  font-family: var(--ct-font-serif);
  font-size: var(--ct-font-size-2xl);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.not-found__desc {
  margin-top: 10px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.not-found__actions {
  margin-top: 26px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
</style>
