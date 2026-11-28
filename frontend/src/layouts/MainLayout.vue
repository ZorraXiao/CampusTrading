<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { num: '01', label: '二手交易', path: '/products' },
  { num: '02', label: '失物招领', path: '/lost-found' },
  { num: '03', label: '跑腿服务', path: '/errands' },
]

const currentYear = new Date().getFullYear()

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '已登录用户'
)

const avatarInitial = computed(() => displayName.value.slice(0, 1).toUpperCase())

function isNavActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}

function handleCommand(command) {
  if (command === 'logout') {
    handleLogout()
    return
  }
  router.push(command)
}
</script>

<template>
  <div class="ct-main-layout">
    <header class="ct-header">
      <div class="ct-container ct-header__inner">
        <div class="ct-header__left">
          <router-link to="/" class="ct-header__brand">
            <span class="ct-header__mark" aria-hidden="true">CAMPUS_</span>
            <span class="ct-header__brand-divider" aria-hidden="true" />
            <span class="ct-header__brand-name">校园交易平台</span>
          </router-link>

          <nav class="ct-header__nav" aria-label="主导航">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="['ct-header__nav-link', { 'is-active': isNavActive(item.path) }]"
            >
              <span class="ct-header__nav-num ct-mono">{{ item.num }}</span>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </div>

        <div class="ct-header__actions">
          <template v-if="!authStore.isLoggedIn">
            <router-link to="/login">
              <el-button text class="ct-header__login-btn">登录</el-button>
            </router-link>
            <router-link :to="{ path: '/login', query: { mode: 'register' } }">
              <el-button type="primary" round class="ct-header__register-btn">注册账号</el-button>
            </router-link>
          </template>

          <template v-else>
            <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
              <button type="button" class="ct-header__user">
                <el-avatar
                  :size="26"
                  :src="authStore.userInfo?.avatar_url || undefined"
                  class="ct-header__avatar"
                >
                  {{ avatarInitial }}
                </el-avatar>
                <span class="ct-header__nickname">{{ displayName }}</span>
                <ChevronDown :size="14" :stroke-width="1.5" class="ct-header__caret" />
              </button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="/profile">
                    <User :size="15" :stroke-width="1.5" />
                    <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="/profile/posts">
                    <FileText :size="15" :stroke-width="1.5" />
                    <span>我的发布</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="/profile/errands">
                    <ClipboardList :size="15" :stroke-width="1.5" />
                    <span>我的接单</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="authStore.isAdmin" command="/admin">
                    <LayoutDashboard :size="15" :stroke-width="1.5" />
                    <span>后台管理</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <LogOut :size="15" :stroke-width="1.5" />
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </header>

    <main class="ct-main-layout__content">
      <div class="ct-container">
        <router-view />
      </div>
    </main>

    <footer class="ct-footer">
      <div class="ct-container ct-footer__inner">
        <span>© <span class="ct-num">{{ currentYear }}</span> 校园交易平台</span>
        <span class="ct-footer__note">面向本校师生的二手交易 · 失物招领 · 跑腿互助平台</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.ct-main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--ct-bg-canvas);
}

.ct-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--ct-header-height);
  background-color: var(--ct-header-bg);
  backdrop-filter: saturate(150%) blur(10px);
  -webkit-backdrop-filter: saturate(150%) blur(10px);
  border-bottom: 1px solid var(--ct-border);
}

.ct-header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ct-header__left {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.ct-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ct-text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.ct-header__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  font-family: var(--ct-font-mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.2;
  color: var(--ct-bg-surface);
  background-color: var(--ct-accent);
  border-radius: var(--ct-radius-xs);
  transition: var(--ct-transition);
}

.ct-header__brand:hover .ct-header__mark {
  background-color: var(--ct-accent-hover);
}

.ct-header__brand-divider {
  width: 1px;
  height: 16px;
  background-color: var(--ct-border-strong);
  flex-shrink: 0;
}

.ct-header__brand-name {
  font-family: var(--ct-font-serif);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--ct-text-primary);
}

.ct-header__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.ct-header__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: var(--ct-font-size-base);
  font-weight: 500;
  color: var(--ct-text-secondary);
  border: 1px solid transparent;
  border-radius: var(--ct-radius-round);
  transition: var(--ct-transition);
  white-space: nowrap;
}

.ct-header__nav-num {
  font-size: 10.5px;
  color: var(--ct-text-tertiary);
  letter-spacing: 0.04em;
  transition: var(--ct-transition);
}

.ct-header__nav-link:hover {
  color: var(--ct-text-primary);
  background-color: var(--ct-bg-subtle);
}

.ct-header__nav-link.is-active {
  color: var(--ct-text-primary);
  background-color: var(--ct-bg-subtle);
  border-color: var(--ct-border);
}

.ct-header__nav-link.is-active .ct-header__nav-num {
  color: var(--ct-accent);
}

.ct-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

.ct-header__login-btn {
  color: var(--ct-text-secondary);
}

.ct-header__login-btn:hover {
  color: var(--ct-text-primary);
  background-color: var(--ct-bg-subtle);
}

.ct-header__register-btn {
  padding-left: 16px;
  padding-right: 16px;
}

.ct-header__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px 0 4px;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-round);
  background-color: var(--ct-bg-surface);
  color: var(--ct-text-primary);
  cursor: pointer;
  transition: var(--ct-transition);
}

.ct-header__user:hover {
  border-color: var(--ct-border-strong);
  background-color: var(--ct-bg-subtle);
}

.ct-header__avatar {
  background-color: var(--ct-bg-elevated);
  color: var(--ct-accent);
  font-size: var(--ct-font-size-xs);
  font-weight: 600;
}

.ct-header__nickname {
  max-width: 112px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
}

.ct-header__caret {
  color: var(--ct-text-tertiary);
}

.ct-main-layout__content {
  flex: 1;
  padding: 44px 0 88px;
}

.ct-footer {
  border-top: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
  padding: 22px 0;
}

.ct-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 16px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

@media (max-width: 768px) {
  .ct-header__left {
    gap: 12px;
  }

  .ct-header__brand-divider,
  .ct-header__brand-name,
  .ct-header__nav-num,
  .ct-header__nickname,
  .ct-footer__note {
    display: none;
  }

  .ct-header__nav {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .ct-header__nav::-webkit-scrollbar {
    display: none;
  }

  .ct-main-layout__content {
    padding: 32px 0 64px;
  }
}
</style>
