<script setup>
import { ArrowRight, ArrowUpRight, Bike, FileText, MapPin, PackageSearch, Plus, ShoppingBag } from 'lucide-vue-next'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import StatusTag from '@/components/StatusTag.vue'

const previewRows = [
  { id: 1, status: 'on_sale', widthMain: '64%', widthSub: '38%', tint: '#EFE7DD' },
  { id: 2, status: null, widthMain: '52%', widthSub: '32%', tint: '#DCE8E1' },
  { id: 3, status: 'off_shelf', widthMain: '58%', widthSub: '42%', tint: '#F7F0E4' },
]

const flowSteps = [
  { num: '01', title: '发布信息', desc: '描述清楚物品或需求' },
  { num: '02', title: '线下联系', desc: '核实细节与交付方式' },
  { num: '03', title: '校内交付', desc: '就近面交或送达' },
  { num: '04', title: '确认完结', desc: '双方确认，信息归档' },
]

const shortcuts = [
  { label: '发布闲置', to: '/products/create', icon: Plus },
  { label: '登记失物', to: '/lost-found/create', icon: PackageSearch },
  { label: '发起跑腿', to: '/errands/create', icon: Bike },
  { label: '我的发布', to: '/profile/posts', icon: FileText },
]
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero__grid">
        <div class="home-hero__copy">
          <p class="home-hero__eyebrow">面向本校师生 · 校内闭环</p>
          <h1 class="home-hero__title">
            让闲置、失物与跑腿，<br />在校园里就近流转。
          </h1>
          <p class="home-hero__desc">
            校园交易平台连接同校师生：发布闲置好物、登记寻物招领、委托顺路跑腿，从线下联系到当面交付都在校内安心完成。
          </p>
          <div class="home-hero__actions">
            <router-link to="/products">
              <el-button type="primary" size="large" round class="home-hero__primary-btn">
                <span>浏览二手好物</span>
                <ArrowRight :size="16" :stroke-width="1.5" />
              </el-button>
            </router-link>
            <router-link to="/products/create">
              <el-button size="large" round>发布闲置</el-button>
            </router-link>
          </div>
        </div>

        <div class="home-collage" aria-hidden="true">
          <div class="collage-card collage-card--main">
            <span class="collage-tape" />
            <div class="collage-frame">
              <img
                src="/illustrations/campus-desk-books.jpg"
                alt=""
                class="collage-img is-cropped"
              />
            </div>
            <div class="collage-caption">
              <span>闲置书刊与桌面好物</span>
            </div>
          </div>

          <div class="collage-card collage-card--sub">
            <div class="collage-frame">
              <img
                src="/illustrations/campus-errand-bike.jpg"
                alt=""
                class="collage-img is-cropped-lg"
              />
            </div>
            <div class="collage-caption">
              <span>校园顺路互助</span>
            </div>
          </div>

          <EditorialIllustration scene="stamp" :size="92" class="collage-stamp" />
        </div>
      </div>
    </section>

    <section class="home-bento" aria-label="核心服务入口">
      <article class="bento-card bento-card--trade">
        <div class="bento-card__top">
          <div class="bento-card__head">
            <span class="ct-mono bento-card__num">01</span>
            <span class="bento-card__icon" aria-hidden="true">
              <ShoppingBag :size="16" :stroke-width="1.5" />
            </span>
          </div>
          <h2 class="bento-card__title bento-card__title--lg">二手交易</h2>
          <p class="bento-card__desc">教材教辅、数码外设、宿舍日常好物，同校当面验货交付更放心。</p>
        </div>

        <div class="bento-visual bento-visual--lg" aria-hidden="true">
          <img
            src="/illustrations/campus-desk-books.jpg"
            alt=""
            class="bento-visual__img is-cropped"
          />
        </div>

        <div class="bento-preview" aria-hidden="true">
          <div v-for="row in previewRows" :key="row.id" class="bento-preview__row">
            <span class="bento-preview__thumb" :style="{ backgroundColor: row.tint }" />
            <div class="bento-preview__lines">
              <span class="bento-preview__bar" :style="{ width: row.widthMain }" />
              <span class="bento-preview__bar is-sub" :style="{ width: row.widthSub }" />
            </div>
            <div class="bento-preview__meta">
              <span class="ct-mono bento-preview__price">¥ --.--</span>
              <StatusTag v-if="row.status" type="product" :status="row.status" size="small" />
            </div>
          </div>
        </div>

        <div class="bento-card__footer bento-card__footer--split">
          <router-link to="/products" class="ct-link">
            <span>进入商品大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
          <router-link to="/products/create" class="bento-card__sublink">发布商品</router-link>
        </div>
      </article>

      <article class="bento-card bento-card--lost-found">
        <div class="bento-card__top">
          <div class="bento-card__head">
            <span class="ct-mono bento-card__num">02</span>
            <span class="bento-card__icon" aria-hidden="true">
              <PackageSearch :size="16" :stroke-width="1.5" />
            </span>
          </div>
          <h2 class="bento-card__title">失物招领</h2>
          <p class="bento-card__desc">丢了校园卡、钥匙或教材先来检索，拾获物品一键登记招领。</p>
          <div class="bento-card__tags">
            <StatusTag type="lost_found" status="searching" size="small" />
            <StatusTag type="lost_found" status="unclaimed" size="small" />
          </div>
        </div>

        <div class="bento-visual" aria-hidden="true">
          <img
            src="/illustrations/campus-lost-keys.jpg"
            alt=""
            class="bento-visual__img"
          />
        </div>

        <div class="bento-card__footer bento-card__footer--split">
          <router-link to="/lost-found" class="ct-link">
            <span>查看信息大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
          <router-link to="/lost-found/create" class="bento-card__sublink">登记失物</router-link>
        </div>
      </article>

      <article class="bento-card bento-card--errands">
        <div class="bento-card__top">
          <div class="bento-card__head">
            <span class="ct-mono bento-card__num">03</span>
            <span class="bento-card__icon" aria-hidden="true">
              <Bike :size="16" :stroke-width="1.5" />
            </span>
          </div>
          <h2 class="bento-card__title">跑腿服务</h2>
          <p class="bento-card__desc">取快递、食堂带饭、代送纸质材料，顺路的同学即可接单互助。</p>
          <div class="bento-route-pill">
            <MapPin :size="13" :stroke-width="1.5" />
            <span>驿站 / 食堂 / 教学楼 → 宿舍楼下</span>
          </div>
        </div>

        <div class="bento-visual" aria-hidden="true">
          <img
            src="/illustrations/campus-errand-bike.jpg"
            alt=""
            class="bento-visual__img is-cropped-lg"
          />
        </div>

        <div class="bento-card__footer bento-card__footer--split">
          <router-link to="/errands" class="ct-link">
            <span>进入任务大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
          <router-link to="/errands/create" class="bento-card__sublink">发起跑腿</router-link>
        </div>
      </article>

      <article class="bento-card bento-card--flow">
        <div class="bento-card__section-head">
          <h3 class="bento-card__section-title">平台闭环</h3>
        </div>
        <div class="bento-flow">
          <div v-for="step in flowSteps" :key="step.num" class="bento-flow__step">
            <span class="bento-flow__num">{{ step.num }}</span>
            <p class="bento-flow__title">{{ step.title }}</p>
            <p class="bento-flow__desc">{{ step.desc }}</p>
          </div>
        </div>
      </article>

      <article class="bento-card bento-card--shortcuts">
        <div class="bento-card__section-head">
          <h3 class="bento-card__section-title">快捷入口</h3>
        </div>
        <div class="bento-shortcuts">
          <router-link
            v-for="item in shortcuts"
            :key="item.to"
            :to="item.to"
            class="bento-shortcut"
          >
            <span class="bento-shortcut__left">
              <component :is="item.icon" :size="15" :stroke-width="1.5" class="bento-shortcut__icon" />
              <span>{{ item.label }}</span>
            </span>
            <ArrowUpRight :size="14" :stroke-width="1.5" class="bento-shortcut__arrow" />
          </router-link>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

.home-hero {
  padding: 16px 0 40px;
}

.home-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: 36px;
  align-items: center;
}

.home-hero__eyebrow {
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-accent);
}

.home-hero__title {
  margin-top: 14px;
  font-family: var(--ct-font-serif);
  font-size: var(--ct-font-size-display);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ct-text-primary);
}

.home-hero__desc {
  margin-top: 18px;
  max-width: 540px;
  font-size: var(--ct-font-size-md);
  line-height: 1.7;
  color: var(--ct-text-secondary);
}

.home-hero__actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

:deep(.home-hero__primary-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 右侧刊物拍立得拼贴区 */
.home-collage {
  position: relative;
  padding: 24px 20px 44px;
  border: 1px solid var(--ct-border);
  border-radius: 16px;
  background-color: rgba(243, 237, 228, 0.55);
  background-image: radial-gradient(#D5C9B8 1px, transparent 1px);
  background-size: 14px 14px;
}

.collage-card {
  position: relative;
  background-color: var(--ct-bg-surface);
  border: 1px solid #DCD1C2;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(30, 26, 23, 0.05);
}

.collage-card--main {
  width: 82%;
  padding: 10px 10px 14px;
  transform: rotate(-1.8deg);
  z-index: 1;
}

.collage-card--sub {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 54%;
  padding: 8px 8px 11px;
  transform: rotate(2.6deg);
  z-index: 2;
}

.collage-tape {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(1.5deg);
  width: 68px;
  height: 18px;
  background-color: rgba(239, 231, 221, 0.88);
  border: 1px dashed #CBBBA6;
  border-radius: 2px;
  z-index: 3;
}

.collage-frame {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
}

.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.collage-img.is-cropped {
  transform: scale(1.08);
}

.collage-img.is-cropped-lg {
  transform: scale(1.11);
}

.collage-caption {
  margin-top: 9px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-secondary);
}

.collage-card--main .collage-caption {
  justify-content: flex-start;
  padding-left: 2px;
}

.collage-stamp {
  position: absolute;
  top: -10px;
  right: 8px;
  transform: rotate(10deg);
  z-index: 3;
  pointer-events: none;
}

.home-bento {
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto;
  gap: 16px;
}

.bento-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-lg);
  transition: var(--ct-transition);
}

.bento-card:hover {
  border-color: var(--ct-border-strong);
}

.bento-card--trade {
  grid-column: 1 / 8;
  grid-row: 1 / 3;
}

.bento-card--lost-found {
  grid-column: 8 / 13;
  grid-row: 1;
}

.bento-card--errands {
  grid-column: 8 / 13;
  grid-row: 2;
}

.bento-card--flow {
  grid-column: 1 / 9;
  grid-row: 3;
  background-color: var(--ct-bg-subtle);
}

.bento-card--shortcuts {
  grid-column: 9 / 13;
  grid-row: 3;
}

.bento-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bento-card__num {
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  color: var(--ct-text-tertiary);
}

.bento-card__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  color: var(--ct-accent);
  flex-shrink: 0;
}

.bento-card__title {
  margin-top: 14px;
  font-family: var(--ct-font-serif);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ct-text-primary);
}

.bento-card__title--lg {
  font-size: 24px;
}

.bento-card__desc {
  margin-top: 6px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.bento-card__tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bento-route-pill {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-sm);
  background-color: var(--ct-bg-canvas);
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-secondary);
}

/* 档案卡片内插画装裱框 */
.bento-visual {
  position: relative;
  height: 112px;
  overflow: hidden;
  border-radius: var(--ct-radius-md);
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
}

.bento-visual--lg {
  height: 158px;
}

.bento-visual__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.bento-visual__img.is-cropped {
  transform: scale(1.08);
}

.bento-visual__img.is-cropped-lg {
  transform: scale(1.11);
}

.bento-preview {
  padding: 14px 16px;
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.bento-preview__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 11px;
  border-bottom: 1px dashed var(--ct-border);
}

.bento-preview__row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.bento-preview__thumb {
  width: 34px;
  height: 34px;
  border-radius: var(--ct-radius-sm);
  border: 1px solid var(--ct-border);
  flex-shrink: 0;
}

.bento-preview__lines {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bento-preview__bar {
  display: block;
  height: 9px;
  border-radius: 4px;
  background-color: var(--ct-border);
}

.bento-preview__bar.is-sub {
  height: 7px;
  background-color: var(--ct-bg-subtle);
}

.bento-preview__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.bento-preview__price {
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.bento-card__footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px dashed var(--ct-border-dashed);
  display: flex;
  align-items: center;
}

.bento-card__footer--split {
  justify-content: space-between;
  gap: 12px;
}

.bento-card__sublink {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
  transition: var(--ct-transition);
}

.bento-card__sublink:hover {
  color: var(--ct-accent);
}

.bento-card__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.bento-card__section-title {
  font-family: var(--ct-font-serif);
  font-size: var(--ct-font-size-md);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.bento-flow {
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.bento-flow__step {
  padding: 4px 16px;
  border-left: 1px dashed var(--ct-border-dashed);
}

.bento-flow__step:first-child {
  padding-left: 0;
  border-left: none;
}

.bento-flow__step:last-child {
  padding-right: 0;
}

.bento-flow__num {
  display: block;
  font-family: var(--ct-font-display);
  font-style: italic;
  font-size: 22px;
  line-height: 1;
  color: var(--ct-accent);
}

.bento-flow__title {
  margin-top: 8px;
  font-size: var(--ct-font-size-base);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.bento-flow__desc {
  margin-top: 3px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-secondary);
}

.bento-shortcuts {
  display: flex;
  flex-direction: column;
}

.bento-shortcut {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px;
  margin: 0 -10px;
  border-radius: var(--ct-radius-sm);
  border-bottom: 1px dashed var(--ct-border);
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
}

.bento-shortcut:last-child {
  border-bottom: none;
}

.bento-shortcut:hover {
  background-color: var(--ct-bg-subtle);
}

.bento-shortcut__left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.bento-shortcut__icon,
.bento-shortcut__arrow {
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.bento-shortcut:hover .bento-shortcut__icon,
.bento-shortcut:hover .bento-shortcut__arrow {
  color: var(--ct-accent);
}

.bento-shortcut:hover .bento-shortcut__arrow {
  transform: translate(1px, -1px);
}

@media (max-width: 960px) {
  .home-hero__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .bento-card--trade,
  .bento-card--lost-found,
  .bento-card--errands,
  .bento-card--flow,
  .bento-card--shortcuts {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .bento-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .bento-flow__step {
    padding: 0;
    border-left: none;
  }
}

@media (max-width: 640px) {
  .home-hero {
    padding: 12px 0 28px;
  }

  .collage-card--main {
    width: 88%;
  }

  .collage-card--sub {
    width: 60%;
  }

  .bento-flow {
    grid-template-columns: 1fr;
  }
}
</style>
