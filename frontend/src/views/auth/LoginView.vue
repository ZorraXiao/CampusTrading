<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from 'lucide-vue-next'
import EditorialIllustration from '@/components/EditorialIllustration.vue'

const route = useRoute()

const mode = ref(route.query.mode === 'register' ? 'register' : 'login')
const isLogin = computed(() => mode.value === 'login')

watch(
  () => route.query.mode,
  (val) => {
    mode.value = val === 'register' ? 'register' : 'login'
  }
)

const loginFormRef = ref(null)
const registerFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const loginRules = {
  username: [
    { required: true, message: '请输入学号或用户名', trigger: 'blur' },
    { min: 3, max: 32, message: '长度需在 3 至 32 个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 64, message: '密码长度需在 6 至 64 个字符之间', trigger: 'blur' },
  ],
}

const registerRules = {
  username: loginRules.username,
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称不超过 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的 11 位手机号',
      trigger: 'blur',
    },
  ],
  password: loginRules.password,
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

function switchMode(nextMode) {
  mode.value = nextMode
  loginFormRef.value?.clearValidate()
  registerFormRef.value?.clearValidate()
}

async function handleSubmit() {
  const formRef = isLogin.value ? loginFormRef.value : registerFormRef.value
  if (!formRef) return

  const valid = await formRef.validate().catch(() => false)
  if (!valid) return

  // TODO(阶段3)：接入认证接口，成功后调用 authStore.setAuth 并按 route.query.redirect 回跳
  ElMessage.info('校园账号服务即将开放，请稍后再试')
}
</script>

<template>
  <div class="auth-page">
    <header class="auth-topbar">
      <router-link to="/" class="auth-brand">
        <span class="auth-brand__mark" aria-hidden="true">CAMPUS_</span>
        <span class="auth-brand__divider" aria-hidden="true" />
        <span class="auth-brand__name">校园交易平台</span>
      </router-link>
    </header>

    <main class="auth-main">
      <section class="auth-card">
        <div class="auth-pass-head">
          <div class="auth-pass-head__meta">
            <span class="auth-pass-label">校园通行证</span>
            <span class="auth-pass-mode">{{ isLogin ? '账号登录' : '新用户注册' }}</span>
          </div>
          <EditorialIllustration scene="stamp" :size="58" class="auth-pass-stamp" />
          <span class="auth-pass-notch auth-pass-notch--left" aria-hidden="true" />
          <span class="auth-pass-notch auth-pass-notch--right" aria-hidden="true" />
        </div>

        <div class="auth-card__body">
          <div class="auth-tabs" role="tablist" aria-label="账号操作切换">
            <button
              type="button"
              role="tab"
              :aria-selected="isLogin"
              :class="['auth-tab', { 'is-active': isLogin }]"
              @click="switchMode('login')"
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="!isLogin"
              :class="['auth-tab', { 'is-active': !isLogin }]"
              @click="switchMode('register')"
            >
              注册
            </button>
          </div>

          <h1 class="auth-title">{{ isLogin ? '登录校园账号' : '注册校园账号' }}</h1>
          <p class="auth-subtitle">
            {{
              isLogin
                ? '使用学号或用户名登录，与同校师生安全交易'
                : '注册后即可发布闲置、登记失物和发起跑腿'
            }}
          </p>

          <p v-if="route.query.redirect" class="auth-redirect-hint">
            登录后将返回你刚才访问的页面
          </p>

          <el-form
            v-if="isLogin"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            size="large"
            require-asterisk-position="right"
            class="auth-form"
            @submit.prevent="handleSubmit"
          >
            <el-form-item label="学号 / 用户名" prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入学号或用户名"
                autocomplete="username"
                maxlength="32"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                show-password
                placeholder="请输入密码"
                autocomplete="current-password"
                maxlength="64"
              />
            </el-form-item>

            <el-button type="primary" round native-type="submit" class="auth-submit">
              登录
            </el-button>
          </el-form>

          <el-form
            v-else
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="top"
            size="large"
            require-asterisk-position="right"
            class="auth-form"
            @submit.prevent="handleSubmit"
          >
            <el-form-item label="学号 / 用户名" prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="3-32 位学号或用户名"
                autocomplete="username"
                maxlength="32"
              />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="显示给同校师生的昵称"
                maxlength="20"
              />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="用于线下交易或失物核实联系"
                autocomplete="tel"
                maxlength="20"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                show-password
                placeholder="至少 6 位字符"
                autocomplete="new-password"
                maxlength="64"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入密码"
                autocomplete="new-password"
                maxlength="64"
              />
            </el-form-item>

            <el-button type="primary" round native-type="submit" class="auth-submit">
              注册
            </el-button>
          </el-form>

          <p class="auth-terms">登录即表示你同意遵守平台交易规范与校园管理规定。</p>
        </div>

        <div class="auth-pass-stub" aria-hidden="true">
          <EditorialIllustration scene="barcode" :size="136" />
          <span class="auth-pass-serial ct-num">2026 · 校园交易平台</span>
        </div>
      </section>
    </main>

    <footer class="auth-footer">
      <router-link to="/" class="auth-back">
        <ArrowLeft :size="14" :stroke-width="1.5" />
        <span>返回首页</span>
      </router-link>
    </footer>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--ct-bg-canvas);
}

.auth-topbar {
  padding: 20px 32px;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ct-text-primary);
}

.auth-brand__mark {
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

.auth-brand:hover .auth-brand__mark {
  background-color: var(--ct-accent-hover);
}

.auth-brand__divider {
  width: 1px;
  height: 16px;
  background-color: var(--ct-border-strong);
}

.auth-brand__name {
  font-family: var(--ct-font-serif);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--ct-text-primary);
}

.auth-main {
  padding: 16px 24px;
  display: flex;
  justify-content: center;
}

.auth-card {
  position: relative;
  width: min(420px, 100%);
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-lg);
}

.auth-pass-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 28px;
  background-color: var(--ct-bg-subtle);
  border-bottom: 1px dashed var(--ct-border-dashed);
  border-top-left-radius: calc(var(--ct-radius-lg) - 1px);
  border-top-right-radius: calc(var(--ct-radius-lg) - 1px);
}

.auth-pass-head__meta {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.auth-pass-label {
  font-size: var(--ct-font-size-xs);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.auth-pass-mode {
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.auth-pass-stamp {
  position: absolute;
  top: -12px;
  right: 12px;
  opacity: 0.16;
  pointer-events: none;
  transform: rotate(12deg);
}

.auth-pass-notch {
  position: absolute;
  bottom: -9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--ct-bg-canvas);
  border: 1px solid var(--ct-border);
  z-index: 2;
}

.auth-pass-notch--left {
  left: -9px;
  clip-path: inset(0 0 0 8px);
}

.auth-pass-notch--right {
  right: -9px;
  clip-path: inset(0 8px 0 0);
}

.auth-pass-stub {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 28px;
  background-color: var(--ct-bg-subtle);
  border-top: 1px dashed var(--ct-border-dashed);
  border-bottom-left-radius: calc(var(--ct-radius-lg) - 1px);
  border-bottom-right-radius: calc(var(--ct-radius-lg) - 1px);
}

.auth-pass-serial {
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.auth-card__body {
  padding: 26px 32px 30px;
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 3px;
  background-color: var(--ct-bg-subtle);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
}

.auth-tab {
  height: 32px;
  border: 1px solid transparent;
  border-radius: var(--ct-radius-sm);
  background: transparent;
  font-family: inherit;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-secondary);
  cursor: pointer;
  transition: var(--ct-transition);
}

.auth-tab:hover:not(.is-active) {
  color: var(--ct-text-primary);
}

.auth-tab.is-active {
  background-color: var(--ct-bg-surface);
  border-color: var(--ct-border);
  color: var(--ct-text-primary);
}

.auth-title {
  margin-top: 22px;
  font-family: var(--ct-font-serif);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.auth-subtitle {
  margin-top: 6px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.auth-redirect-hint {
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid #DFD3C5;
  border-radius: var(--ct-radius-sm);
  background-color: var(--ct-accent-soft);
  font-size: var(--ct-font-size-xs);
  color: var(--ct-accent);
}

.auth-form {
  margin-top: 22px;
}

.auth-submit {
  width: 100%;
  margin-top: 6px;
}

.auth-terms {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed var(--ct-border-dashed);
  text-align: center;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.auth-footer {
  padding: 20px 32px 28px;
  display: flex;
  justify-content: center;
}

.auth-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.auth-back:hover {
  color: var(--ct-accent);
}

@media (max-width: 480px) {
  .auth-topbar {
    padding: 16px 20px;
  }

  .auth-pass-head,
  .auth-pass-stub {
    padding: 12px 20px;
  }

  .auth-card__body {
    padding: 22px 20px 24px;
  }
}
</style>
