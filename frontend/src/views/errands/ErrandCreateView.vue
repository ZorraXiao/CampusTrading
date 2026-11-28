<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createErrand } from '@/api/errand'
import ImageUploadField from '@/components/ImageUploadField.vue'
import PageHeader from '@/components/PageHeader.vue'
import { yuanToCents } from '@/utils/format'

const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  start_location: '',
  end_location: '',
  fee: '',
  item_desc: '',
  contact_info: '',
  image_url: '',
})

function validateFee(_rule, value, callback) {
  if (value === '' || value === null || value === undefined) {
    callback(new Error('请输入跑腿酬劳'))
    return
  }
  const cents = yuanToCents(String(value).trim())
  if (Number.isNaN(cents) || cents <= 0) {
    callback(new Error('请输入大于 0 的有效金额'))
    return
  }
  callback()
}

const rules = {
  start_location: [
    { required: true, message: '请输入取件起点', trigger: 'blur' },
    { max: 100, message: '地点不超过 100 个字符', trigger: 'blur' },
  ],
  end_location: [
    { required: true, message: '请输入送达终点', trigger: 'blur' },
    { max: 100, message: '地点不超过 100 个字符', trigger: 'blur' },
  ],
  fee: [{ required: true, validator: validateFee, trigger: 'blur' }],
  item_desc: [{ required: true, message: '请填写任务说明', trigger: 'blur' }],
  contact_info: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { max: 100, message: '联系方式不超过 100 个字符', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const created = await createErrand({
      start_location: form.start_location.trim(),
      end_location: form.end_location.trim(),
      fee_cents: yuanToCents(String(form.fee).trim()),
      item_desc: form.item_desc.trim(),
      contact_info: form.contact_info.trim(),
      image_url: form.image_url || null,
    })
    ElMessage.success('发布成功')
    router.replace(`/errands/${created.id}`)
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
      :back="{ to: '/errands', label: '任务大厅' }"
      title="发布跑腿"
      description="说明取送地点、时间与酬劳，顺路的同学会尽快接单。"
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
          <el-form-item label="取件起点" prop="start_location">
            <el-input
              v-model="form.start_location"
              placeholder="如：北门菜鸟驿站"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="送达终点" prop="end_location">
            <el-input
              v-model="form.end_location"
              placeholder="如：梅园 5 栋楼下"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="跑腿酬劳（元）" prop="fee">
            <el-input
              v-model="form.fee"
              placeholder="如：5.00"
              maxlength="10"
              class="create-form__fee"
            >
              <template #prepend>¥</template>
            </el-input>
          </el-form-item>

          <el-form-item label="任务说明" prop="item_desc">
            <el-input
              v-model="form.item_desc"
              type="textarea"
              :rows="4"
              placeholder="描述需要代取、代送的物品及交付要求"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="联系方式" prop="contact_info">
            <el-input
              v-model="form.contact_info"
              placeholder="手机号或微信，便于接单同学联系"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="物品图片" prop="image_url">
            <ImageUploadField v-model="form.image_url" />
          </el-form-item>

          <div class="create-form__actions">
            <router-link to="/errands">
              <el-button>取消</el-button>
            </router-link>
            <el-button type="primary" native-type="submit" :loading="submitting">
              发布跑腿
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

.create-form__fee {
  max-width: 240px;
}

.create-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
