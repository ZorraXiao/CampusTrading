<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  scene: {
    type: String,
    default: 'archive-empty',
    validator: (val) =>
      ['stamp', 'books', 'lost-found', 'errands', 'archive-empty', 'barcode'].includes(val),
  },
  size: {
    type: [Number, String],
    default: null,
  },
})

const uid = useId()
const stampRingId = computed(() => `ct-stamp-ring-${uid}`)

const customWidthStyle = computed(() => {
  if (!props.size) return undefined
  const value = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: value }
})

const barcodeBars = [
  { x: 2, w: 2, h: 24 },
  { x: 6, w: 1, h: 24 },
  { x: 9, w: 3, h: 24 },
  { x: 14, w: 1, h: 20 },
  { x: 17, w: 2, h: 24 },
  { x: 21, w: 4, h: 24 },
  { x: 27, w: 1, h: 20 },
  { x: 30, w: 2, h: 24 },
  { x: 34, w: 1, h: 24 },
  { x: 37, w: 3, h: 24 },
  { x: 42, w: 1, h: 20 },
  { x: 45, w: 2, h: 24 },
  { x: 49, w: 3, h: 24 },
  { x: 54, w: 1, h: 24 },
  { x: 57, w: 2, h: 20 },
  { x: 61, w: 1, h: 24 },
  { x: 64, w: 4, h: 24 },
  { x: 70, w: 1, h: 24 },
  { x: 73, w: 2, h: 20 },
  { x: 77, w: 3, h: 24 },
  { x: 82, w: 1, h: 24 },
  { x: 85, w: 2, h: 24 },
  { x: 89, w: 1, h: 20 },
  { x: 92, w: 3, h: 24 },
  { x: 97, w: 2, h: 24 },
  { x: 101, w: 1, h: 24 },
  { x: 104, w: 4, h: 24 },
  { x: 110, w: 1, h: 20 },
  { x: 113, w: 2, h: 24 },
  { x: 117, w: 1, h: 24 },
  { x: 120, w: 3, h: 24 },
  { x: 125, w: 1, h: 20 },
  { x: 128, w: 2, h: 24 },
  { x: 132, w: 3, h: 24 },
  { x: 137, w: 1, h: 24 },
  { x: 140, w: 2, h: 20 },
  { x: 144, w: 3, h: 24 },
  { x: 149, w: 1, h: 24 },
  { x: 152, w: 2, h: 24 },
  { x: 156, w: 2, h: 24 },
]
</script>

<template>
  <!-- 复古圆形邮戳印章 -->
  <svg
    v-if="scene === 'stamp'"
    class="ct-illus ct-illus--stamp"
    :style="customWidthStyle"
    viewBox="0 0 108 108"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <path :id="stampRingId" d="M 54,54 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
    </defs>
    <circle cx="54" cy="54" r="50" stroke="#4A382B" stroke-width="1.2" stroke-dasharray="3 2.5" opacity="0.7" />
    <circle cx="54" cy="54" r="44" stroke="#4A382B" stroke-width="1" opacity="0.55" />
    <circle cx="54" cy="54" r="26" stroke="#B86B63" stroke-width="1" stroke-dasharray="2 2" opacity="0.75" />
    <text
      fill="#4A382B"
      font-family="var(--ct-font-sans), sans-serif"
      font-size="8.2"
      font-weight="600"
      letter-spacing="3.5"
      opacity="0.82"
    >
      <textPath :href="`#${stampRingId}`" startOffset="2%">
        校园交易平台 · 同校实名互助 · 2026 ·
      </textPath>
    </text>
    <!-- 中心四角星徽 -->
    <path
      d="M54 37 L57.5 50.5 L71 54 L57.5 57.5 L54 71 L50.5 57.5 L37 54 L50.5 50.5 Z"
      fill="#EFE7DD"
      stroke="#4A382B"
      stroke-width="1.2"
      stroke-linejoin="round"
    />
    <circle cx="54" cy="54" r="2.6" fill="#B86B63" />
  </svg>

  <!-- 二手好物：堆叠书本、耳机、价签与绿植 -->
  <svg
    v-else-if="scene === 'books'"
    class="ct-illus ct-illus--duotone"
    :style="customWidthStyle"
    viewBox="0 0 180 128"
    fill="none"
    aria-hidden="true"
  >
    <!-- 衬底暖沙纸片 -->
    <rect x="18" y="20" width="144" height="88" rx="10" fill="#F3EDE4" opacity="0.75" />
    <circle cx="136" cy="40" r="18" fill="#DCE8E1" />
    <circle cx="54" cy="84" r="16" fill="#F2DFDC" opacity="0.85" />

    <!-- 堆叠精装书本 -->
    <rect x="34" y="82" width="76" height="16" rx="3" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <line x1="46" y1="86" x2="96" y2="86" stroke="#D5C9B8" stroke-width="1.2" />
    <rect x="40" y="64" width="66" height="18" rx="3" fill="#EFE7DD" stroke="#4A382B" stroke-width="1.4" />
    <line x1="50" y1="73" x2="88" y2="73" stroke="#4A382B" stroke-width="1.2" stroke-dasharray="3 2" />
    <rect x="46" y="48" width="54" height="16" rx="3" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <rect x="54" y="53" width="16" height="6" rx="1.5" fill="#B86B63" opacity="0.6" />

    <!-- 耳机弧线 -->
    <path
      d="M116 74 V56 A20 20 0 0 1 156 56 V74"
      stroke="#4A382B"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <rect x="111" y="70" width="9" height="18" rx="4" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <rect x="152" y="70" width="9" height="18" rx="4" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />

    <!-- 价签与细绳 -->
    <path d="M106 34 C112 26, 122 26, 126 32" stroke="#8C8279" stroke-width="1.2" stroke-dasharray="2.5 2" />
    <path
      d="M119 32 L139 32 L145 41 L139 50 L119 50 Z"
      fill="#FFFEFB"
      stroke="#4A382B"
      stroke-width="1.3"
      stroke-linejoin="round"
    />
    <circle cx="125" cy="41" r="2" fill="#B58338" />

    <!-- 小绿植枝叶 -->
    <path d="M32 62 C30 50, 34 40, 40 32" stroke="#4B7A63" stroke-width="1.3" stroke-linecap="round" />
    <path d="M34 48 C26 44, 24 38, 30 35 C34 39, 35 44, 34 48 Z" fill="#DCE8E1" stroke="#4B7A63" stroke-width="1.2" />
    <path d="M36 40 C42 36, 46 40, 41 45 C38 44, 36 42, 36 40 Z" fill="#DCE8E1" stroke="#4B7A63" stroke-width="1.2" />
  </svg>

  <!-- 失物招领：启事卡、放大镜与黄铜钥匙 -->
  <svg
    v-else-if="scene === 'lost-found'"
    class="ct-illus ct-illus--duotone"
    :style="customWidthStyle"
    viewBox="0 0 180 128"
    fill="none"
    aria-hidden="true"
  >
    <rect x="20" y="20" width="140" height="88" rx="10" fill="#F3EDE4" opacity="0.75" />
    <circle cx="128" cy="48" r="20" fill="#F7F0E4" />
    <circle cx="52" cy="80" r="15" fill="#DCE8E1" />

    <!-- 失物登记卡 -->
    <rect x="38" y="30" width="66" height="68" rx="5" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <rect x="46" y="39" width="24" height="5" rx="2" fill="#B86B63" opacity="0.65" />
    <line x1="46" y1="53" x2="94" y2="53" stroke="#D5C9B8" stroke-width="1.4" stroke-linecap="round" />
    <line x1="46" y1="62" x2="86" y2="62" stroke="#D5C9B8" stroke-width="1.4" stroke-linecap="round" />
    <line x1="46" y1="71" x2="78" y2="71" stroke="#D5C9B8" stroke-width="1.4" stroke-linecap="round" />
    <line x1="46" y1="84" x2="94" y2="84" stroke="#4A382B" stroke-width="1.1" stroke-dasharray="3 2" />

    <!-- 放大镜 -->
    <circle cx="116" cy="54" r="15" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.5" />
    <circle cx="116" cy="54" r="9.5" stroke="#4B7A63" stroke-width="1.2" stroke-dasharray="2.5 2" />
    <line x1="127" y1="65" x2="140" y2="78" stroke="#4A382B" stroke-width="2.4" stroke-linecap="round" />

    <!-- 黄铜钥匙与牌签 -->
    <circle cx="114" cy="92" r="6" fill="#F7F0E4" stroke="#4A382B" stroke-width="1.3" />
    <path d="M120 92 H144 M136 92 V97 M142 92 V96" stroke="#4A382B" stroke-width="1.4" stroke-linecap="round" />

    <!-- 细星芒 -->
    <path d="M144 30 L145.5 34.5 L150 36 L145.5 37.5 L144 42 L142.5 37.5 L138 36 L142.5 34.5 Z" fill="#B58338" />
  </svg>

  <!-- 跑腿互助：牛皮纸包裹、咖啡杯与虚线配送路径 -->
  <svg
    v-else-if="scene === 'errands'"
    class="ct-illus ct-illus--duotone"
    :style="customWidthStyle"
    viewBox="0 0 180 128"
    fill="none"
    aria-hidden="true"
  >
    <rect x="18" y="20" width="144" height="88" rx="10" fill="#F3EDE4" opacity="0.75" />
    <circle cx="56" cy="46" r="18" fill="#EFE7DD" />
    <circle cx="128" cy="78" r="18" fill="#DCE8E1" />

    <!-- 虚线校园路线 -->
    <path
      d="M42 88 C62 88, 66 54, 92 54 C118 54, 118 82, 140 82"
      stroke="#4A382B"
      stroke-width="1.4"
      stroke-dasharray="4 3"
      stroke-linecap="round"
    />
    <!-- 起点坐标 -->
    <circle cx="42" cy="88" r="5" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <circle cx="42" cy="88" r="2" fill="#B86B63" />
    <!-- 终点坐标旗帜 -->
    <line x1="140" y1="82" x2="140" y2="62" stroke="#4A382B" stroke-width="1.4" stroke-linecap="round" />
    <path d="M140 62 L154 67 L140 72 Z" fill="#4B7A63" stroke="#4A382B" stroke-width="1.2" stroke-linejoin="round" />

    <!-- 牛皮纸快递盒 -->
    <rect x="74" y="34" width="38" height="30" rx="4" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <line x1="74" y1="45" x2="112" y2="45" stroke="#4A382B" stroke-width="1.2" />
    <rect x="89" y="34" width="8" height="15" fill="#EFE7DD" stroke="#4A382B" stroke-width="1.1" />

    <!-- 随行咖啡杯 -->
    <path d="M122 38 H138 L135 58 H125 Z" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.3" stroke-linejoin="round" />
    <rect x="120" y="35" width="20" height="4" rx="1.5" fill="#EFE7DD" stroke="#4A382B" stroke-width="1.2" />
    <line x1="124" y1="48" x2="136" y2="48" stroke="#B58338" stroke-width="2" />
  </svg>

  <!-- 通用档案空状态：手账档案夹与索引签 -->
  <svg
    v-else-if="scene === 'archive-empty'"
    class="ct-illus ct-illus--duotone"
    :style="customWidthStyle"
    viewBox="0 0 180 128"
    fill="none"
    aria-hidden="true"
  >
    <rect x="18" y="20" width="144" height="88" rx="10" fill="#F3EDE4" opacity="0.75" />
    <circle cx="130" cy="44" r="16" fill="#EFE7DD" />
    <circle cx="54" cy="84" r="14" fill="#DCE8E1" />

    <!-- 索引标签页 -->
    <path d="M48 34 H72 L78 42 H48 Z" fill="#EFE7DD" stroke="#4A382B" stroke-width="1.3" stroke-linejoin="round" />
    <path d="M78 36 H100 L106 42 H78 Z" fill="#DCE8E1" stroke="#4A382B" stroke-width="1.3" stroke-linejoin="round" />

    <!-- 档案夹主体 -->
    <rect x="42" y="42" width="96" height="58" rx="6" fill="#FFFEFB" stroke="#4A382B" stroke-width="1.4" />
    <!-- 陶土粉书签带 -->
    <path d="M114 42 V68 L119 63 L124 68 V42 Z" fill="#F2DFDC" stroke="#B86B63" stroke-width="1.2" stroke-linejoin="round" />
    <!-- 档案横线与虚线 -->
    <line x1="56" y1="58" x2="102" y2="58" stroke="#4A382B" stroke-width="1.4" stroke-linecap="round" />
    <line x1="56" y1="69" x2="94" y2="69" stroke="#D5C9B8" stroke-width="1.4" stroke-linecap="round" />
    <line x1="56" y1="80" x2="122" y2="80" stroke="#D5C9B8" stroke-width="1.3" stroke-dasharray="4 3" />
    <circle cx="59" cy="89" r="2.5" fill="#B58338" />
    <line x1="66" y1="89" x2="88" y2="89" stroke="#D5C9B8" stroke-width="1.3" stroke-linecap="round" />
  </svg>

  <!-- 通行证票根装饰条形码 -->
  <svg
    v-else
    class="ct-illus ct-illus--barcode"
    :style="customWidthStyle"
    viewBox="0 0 160 28"
    fill="none"
    aria-hidden="true"
  >
    <rect
      v-for="bar in barcodeBars"
      :key="bar.x"
      :x="bar.x"
      y="2"
      :width="bar.w"
      :height="bar.h"
      fill="#4A382B"
      opacity="0.78"
    />
  </svg>
</template>

<style scoped>
.ct-illus {
  display: block;
  height: auto;
  flex-shrink: 0;
}

.ct-illus--stamp {
  width: 108px;
}

.ct-illus--duotone {
  width: 176px;
}

.ct-illus--barcode {
  width: 152px;
}
</style>
