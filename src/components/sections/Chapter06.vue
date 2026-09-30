<script setup>
import { layers } from '@/data/content'
</script>

<template>
  <section class="section chapter" data-chapter="6" id="chapter-6">
    <div class="section-inner">
      <p class="index">06</p>
      <p class="kicker">The Layers of your desirable build.</p>
      <h2 class="display title" data-reveal="words">The build cycle</h2>
      <ol>
        <li v-for="layer in layers" :key="layer.name" data-reveal="fade">
          <p class="sub">{{ layer.sub }}</p>
          <h3 class="serif">{{ layer.name }}</h3>
          <p>{{ layer.copy }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.index {
  font-family: var(--font-display);
}

.title {
  margin: 0.8rem 0 2.4rem;
  font-size: clamp(2.8rem, 8vw, 6rem);
  overflow: hidden;
}

ol {
  display: grid;
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}

li {
  padding: 1.6rem 1.3rem;
  background: rgba(11, 10, 9, 0.7);
}

.sub {
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
}

h3 {
  margin: 0.45rem 0 0.7rem;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

li p:last-child {
  color: var(--fg-dim);
  max-width: 34rem;
}

@media (min-width: 860px) {
  ol {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
