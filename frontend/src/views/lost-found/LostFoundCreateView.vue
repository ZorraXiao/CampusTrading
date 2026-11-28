<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createLostFoundItem } from '@/api/lostFound'
import ImageUploadField from '@/components/ImageUploadField.vue'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  item_type: 'lost',
  item_name: '',
  location: '',
  contact_info: '',
  description: '',
  image_url: '',
})

const isLost = computed(() => form.item_type === 'lost')
const locationLabel = computed(() => (isLost.value ? '丢失地点' : '拾取地点'))
const descriptionPlaceholder = computed(() =>
  isLost.value
    ? '请描述物品特征、丢失时间与大致经过，便于拾到者核对'
    : '请描述物品特征、拾取时间与位置，便于失主核对认领'
)

const rules = {
  item_type: [{ required: true, message: '请选择信息类型', trigger: 'change' }],
  item_name: [
    { required: true, message: '请输入物品名称', trigger: 'blur' },
    { max: 64, message: '物品名称不超过 64 个字符', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请输入地点', trigger: 'blur' },
    { max: 100, message: '地点不超过 100 个字符', trigger: 'blur' },
  ],
  contact_info: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { max: 100, message: '联系方式不超过 100 个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请填写详细描述', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const created = await createLostFoundItem({
      item_type: form.item_type,
      item_name: form.item_name.trim(),
      location: form.location.trim(),
      contact_info: form.contact_info.trim(),
      description: form.description.trim(),
      image_url: form.image_url || null,
    })
    ElMessage.success('发布成功')
    router.replace(`/lost-found/${created.id}`)
  } catch (err) {
    ElMessage.error(err?.message || '发布失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="ct-page create-page">
    <PageHeader
      :back="{ to: '/lost-found', label: '信息大厅' }"
      title="发布失物 / 寻物"
      description="登记丢失或拾到的物品，写清时间与地点，提高找回效率。"
    />

    <section class="ct-panel">
      <div class="ct-panel__body">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          require-asterisk-position="right"
          class="create-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="信息类型" prop="item_type">
            <el-radio-group v-model="form.item_type">
              <el-radio-button value="lost">寻物启事</el-radio-button>
              <el-radio-button value="found">拾物招领</el-radio-button>
            </el-radio-group>
            <p class="create-form__hint">
              {{ isLost ? '物品丢失，发布启事寻找失物' : '拾到物品，发布招领等待失主认领' }}
            </p>
          </el-form-item>

          <el-form-item label="物品名称" prop="item_name">
            <el-input
              v-model="form.item_name"
              placeholder="如：黑色不锈钢保温杯"
              maxlength="64"
              show-word-limit
            />
          </el-form-item>

          <el-form-item :label="locationLabel" prop="location">
            <el-input
              v-model="form.location"
              placeholder="校内具体教学楼、食堂或路段"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="联系方式" prop="contact_info">
            <el-input
              v-model="form.contact_info"
              placeholder="手机号或微信，便于对方联系核实"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="详细描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              :placeholder="descriptionPlaceholder"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="物品图片" prop="image_url">
            <ImageUploadField v-model="form.image_url" />
          </el-form-item>

          <div class="create-form__actions">
            <router-link to="/lost-found">
              <el-button>取消</el-button>
            </router-link>
            <el-button type="primary" native-type="submit" :loading="submitting">
              发布信息
            </el-button>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.create-page {
  max-width: 760px;
  margin: 0 auto;
}

.create-form__hint {
  margin: 6px 0 0;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.create-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
