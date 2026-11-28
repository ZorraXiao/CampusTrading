<script setup>
import { useRoute } from 'vue-router'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
</script>

<template>
  <div class="ct-page detail-page">
    <PageHeader
      :back="{ to: '/products', label: '商品大厅' }"
      title="商品详情"
      description="查看商品信息并与卖家沟通交易细节。"
    >
      <template #meta>
        <span class="ct-mono">编号 #{{ route.params.id }}</span>
      </template>
    </PageHeader>

    <section class="ct-panel ct-panel--dashed">
      <div class="ct-panel__body">
        <div class="detail-grid">
          <div class="detail-media" aria-hidden="true">
            <span class="detail-media__corner detail-media__corner--tl" />
            <span class="detail-media__corner detail-media__corner--tr" />
            <span class="detail-media__corner detail-media__corner--bl" />
            <span class="detail-media__corner detail-media__corner--br" />
            <EditorialIllustration scene="books" :size="148" />
            <span>商品实拍图展示区</span>
          </div>

          <div class="ct-kv">
            <div class="ct-kv__row">
              <span class="ct-kv__label">价格</span>
              <span class="ct-kv__value ct-mono">¥ --.--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">状态</span>
              <span class="ct-kv__value">
                <StatusTag type="product" status="on_sale" size="small" />
              </span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布者</span>
              <span class="ct-kv__value">--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布时间</span>
              <span class="ct-kv__value ct-num">--</span>
            </div>
          </div>
        </div>
      </div>

      <div class="ct-panel__footer detail-actions">
        <router-link to="/products">
          <el-button>返回商品大厅</el-button>
        </router-link>
        <router-link to="/products/create">
          <el-button>发布商品</el-button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 760px;
  margin: 0 auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.detail-media {
  position: relative;
  aspect-ratio: 4 / 3;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--ct-bg-canvas);
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
  color: var(--ct-text-tertiary);
  font-size: var(--ct-font-size-xs);
}

.detail-media__corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--ct-border-strong);
  border-style: solid;
}

.detail-media__corner--tl {
  top: 8px;
  left: 8px;
  border-width: 1.5px 0 0 1.5px;
}

.detail-media__corner--tr {
  top: 8px;
  right: 8px;
  border-width: 1.5px 1.5px 0 0;
}

.detail-media__corner--bl {
  bottom: 8px;
  left: 8px;
  border-width: 0 0 1.5px 1.5px;
}

.detail-media__corner--br {
  bottom: 8px;
  right: 8px;
  border-width: 0 1.5px 1.5px 0;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
