<script setup>
import { ImagePlus, X } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function handleFile(event) {
  const file = event.target.files && event.target.files[0]
  event.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result)
  reader.readAsDataURL(file)
}

function handleRemove() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="image-upload">
    <label class="image-upload__box">
      <input
        type="file"
        accept="image/*"
        class="image-upload__input"
        @change="handleFile"
      />
      <img v-if="modelValue" :src="modelValue" alt="物品图片预览" class="image-upload__preview" />
      <span v-else class="image-upload__placeholder">
        <ImagePlus :size="20" :stroke-width="1.5" />
        <span>上传物品图片</span>
      </span>
    </label>

    <button v-if="modelValue" type="button" class="image-upload__remove" @click="handleRemove">
      <X :size="13" :stroke-width="1.5" />
      <span>移除图片</span>
    </button>

    <p class="image-upload__hint">选填，不上传将展示「暂无图像」占位</p>
  </div>
</template>

<style scoped>
.image-upload__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 132px;
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  cursor: pointer;
  overflow: hidden;
  transition: var(--ct-transition);
}

.image-upload__box:hover {
  border-color: var(--ct-accent);
  background-color: var(--ct-bg-subtle);
}

.image-upload__input {
  display: none;
}

.image-upload__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-upload__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.image-upload__remove {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-danger);
  cursor: pointer;
}

.image-upload__remove:hover {
  color: var(--ct-accent-hover);
}

.image-upload__hint {
  margin-top: 8px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}
</style>
