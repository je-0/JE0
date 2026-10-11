<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from '@/i18n'
import { isMobileViewport } from '@/composables/useScrollBreakpoints'

const MOBILE_WORKS_LIMIT = 6

const { t } = useI18n()
const filter = ref(0)
const active = ref(null)
const mobileExpanded = ref(false)
const isMobile = ref(typeof window !== 'undefined' ? isMobileViewport() : false)

let mobileMq

function syncMobileViewport() {
  isMobile.value = isMobileViewport()
  if (!isMobile.value) mobileExpanded.value = false
}

const items = computed(() => t('works.items'))
const filters = computed(() => t('works.filters'))
const visible = computed(() => {
  const name = filters.value[filter.value]
  if (filter.value === 0) return items.value
  return items.value.filter((item) => item.discipline === name)
})

const displayed = computed(() => {
  const list = visible.value
  if (!isMobile.value || mobileExpanded.value) return list
  return list.slice(0, MOBILE_WORKS_LIMIT)
})

const showLoadMore = computed(
  () => isMobile.value && !mobileExpanded.value && visible.value.length > MOBILE_WORKS_LIMIT,
)

const loadMore = () => {
  mobileExpanded.value = true
}

watch(filter, () => {
  mobileExpanded.value = false
})

onMounted(() => {
  syncMobileViewport()
  mobileMq = window.matchMedia('(max-width: 639px)')
  mobileMq.addEventListener('change', syncMobileViewport)
})

onUnmounted(() => {
  mobileMq?.removeEventListener('change', syncMobileViewport)
})

const open = (item) => {
  active.value = item
}

const shift = (step) => {
  const list = visible.value
  const index = list.findIndex((item) => item.num === active.value?.num)
  if (index < 0) return
  active.value = list[(index + step + list.length) % list.length]
}

const notes = computed(() => {
  if (!active.value) return []
  const fields = t('works.fields')
  return ['brief', 'challenge', 'approach', 'outcome'].map((key) => ({
    label: fields[key],
    copy: active.value[key],
  }))
})

const totalLabel = computed(() => String(items.value.length).padStart(2, '0'))
</script>

<template>
  <section id="works" class="works bleed">
    <div class="shell works-inner">
    <p class="kicker">{{ t('works.kicker') }}</p>
    <div class="head">
      <h2>{{ t('works.title') }}</h2>
      <p>{{ t('works.lead') }}</p>
    </div>
    <div class="filters">
      <button
        v-for="(label, index) in filters"
        :key="label"
        type="button"
        :class="{ on: filter === index }"
        @click="filter = index"
      >
        {{ label }}
      </button>
    </div>
    <ul>
      <li v-for="item in displayed" :key="item.num">
        <button type="button" @click="open(item)">
          <span class="meta">{{ item.num }} · {{ item.period || item.year }}</span>
          <strong>{{ item.title }}</strong>
          <span>{{ item.role }}</span>
          <em>{{ item.summary }}</em>
          <span class="open">{{ t('works.open') }}</span>
        </button>
      </li>
    </ul>
    <div v-if="showLoadMore" class="more-wrap">
      <button type="button" class="run-more" @click="loadMore">
        <span class="run-more__label">{{ t('works.loadMore') }}</span>
        <span class="run-more__plus" aria-hidden="true">+</span>
      </button>
    </div>
    </div>

    <div v-if="active" class="sheet" role="dialog" :aria-label="active.title">
      <div class="panel">
        <div class="sheet-top">
          <p>{{ active.num }} / {{ totalLabel }}</p>
          <button type="button" @click="active = null">{{ t('works.close') }}</button>
        </div>
        <h3>{{ active.title }}</h3>
        <p class="role">{{ active.role }} · {{ active.discipline }}</p>
        <ul class="highlights">
          <li v-for="line in active.highlights" :key="line">{{ line }}</li>
        </ul>
        <div class="notes">
          <section v-for="note in notes" :key="note.label">
            <p>{{ note.label }}</p>
            <span>{{ note.copy }}</span>
          </section>
        </div>
        <div class="sheet-nav">
          <button type="button" @click="shift(-1)">{{ t('works.prev') }}</button>
          <button type="button" @click="shift(1)">{{ t('works.next') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.works {
  background: var(--paper);
}

.works-inner {
  @include block-section-y;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: rem(32);
  align-items: end;
  margin: rem(14) 0 rem(26);

  h2 {
    @include poster-heading(54, 8vw, 96);
  }

  p {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(#{rem(26)}, 4vw, #{rem(38)});
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: rem(10);
  margin-bottom: rem(22);

  button {
    @include filter-chip;
  }
}

ul {
  display: grid;
  gap: rem(16);
  grid-template-columns: 1fr;

  @include tablet-up {
    grid-template-columns: 1fr 1fr;
    column-gap: rem(32);
  }
}

.more-wrap {
  display: none;
  justify-content: center;
  margin-top: rem(24);
}

.run-more {
  display: inline-flex;
  align-items: center;
  gap: rem(12);
  padding: rem(8) rem(12) rem(8) rem(16);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  font-size: rem(12);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.run-more__label {
  line-height: 1;
}

.run-more__plus {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: rem(28);
  height: rem(28);
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  font-size: rem(16);
  line-height: 1;
  font-weight: 400;
}

li button {
  display: grid;
  gap: rem(6);
  width: 100%;
  padding: rem(20) 0;
  border-top: 1px solid var(--line);
  text-align: left;
}

strong {
  font-size: clamp(#{rem(26)}, 4vw, #{rem(36)});
  letter-spacing: -0.04em;
}

.meta,
.open {
  @include meta-label;
}

em {
  color: var(--fg-dim);
  font-style: normal;
  font-size: rem(16);
  line-height: 1.55;
}

.sheet {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: rem(20);
  background: rgba(20, 20, 20, 0.46);
}

.panel {
  width: min(880px, 100%);
  max-height: calc(100dvh - #{rem(38)});
  overflow: auto;
  padding: clamp(#{rem(22)}, 4vw, #{rem(36)});
  background: white;
}

.sheet-top,
.sheet-nav {
  display: flex;
  justify-content: space-between;

  button {
    @include meta-label;
  }
}

h3 {
  margin: rem(16) 0 rem(6);
  @include poster-heading(42, 6vw, 70);
}

.role {
  color: var(--fg-dim);
  font-size: rem(16);
}

.highlights {
  display: grid;
  gap: rem(6);
  margin: rem(20) 0;

  li {
    padding-left: rem(12);
    border-left: 2px solid var(--blue);
  }
}

.notes {
  display: grid;
  gap: rem(16);

  p {
    @include meta-label;
  }

  span {
    display: block;
    margin-top: rem(4);
    font-size: rem(16);
    line-height: 1.55;
  }
}

.sheet-nav {
  margin-top: rem(22);
  padding-top: rem(14);
  border-top: 1px solid var(--line);
}

@include tablet {
  .head {
    margin-bottom: rem(20);

    h2 {
      font-size: clamp(#{rem(32)}, 10vw, #{rem(54)});
    }

    p {
      font-size: clamp(#{rem(16)}, 4vw, #{rem(30)});
      max-width: 28ch;
    }
  }

  strong {
    font-size: clamp(#{rem(22)}, 6vw, #{rem(30)});
  }

  li button span:not(.meta):not(.open) {
    font-size: rem(16);
  }
}

@include mobile {
  .head {
    margin-bottom: rem(20);

    h2 {
      font-size: clamp(#{rem(28)}, 10vw, #{rem(36)});
    }

    p {
      font-size: rem(16);
      max-width: 28ch;
    }
  }

  strong {
    font-size: clamp(#{rem(22)}, 6vw, #{rem(30)});
  }

  li button span:not(.meta):not(.open) {
    font-size: rem(16);
  }

  li button {
    padding: rem(16) 0;
  }

  .sheet {
    padding: rem(12);
    align-items: stretch;
  }

  .panel {
    max-height: calc(100dvh - #{rem(24)});
    padding: rem(20) rem(16);
  }

  h3 {
    font-size: clamp(#{rem(28)}, 8vw, #{rem(42)});
  }

  .filters {
    gap: rem(8);
  }

  .more-wrap {
    display: flex;
  }
}
</style>
