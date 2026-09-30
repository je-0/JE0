<template>
  <section class="section chapter" data-chapter="2" id="chapter-2">
    <div class="section-inner">
      <p class="index">02</p>
      <p class="kicker">The importance of the right Beat.</p>
      <h2 class="display title" data-reveal="words">The pulse within</h2>
      <div class="layout">
        <div class="pulse" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p class="serif lead" data-reveal="fade">
            작업의 심장은 템포를 정합니다. 압박이 오면 맥박이 빨라지고, 정리가 되면 느려지며 안전하다는 신호를 보냅니다.
          </p>
          <p class="copy" data-reveal="fade">
            일정한 리듬은 건강만이 아닙니다. 하모니입니다. 깊게 숨 쉬고, 조도를 낮추고, 느린 레퍼런스를 보면
            내부 메트로놈이 다시 맞춰집니다. 하지만 알림과 카페인과 불안은 밤에도 투쟁-도피 상태로 뇌를 속입니다.
          </p>
          <p class="banner" data-reveal="fade">HIGH RATE = LOW CRAFT</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.index {
  font-family: var(--font-display);
}

.title {
  margin: 0.8rem 0 3rem;
  font-size: clamp(2.8rem, 8vw, 6.2rem);
  max-width: 10ch;
  overflow: hidden;
}

.layout {
  display: grid;
  gap: 3rem;
  align-items: center;
}

.pulse {
  width: min(320px, 70vw);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.pulse span {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(227, 106, 58, 0.35);
  border-radius: 50%;
  animation: beat 2.8s var(--ease) infinite;
}

.pulse span:nth-child(2) {
  width: 68%;
  height: 68%;
  animation-delay: 0.25s;
}

.pulse span:nth-child(3) {
  width: 32%;
  height: 32%;
  background: var(--accent);
  border: 0;
  animation-delay: 0.45s;
}

.lead {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  line-height: 1.25;
  margin-bottom: 1.2rem;
}

.copy {
  max-width: 36rem;
  color: var(--fg-dim);
}

.banner {
  margin-top: 2rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  letter-spacing: -0.04em;
  color: var(--accent);
}

@keyframes beat {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  45% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 0.7fr 1.1fr;
  }
}
</style>
