<script setup>
import { site, socials } from '@/data/content'
</script>

<template>
  <footer class="footer">
    <div class="section-inner">
      <p class="serif note">
        만드는 사람과 쉬는 사람을 위한 크리에이티브 실험. 더 나은 초점, 더 나은 균형, 더 효율적인 손.
        도움이 되었기를. 감사합니다.
      </p>
      <p class="kicker">LEARN CREATIVE ANIMATION</p>
      <ul>
        <li v-for="item in socials" :key="item.label">
          <a :href="item.href" target="_blank" rel="noreferrer">{{ item.label }}</a>
        </li>
      </ul>
      <div class="legal">
        <p>© ALL RIGHTS RESERVED | {{ site.year }}</p>
        <p>DESIGNED AND DEV: {{ site.person }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 2;
  padding: calc(var(--pad) * 2) var(--pad) var(--pad);
  border-top: 1px solid var(--line);
  background: linear-gradient(180deg, transparent, rgba(7, 8, 12, 0.92) 30%);
}

.note {
  max-width: 34rem;
  font-size: clamp(1.3rem, 2.4vw, 1.8rem);
  line-height: 1.35;
  margin-bottom: 2rem;
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.6rem;
  margin: 1rem 0 3rem;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
}

a:hover {
  color: var(--accent);
}

.legal {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--fg-faint);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
}
</style>
