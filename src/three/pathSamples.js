export function samplePathD(d, steps = 64) {
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  svg.style.position = 'absolute'
  svg.style.width = '0'
  svg.style.height = '0'
  svg.style.overflow = 'hidden'
  document.body.appendChild(svg)

  const len = path.getTotalLength() || 1
  const points = []
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength((len * i) / steps)
    points.push({ x: p.x, y: p.y })
  }
  svg.remove()
  return points
}

export function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  return [
    `M ${x + rr} ${y}`,
    `H ${x + w - rr}`,
    `Q ${x + w} ${y} ${x + w} ${y + rr}`,
    `V ${y + h - rr}`,
    `Q ${x + w} ${y + h} ${x + w - rr} ${y + h}`,
    `H ${x + rr}`,
    `Q ${x} ${y + h} ${x} ${y + h - rr}`,
    `V ${y + rr}`,
    `Q ${x} ${y} ${x + rr} ${y}`,
    'Z',
  ].join(' ')
}
