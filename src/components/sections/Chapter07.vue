<script setup>
import { tips } from '@/data/content'
</script>

<template>
  <section class="section chapter last" data-chapter="6" id="chapter-7">
    <div class="section-inner">
      <p class="kicker">IT’S TIME TO LEARN</p>
      <h2 class="display title" data-reveal="words">How to redesign for a better practice.</h2>
      <p class="serif lead" data-reveal="fade">Now, we rebuild. Craft hygiene isn’t a trend. It’s UX for your process.</p>
      <ol>
        <li v-for="tip in tips" :key="tip.id" data-reveal="fade">
          <p class="num">{{ tip.id }} — {{ tip.label }}</p>
          <p class="icon">{{ tip.icon }} {{ tip.title }}</p>
          <p class="copy">{{ tip.copy }}</p>
        </li>
      </ol>
      <div class="cta">
        <p class="kicker">NOW IT’S TIME TO APPLY</p>
        <p class="serif outro" data-reveal="fade">
          작게 시작하세요. 오늘 밤 차이를 느끼면 됩니다. 더 나은 리듬, 더 나은 아이디어 — 그게 거래입니다.
          내일의 창의는 오늘의 고요에서 시작됩니다. 시스템을 리부트하세요.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.title {
  margin: 0.8rem 0 1.2rem;
  font-size: clamp(2.6rem, 7vw, 5.6rem);
  max-width: 16ch;
  overflow: hidden;
}

.lead {
  font-size: clamp(1.4rem, 3vw, 2rem);
  margin-bottom: 2.4rem;
  max-width: 28rem;
}

ol {
  display: grid;
  gap: 1rem;
}

li {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
}

.num {
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.icon {
  margin: 0.35rem 0;
  font-size: 1.15rem;
}

.copy {
  color: var(--fg-dim);
}

.cta {
  margin-top: 3rem;
}

.outro {
  margin-top: 0.8rem;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  line-height: 1.25;
  max-width: 36rem;
}

@media (min-width: 860px) {
  ol {
    grid-template-columns: 1fr 1fr;
    gap: 1.4rem 2rem;
  }
}
</style>
