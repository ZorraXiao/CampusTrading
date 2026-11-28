<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChevronRight, ClipboardList, FileText, LogOut, PenLine } from 'lucide-vue-next'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '校园用户'
)

const username = computed(() => authStore.userInfo?.username || '--')

const phone = computed(() => authStore.userInfo?.phone || '未设置')

const initial = computed(() => displayName.value.slice(0, 1).toUpperCase())

const entries = [
  {
    to: '/profile/posts',
    title: '我的发布',
    desc: '管理你发布的商品、失物与跑腿信息',
    icon: FileText,
  },
  {
    to: '/profile/errands',
    title: '我的接单任务',
    desc: '查看你接取的跑腿任务进度',
    icon: ClipboardList,
  },
]

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="ct-page profile-page">
    <PageHeader
      eyebrow="个人中心"
      title="我的账号"
      description="管理你的资料，查看发布与接单记录。"
    />

    <section class="ct-panel profile-panel">
      <EditorialIllustration scene="stamp" :size="88" class="profile-panel__stamp" />
      <div class="ct-panel__body profile-card">
        <div class="profile-card__user">
          <el-avatar
            :size="48"
            :src="authStore.userInfo?.avatar_url || undefined"
            class="profile-avatar"
          >
            {{ initial }}
          </el-avatar>
          <div class="profile-card__meta">
            <p class="profile-card__name">{{ displayName }}</p>
            <p class="profile-card__username ct-mono">@{{ username }}</p>
          </div>
        </div>

        <!-- TODO(阶段3)：接入资料编辑弹窗与更新接口 -->
        <el-button disabled class="profile-edit-btn">
          <PenLine :size="14" :stroke-width="1.5" />
          <span>编辑资料</span>
        </el-button>
      </div>

      <div class="ct-panel__footer profile-details">
        <div class="ct-kv">
          <div class="ct-kv__row">
            <span class="ct-kv__label">手机号</span>
            <span class="ct-kv__value ct-num">{{ phone }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ct-panel profile-nav-panel">
      <router-link
        v-for="item in entries"
        :key="item.to"
        :to="item.to"
        class="profile-nav-row"
      >
        <div class="profile-nav-row__left">
          <span class="profile-nav-row__icon" aria-hidden="true">
            <component :is="item.icon" :size="16" :stroke-width="1.5" />
          </span>
          <div>
            <p class="profile-nav-row__title">{{ item.title }}</p>
            <p class="profile-nav-row__desc">{{ item.desc }}</p>
          </div>
        </div>
        <ChevronRight :size="16" :stroke-width="1.5" class="profile-nav-row__arrow" />
      </router-link>
    </section>

    <div class="profile-logout">
      <el-button class="profile-logout-btn" @click="handleLogout">
        <LogOut :size="14" :stroke-width="1.5" />
        <span>退出登录</span>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 760px;
  margin: 0 auto;
}

.profile-panel {
  position: relative;
  overflow: hidden;
}

.profile-panel__stamp {
  position: absolute;
  top: -14px;
  right: 120px;
  opacity: 0.16;
  pointer-events: none;
  transform: rotate(-10deg);
}

.profile-card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.profile-card__user {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar {
  background-color: var(--ct-bg-elevated);
  border: 1px solid var(--ct-border);
  color: var(--ct-accent);
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
}

.profile-card__name {
  font-family: var(--ct-font-serif);
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.profile-card__username {
  margin-top: 2px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

:deep(.profile-edit-btn > span),
:deep(.profile-logout-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-details {
  padding-top: 4px;
  padding-bottom: 4px;
  border-top: 1px dashed var(--ct-border-dashed);
}

.profile-nav-panel {
  overflow: hidden;
}

.profile-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.profile-nav-row:last-child {
  border-bottom: none;
}

.profile-nav-row:hover {
  background-color: var(--ct-bg-canvas);
}

.profile-nav-row__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-nav-row__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  color: var(--ct-text-secondary);
}

.profile-nav-row__title {
  font-size: var(--ct-font-size-base);
  font-weight: 500;
  color: var(--ct-text-primary);
}

.profile-nav-row__desc {
  margin-top: 2px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.profile-nav-row__arrow {
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.profile-nav-row:hover .profile-nav-row__arrow {
  color: var(--ct-text-primary);
  transform: translateX(2px);
}

.profile-logout {
  display: flex;
  justify-content: flex-start;
}

.profile-logout-btn:hover {
  color: var(--ct-danger);
  border-color: var(--ct-danger);
}
</style>
