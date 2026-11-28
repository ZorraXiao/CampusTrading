<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Bike,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingBag,
  Users,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuGroups = [
  {
    label: '',
    items: [
      { label: '用户管理', path: '/admin/users', icon: Users },
    ],
  },
  {
    label: '内容管理',
    items: [
      { label: '商品管理', path: '/admin/products', icon: ShoppingBag },
      { label: '失物管理', path: '/admin/lost-found', icon: PackageSearch },
      { label: '跑腿管理', path: '/admin/errands', icon: Bike },
    ],
  },
]

const pageTitle = computed(() => route.meta?.title || '后台管理')
const adminName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '管理员'
)
const adminInitial = computed(() => adminName.value.slice(0, 1).toUpperCase())

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="ct-admin-layout">
    <aside class="ct-admin-sidebar">
      <div class="ct-admin-sidebar__brand">
        <span class="ct-admin-sidebar__logo" aria-hidden="true">
          <LayoutDashboard :size="15" :stroke-width="1.5" />
        </span>
        <div class="ct-admin-sidebar__brand-text">
          <span class="ct-admin-sidebar__title">管理控制台</span>
          <span class="ct-admin-sidebar__sub">校园交易平台</span>
        </div>
      </div>

      <nav class="ct-admin-nav" aria-label="后台管理菜单">
        <div v-for="(group, idx) in menuGroups" :key="idx" class="ct-admin-nav__group">
          <p v-if="group.label" class="ct-admin-nav__group-label">{{ group.label }}</p>
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            :title="item.label"
            :class="['ct-admin-nav__item', { 'is-active': isActive(item.path) }]"
          >
            <component :is="item.icon" :size="16" :stroke-width="1.5" class="ct-admin-nav__icon" />
            <span class="ct-admin-nav__label">{{ item.label }}</span>
          </router-link>
        </div>
      </nav>

      <div class="ct-admin-sidebar__user">
        <el-avatar
          :size="28"
          :src="authStore.userInfo?.avatar_url || undefined"
          class="ct-admin-sidebar__avatar"
        >
          {{ adminInitial }}
        </el-avatar>
        <div class="ct-admin-sidebar__user-meta">
          <span class="ct-admin-sidebar__user-name">{{ adminName }}</span>
          <span class="ct-admin-sidebar__user-role">管理员</span>
        </div>
      </div>
    </aside>

    <div class="ct-admin-main">
      <header class="ct-admin-header">
        <div class="ct-admin-header__breadcrumb">
          <span class="ct-admin-header__root">后台管理</span>
          <span class="ct-admin-header__sep" aria-hidden="true">/</span>
          <span class="ct-admin-header__current">{{ pageTitle }}</span>
        </div>

        <div class="ct-admin-header__right">
          <router-link to="/">
            <el-button size="small" class="ct-admin-header__btn">
              <ArrowLeft :size="14" :stroke-width="1.5" />
              <span>返回前台</span>
            </el-button>
          </router-link>
          <el-button size="small" text class="ct-admin-header__btn" @click="handleLogout">
            <LogOut :size="14" :stroke-width="1.5" />
            <span>退出登录</span>
          </el-button>
        </div>
      </header>

      <main class="ct-admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.ct-admin-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--ct-bg-canvas);
}

.ct-admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  background-color: var(--ct-bg-subtle);
  border-right: 1px solid var(--ct-border);
  display: flex;
  flex-direction: column;
}

.ct-admin-sidebar__brand {
  height: var(--ct-header-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--ct-border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.ct-admin-sidebar__logo {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: 7px;
  color: var(--ct-accent);
  flex-shrink: 0;
}

.ct-admin-sidebar__brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ct-admin-sidebar__title {
  font-size: var(--ct-font-size-base);
  font-weight: 600;
  line-height: 1.2;
  color: var(--ct-text-primary);
}

.ct-admin-sidebar__sub {
  font-size: var(--ct-font-size-xs);
  line-height: 1.2;
  color: var(--ct-text-tertiary);
}

.ct-admin-nav {
  flex: 1;
  padding: 12px 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ct-admin-nav__group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ct-admin-nav__group-label {
  padding: 14px 10px 6px;
  font-family: var(--ct-font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--ct-text-tertiary);
}

.ct-admin-nav__item {
  height: 34px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--ct-radius-sm);
  border: 1px solid transparent;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
  transition: var(--ct-transition);
  white-space: nowrap;
}

.ct-admin-nav__item:hover {
  background-color: rgba(255, 254, 251, 0.7);
  color: var(--ct-text-primary);
}

.ct-admin-nav__item.is-active {
  background-color: var(--ct-bg-surface);
  border-color: var(--ct-border);
  color: var(--ct-text-primary);
  font-weight: 500;
}

.ct-admin-nav__icon {
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.ct-admin-nav__item.is-active .ct-admin-nav__icon {
  color: var(--ct-accent);
}

.ct-admin-sidebar__user {
  margin-top: auto;
  padding: 12px 16px;
  border-top: 1px solid var(--ct-border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.ct-admin-sidebar__avatar {
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  color: var(--ct-accent);
  font-size: var(--ct-font-size-xs);
  font-weight: 600;
  flex-shrink: 0;
}

.ct-admin-sidebar__user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ct-admin-sidebar__user-name {
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ct-admin-sidebar__user-role {
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.ct-admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--ct-bg-canvas);
}

.ct-admin-header {
  height: var(--ct-header-height);
  padding: 0 32px;
  background-color: var(--ct-bg-surface);
  border-bottom: 1px solid var(--ct-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ct-admin-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--ct-font-size-sm);
}

.ct-admin-header__root {
  color: var(--ct-text-tertiary);
}

.ct-admin-header__sep {
  color: var(--ct-border-strong);
}

.ct-admin-header__current {
  font-weight: 500;
  color: var(--ct-text-primary);
}

.ct-admin-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ct-admin-header__btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ct-admin-content {
  flex: 1;
  padding: 28px 32px 40px;
  background-color: var(--ct-bg-canvas);
}

@media (max-width: 900px) {
  .ct-admin-sidebar {
    width: 64px;
  }

  .ct-admin-sidebar__brand {
    justify-content: center;
    padding: 0 8px;
  }

  .ct-admin-sidebar__user {
    justify-content: center;
    padding: 12px 8px;
  }

  .ct-admin-sidebar__brand-text,
  .ct-admin-nav__group-label,
  .ct-admin-nav__label,
  .ct-admin-sidebar__user-meta {
    display: none;
  }

  .ct-admin-nav__item {
    justify-content: center;
    padding: 0;
  }

  .ct-admin-header,
  .ct-admin-content {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
