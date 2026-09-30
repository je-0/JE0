<script setup>
import { works } from '@/data/content'
</script>

<template>
  <section class="section chapter" data-chapter="4" id="chapter-4">
    <div class="section-inner">
      <p class="index">04</p>
      <p class="kicker">Encounter the Balance and ship better</p>
      <h2 class="display title" data-reveal="words">Selected works</h2>
      <p class="serif lead" data-reveal="fade">
        The secret is rhythm — and not intensity.
      </p>
      <p class="copy" data-reveal="fade">
        몸은 정지한 창작을 위해 만들어지지 않았습니다. 균형이야말로 진짜 퍼포먼스 부스터입니다.
        과로와 과훈련은 모두 코르티솔을 부어 휴식을 늦춥니다. 움직임은 생산성의 반대가 아니라 연료입니다.
      </p>
      <ul class="works">
        <li v-for="work in works" :key="work.num">
          <article>
            <div class="meta">
              <span>{{ work.num }}</span>
              <span>{{ work.year }}</span>
            </div>
            <h3 class="display">{{ work.title }}</h3>
            <p class="role">{{ work.role }}</p>
            <p class="summary">{{ work.summary }}</p>
            <p class="tags">
              <span v-for="tag in work.tags" :key="tag">{{ tag }}</span>
            </p>
          </article>
        </li>
      </ul>
      <p class="warn">⚠️ DURING SPRINT: PROTECT THE QUIET LAYER</p>
    </div>
  </section>
</template>

<style scoped>
.index {
  font-family: var(--font-display);
}

.title {
  margin: 0.7rem 0 1.2rem;
  font-size: clamp(3.2rem, 9vw, 7rem);
  overflow: hidden;
}

.lead {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  margin-bottom: 1rem;
}

.copy {
  max-width: 36rem;
  color: var(--fg-dim);
  margin-bottom: 3rem;
}

.works {
  display: grid;
  gap: 2rem 3rem;
}

.works article {
  padding: 0 0 1.4rem;
  border-bottom: 1px solid var(--line);
}

.meta {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
}

.works h3 {
  margin: 0.7rem 0 0.35rem;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}

.role,
.summary {
  color: var(--fg-dim);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1rem;
}

.tags span {
  border: 1px solid var(--line);
  padding: 0.18rem 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.warn {
  margin-top: 2rem;
  color: var(--accent);
  letter-spacing: 0.12em;
  font-size: 0.78rem;
}

@media (min-width: 860px) {
  .works {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
