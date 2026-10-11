<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const form = reactive({ name: '', email: '', project: '', message: '' })
const error = ref('')
const ready = ref(false)

const submit = () => {
  error.value = ''
  ready.value = false
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    error.value = t('contact.error')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = t('contact.badEmail')
    return
  }
  const subject = encodeURIComponent(`[LIM] ${form.project.trim() || 'project'} — ${form.name.trim()}`)
  const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()}\n${form.email.trim()}`)
  window.location.href = `mailto:${t('contact.mail')}?subject=${subject}&body=${body}`
  ready.value = true
}
</script>

<template>
  <section id="contact" class="contact bleed">
    <div class="shell contact-inner">
    <p class="kicker">{{ t('contact.kicker') }}</p>
    <div class="grid">
      <div>
        <h2>{{ t('contact.title') }}</h2>
        <p class="lead">{{ t('contact.lead') }}</p>
        <a
          class="github"
          :href="t('contact.githubUrl')"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('contact.githubLabel') }}
        </a>
      </div>
      <form @submit.prevent="submit">
        <label>
          {{ t('contact.name') }}
          <input v-model="form.name" name="name" autocomplete="name" />
        </label>
        <label>
          {{ t('contact.email') }}
          <input v-model="form.email" name="email" type="email" autocomplete="email" />
        </label>
        <label>
          {{ t('contact.project') }}
          <input v-model="form.project" name="project" :placeholder="t('contact.placeholder')" />
        </label>
        <label>
          {{ t('contact.message') }}
          <textarea v-model="form.message" name="message" rows="4" />
        </label>
        <p v-if="error" class="feedback bad">{{ error }}</p>
        <p v-else-if="ready" class="feedback">{{ t('contact.ready') }}</p>
        <button type="submit">{{ t('contact.send') }}</button>
      </form>
    </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  background: white;
}

.contact-inner {
  @include block-section-y;
}

.grid {
  display: grid;
  gap: rem(32);
  margin-top: rem(14);
}

h2 {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(#{rem(38)}, 6vw, #{rem(64)});
  line-height: 1.02;
  max-width: 12ch;
}

.lead {
  display: block;
  margin-top: rem(16);
  color: var(--fg-dim);
  font-size: rem(16);
  line-height: 1.55;
}

.github {
  display: inline-block;
  margin-top: rem(16);
  color: var(--blue);
  font-size: rem(16);
  letter-spacing: 0.02em;
  text-transform: none;

  &:hover {
    text-decoration: underline;
  }
}

form {
  display: grid;
  gap: rem(14);
}

label {
  @include field-label;
}

input,
textarea {
  @include underline-field;
}

button[type='submit'] {
  justify-self: start;
  margin-top: rem(6);
  @include pill-button;
}

.feedback {
  color: var(--moss);

  &.bad {
    color: var(--blue);
  }
}

@include tablet {
  h2 {
    font-size: clamp(#{rem(32)}, 8vw, #{rem(48)});
    max-width: none;
  }

  .github {
    word-break: break-all;
  }
}

@include mobile {
  h2 {
    font-size: clamp(#{rem(28)}, 8vw, #{rem(36)});
    max-width: none;
  }

  .github {
    word-break: break-all;
  }

  button[type='submit'] {
    width: 100%;
    text-align: center;
  }
}
</style>
