<script setup>
import { site } from '@/data/content'
</script>

<template>
  <section class="section hero" data-chapter="0" id="chapter-0">
    <div class="section-inner">
      <p class="kicker" data-reveal="fade">{{ site.guide }}</p>
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
  align-content: end;
  min-height: 100dvh;
  padding-bottom: clamp(5rem, 12vw, 8rem);
}

.titles {
  display: grid;
  margin: 1.2rem 0 8vh;
  font-size: clamp(4.2rem, 16vw, 13.5rem);
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
}

.quote {
  max-width: 18rem;
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.2;
}

.scroll {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
</style>
