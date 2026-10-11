<script setup>
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer bleed">
    <div class="shell footer-inner">
    <p>{{ t('footer.note') }}</p>
    <p>{{ t('footer.copy') }} | 2026 · JEyoung</p>
    </div>
  </footer>
</template>

