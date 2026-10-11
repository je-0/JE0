import * as THREE from 'three'

export { roundedRectPath, samplePathD } from '@/three/pathSamples.js'

export class IntroSketch {
  constructor(canvas) {
    this.canvas = canvas
    this.disposed = false
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -200, 200)
    this.camera.position.z = 50

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.root = new THREE.Group()
    this.scene.add(this.root)

    this.pencil = this._makePencil()
    this.root.add(this.pencil)
    this.pencil.visible = false

    this.strokes = []
    this.fade = 1

    this._onResize = () => this._resize()
    window.addEventListener('resize', this._onResize)
    this._resize()
    this.renderer.setAnimationLoop(() => this._tick())
  }

  _makePencil() {
    const g = new THREE.Group()
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.16, 8),
      new THREE.MeshBasicMaterial({ color: 0x2f4bff }),
    )
    tip.rotation.x = Math.PI
    tip.position.y = -0.08
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.034, 0.22, 8),
      new THREE.MeshBasicMaterial({ color: 0x151518 }),
    )
    body.position.y = 0.12
    g.add(tip, body)
    g.scale.setScalar(8)
    return g
  }

  setStrokes(strokeDefs) {
    this._clearStrokes()
    this.strokeDefs = strokeDefs

    for (const def of strokeDefs) {
      const positions = []
      for (const p of def.points) {
        positions.push(p.x, p.y, p.z ?? 0)
      }
      if (positions.length < 6) continue

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      const vertCount = positions.length / 3
      geo.setDrawRange(0, 0)

      const mat = new THREE.LineBasicMaterial({
        color: def.color ?? 0x151518,
        transparent: true,
        opacity: def.opacity ?? 0.92,
        depthTest: false,
      })

      const line = new THREE.Line(geo, mat)
      line.renderOrder = 10
      this.root.add(line)
      this.strokes.push({
        id: def.id,
        line,
        geo,
        mat,
        vertCount,
        baseOpacity: def.opacity ?? 0.92,
        progress: this.reduced ? 1 : 0,
        durationMs:
          def.durationMs ??
          Math.min(88, Math.max(18, vertCount * (def.fast ? 0.65 : 1.15))),
      })
    }
  }

  async drawAll(onStrokeDone) {
    if (this.reduced) {
      this.strokes.forEach((s) => {
        s.progress = 1
        s.geo.setDrawRange(0, s.vertCount)
      })
      this.pencil.visible = false
      return
    }

    this.pencil.visible = true
    for (const stroke of this.strokes) {
      await this._drawStroke(stroke)
      onStrokeDone?.(stroke.id)
    }
    this.pencil.visible = false
  }

  _drawStroke(stroke) {
    return new Promise((resolve) => {
      let last = performance.now()
      const step = (now) => {
        if (this.disposed) {
          resolve()
          return
        }
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        const dur = Math.max(0.028, stroke.durationMs / 1000)
        stroke.progress = Math.min(1, stroke.progress + dt / dur)
        const count = Math.max(2, Math.floor(stroke.vertCount * stroke.progress))
        stroke.geo.setDrawRange(0, count)

        const attr = stroke.geo.attributes.position
        const idx = Math.min(count - 1, attr.count - 1)
        this.pencil.position.set(attr.getX(idx), attr.getY(idx), attr.getZ(idx) + 0.15)
        this.pencil.rotation.z = -0.55

        if (stroke.progress >= 1) {
          stroke.geo.setDrawRange(0, stroke.vertCount)
          resolve()
          return
        }
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
  }

  fadeOut() {
    return new Promise((resolve) => {
      const start = this.fade
      const t0 = performance.now()
      const duration = 420
      const tick = (now) => {
        if (this.disposed) {
          resolve()
          return
        }
        const t = Math.min(1, (now - t0) / duration)
        this.fade = start * (1 - t)
        if (t >= 1) {
          resolve()
          return
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  }

  _clearStrokes() {
    for (const s of this.strokes) {
      s.geo.dispose()
      s.mat.dispose()
      this.root.remove(s.line)
    }
    this.strokes = []
  }

  _resize() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.width = w
    this.height = h
    this.camera.left = 0
    this.camera.right = w
    this.camera.top = 0
    this.camera.bottom = h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }

  _tick() {
    if (this.disposed) return
    this.root.rotation.x = 0.08
    this.root.position.y = 0
    this.root.scale.y = 1

    for (const s of this.strokes) {
      s.mat.opacity = s.baseOpacity * this.fade
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    this.renderer.setAnimationLoop(null)
    window.removeEventListener('resize', this._onResize)
    this._clearStrokes()
    this.pencil.traverse((c) => {
      c.geometry?.dispose()
      c.material?.dispose()
    })
    this.renderer.dispose()
  }
}
