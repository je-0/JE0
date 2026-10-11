<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/i18n'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['jump', 'toggle'])
const { t } = useI18n()
const dark = ref(false)

const toggleMode = () => {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  localStorage.setItem('cw-theme', dark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('cw-theme')
  if (saved === 'dark') {
    dark.value = true
    document.documentElement.dataset.theme = 'dark'
  } else {
    document.documentElement.dataset.theme = 'light'
  }
})
</script>

<template>
  <header class="site-header-bar">
    <button class="logo" type="button" @click="emit('jump', 'hero')">{{ t('nav.logo') }}</button>
    <button class="mode" type="button" :aria-label="t('nav.mode')" @click="toggleMode">
      <span class="mode-label">{{ t('nav.mode') }}</span>
      <span class="mode-icon" aria-hidden="true" />
    </button>
    <nav class="site-nav" :aria-label="t('nav.menu')">
      <button
        v-for="item in t('nav.items')"
        :key="item.id"
        type="button"
        @click="emit('jump', item.id)"
      >
        {{ item.label }}
      </button>
    </nav>
    <button class="menu-toggle" type="button" @click="emit('toggle')">
      <span />
      <span />
    </button>
  </header>
</template>

