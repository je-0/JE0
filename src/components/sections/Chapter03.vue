<script setup>
import { clockWords } from '@/data/content'
</script>

<template>
  <section class="section chapter clock" data-chapter="3" id="chapter-3">
    <div class="section-inner">
      <p class="index">03</p>
      <h2 class="display title" data-reveal="words">Be on the Clock.</h2>
    </div>
    <div class="marquee" aria-hidden="true">
      <div class="track" data-marquee>
        <span v-for="(word, index) in [...clockWords, ...clockWords]" :key="`${word}-${index}`">
          {{ word }}
        </span>
      </div>
    </div>
    <div class="section-inner split">
      <div>
        <p class="serif lead" data-reveal="fade">We overclock our machines</p>
        <p class="copy" data-reveal="fade">
          디자이너와 개발자는 흐름을 쫓습니다. 픽셀과 코드 안에서 시간이 사라집니다.
          하지만 늦은 밤의 한 번은 내일의 선명함을 훔칩니다. 블루라이트가 석양을 대체하고, 슬랙이 침묵을 대체합니다.
        </p>
      </div>
      <div>
        <p class="serif lead" data-reveal="fade">Then wonder the overheat</p>
        <p class="copy" data-reveal="fade">
          계속 켜진 상태는 작업의 깊은 층을 깎아 먹습니다. 자고 일어나도 시작보다 더 지칩니다.
          “We overclock our machines. Then wonder why they overheat.”
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.index {
  font-family: var(--font-display);
}

.title {
  margin: 0.8rem 0 2rem;
  font-size: clamp(2.8rem, 8vw, 6.4rem);
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  margin: 2rem 0 3.5rem;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 1.1rem 0;
}

.track {
  display: flex;
  width: max-content;
  gap: 1.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 2.4rem);
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.track span {
  padding: 0.15rem 0.7rem;
  border: 1px solid var(--line);
}

.split {
  display: grid;
  gap: 2rem;
}

.lead {
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.15;
  margin-bottom: 1rem;
}

.copy {
  color: var(--fg-dim);
  max-width: 32rem;
}

@media (min-width: 860px) {
  .split {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
