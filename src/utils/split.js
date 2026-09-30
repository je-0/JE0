export function splitWords(element) {
  if (!element || element.dataset.split === 'true') return
  const text = element.textContent ?? ''
  element.innerHTML = text
    .split(/(\s+)/)
    .map((chunk) => {
      if (/^\s+$/.test(chunk)) return chunk
      return `<span class="word"><span class="word-inner">${chunk}</span></span>`
    })
    .join('')
  element.dataset.split = 'true'
}

export function splitChars(element) {
  if (!element || element.dataset.split === 'true') return
  const text = element.textContent ?? ''
  element.innerHTML = [...text]
    .map((char) => {
      if (char === ' ') return `<span class="char space">&nbsp;</span>`
      return `<span class="char"><span class="char-inner">${char}</span></span>`
    })
    .join('')
  element.dataset.split = 'true'
}
