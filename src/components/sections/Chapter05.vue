<script setup>
const verses = [
  { lines: ['The', 'Blue', 'Light'] },
  { lines: ['Will', 'Be', 'The', 'New'] },
  { lines: ['Midnight', 'Sun'] },
]
</script>

<template>
  <section class="section chapter" data-chapter="5" id="chapter-5">
    <div class="section-inner">
      <p class="index">05</p>
      <h2 class="display title" data-reveal="words">An enemy called the noise.</h2>
      <div class="verses">
        <article v-for="(verse, index) in verses" :key="index" data-reveal="fade">
          <p v-for="line in verse.lines" :key="line" class="serif">{{ line }}</p>
        </article>
      </div>
      <div class="quotes">
        <p data-reveal="fade">“Your feed scrolls. Your brain doesn’t stop.” 늦은 스크롤은 마음을 계속 움직입니다.</p>
        <p data-reveal="fade">“Blue light is the new midnight sun.” 꿈을 미루고 시계를 헷갈리게 합니다.</p>
        <p data-reveal="fade">“You can’t rest if you’re still refreshing.” 오늘을 놓지 못하면 내일의 형태도 오지 않습니다.</p>
      </div>
      <div class="cols">
        <div>
          <p class="kicker">THE BIOLOGICAL CONFUSION</p>
          <p class="copy">몸은 빛을 듣습니다. 화면의 푸른 파장은 대낮을 흉내 내고, 뇌에게 자정을 아침처럼 보이게 합니다.</p>
        </div>
        <div>
          <p class="kicker">YOUR BODY LISTENS TO LIGHT</p>
          <p class="copy">따뜻한 빛은 말합니다. 휴식이 가깝다. 차가운 빛은 말합니다. 깨어 있어라. 정렬이 어긋나면 여덟 시간을 자도 회복되지 않습니다.</p>
        </div>
      </div>
      <p class="close serif" data-reveal="fade">Turn down the Light. You can’t dream in daylight.</p>
    </div>
  </section>
</template>

<style scoped>
.index {
  font-family: var(--font-display);
}

.title {
  margin: 0.8rem 0 2.4rem;
  font-size: clamp(2.6rem, 7vw, 5.6rem);
  max-width: 14ch;
  overflow: hidden;
}

.verses {
  display: grid;
  gap: 1rem;
  margin-bottom: 2.4rem;
}

.verses article {
  padding: 1.2rem;
  border: 1px solid var(--line);
  min-height: 10rem;
}

.verses p {
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.05;
}

.quotes {
  display: grid;
  gap: 0.9rem;
  margin-bottom: 2.6rem;
  color: var(--fg-dim);
}

.cols {
  display: grid;
  gap: 1.6rem;
}

.copy {
  margin-top: 0.7rem;
  color: var(--fg-dim);
  max-width: 30rem;
}

.close {
  margin-top: 2.8rem;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.15;
}

@media (min-width: 800px) {
  .verses,
  .cols {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cols {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
