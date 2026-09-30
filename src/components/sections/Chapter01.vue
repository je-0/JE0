<script setup>
const stamps = [
  { label: '00.00', value: 'Brief' },
  { label: '14.20', value: 'Build' },
  { label: '6y', value: 'Minimum duration' },
]
</script>

<template>
  <section class="section chapter" data-chapter="1" id="chapter-1">
    <div class="section-inner">
      <div class="top">
        <p class="index">01</p>
        <p class="kicker">SLEEP ISN’T A LUXURY → CRAFT ISN’T A LUXURY</p>
      </div>
      <h2 class="display title" data-reveal="words">Craft isn’t a luxury</h2>
      <p class="lead serif" data-reveal="fade">
        밤마다 시스템을 재부팅하지 않으면 버그가 쌓입니다. 흐린 초점, 느린 사고, 감정 글리치.
        “Making isn’t output. It’s maintenance.”
      </p>
      <div class="grid">
        <div>
          <p class="stack display" data-reveal="fade">Rebooting</p>
          <p class="stack display dim" data-reveal="fade">The system.</p>
        </div>
        <div class="copy" data-reveal="fade">
          <p>
            매일 밤 뇌는 조용한 업데이트를 돌립니다. 캐시를 비우고, 창의적 연결을 다시 배선하고,
            기억을 재배치합니다. 디자이너가 레이어를 정리하고, 개발자가 지저분한 코드를 리팩터하는 일과 같습니다.
          </p>
          <div class="stamps">
            <div v-for="item in stamps" :key="item.label">
              <strong>{{ item.label }}</strong>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <aside class="pill">
        <p class="kicker">PILLS — THE SHORTCUT TRAP</p>
        <p>빠른 템플릿과 자동 생성은 평화를 약속하지만, 손의 리듬을 훔칩니다. 증상만 가리고 원인은 남깁니다.</p>
        <strong>Don’t skip the craft.</strong>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.index {
  font-family: var(--font-display);
  font-size: 0.9rem;
}

.title {
  font-size: clamp(2.8rem, 8vw, 6.4rem);
  max-width: 12ch;
  overflow: hidden;
}

.lead {
  margin: 1.6rem 0 4rem;
  max-width: 34rem;
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  line-height: 1.35;
}

.grid {
  display: grid;
  gap: 2rem;
}

.stack {
  font-size: clamp(2.4rem, 7vw, 5.4rem);
}

.dim {
  color: var(--fg-dim);
}

.copy {
  max-width: 34rem;
  color: var(--fg-dim);
}

.stamps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stamps strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.stamps span {
  color: var(--fg-faint);
  font-size: 0.78rem;
}

.pill {
  margin-top: 4rem;
  padding: 1.4rem 1.5rem;
  border: 1px solid var(--line);
  background: rgba(20, 18, 16, 0.72);
  max-width: 36rem;
}

.pill p {
  margin: 0.7rem 0;
  color: var(--fg-dim);
}

.pill strong {
  color: var(--accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.82rem;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
}
</style>
