<script setup>
import { site } from '@/data/content'
</script>

<template>
  <section class="section hero" data-chapter="0" id="chapter-0">
    <div class="hero-inner">
      <p class="guide" data-reveal="fade">{{ site.guide }}</p>
      <h1 class="display titles">
        <span v-for="word in site.titles" :key="word" data-reveal="words">{{ word }}</span>
      </h1>
      <div class="hero-foot">
        <p class="serif quote" data-reveal="fade">“{{ site.quote }}”</p>
        <p class="scroll" data-reveal="fade">Scroll to Explore</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  align-content: space-between;
  min-height: 100dvh;
  padding: calc(var(--pad) + 3.2rem) var(--pad) var(--pad);
}

.hero-inner {
  display: grid;
  align-content: space-between;
  min-height: calc(100dvh - var(--pad) * 2 - 3.2rem);
}

.guide {
  font-size: 0.68rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.titles {
  display: grid;
  margin: 8vh 0 auto;
  font-size: clamp(3.6rem, 14.8vw, 12.4rem);
}

.titles span {
  overflow: hidden;
}

.hero-foot {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
  padding-bottom: 0.4rem;
}

.quote {
  max-width: 16rem;
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  font-style: italic;
  line-height: 1.2;
}

.scroll {
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
</style>
