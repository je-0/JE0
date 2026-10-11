import * as THREE from 'three'
import { publicUrl } from '@/utils/publicUrl.js'

const TEXTURE_URL = publicUrl('hero-model.png')

/** Full-figure KV (hero-model.png) — use entire texture */
function fitPortraitCrop(_width, _height) {
  return { repeatY: 1, offsetY: 0 }
}

export class Portrait {
  constructor(canvas) {
    this.canvas = canvas
    this.disposed = false
    this.ready = false
    this.reveal = 0
    this.pointer = { x: 0, y: 0 }
    this.yaw = 0
    this.targetYaw = 0
    this.hop = 0
    this.pulse = 0
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.clock = new THREE.Clock()

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40)
    this.camera.position.set(0, 1.1, 4.12)
    this.camera.lookAt(0, 1.06, 0)
    this.canReveal = false
    this.onRevealed = null
    this.revealedOnce = false

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.root = new THREE.Group()
    this.pivot = new THREE.Group()
    this.root.add(this.pivot)
    this.scene.add(this.root)

    this._loadTexture()

    this._onResize = () => this._resize()
    window.addEventListener('resize', this._onResize)
    this._resize()
    this.renderer.setAnimationLoop(() => this._tick())
  }

  setPointer(x, y) {
    this.pointer.x = x
    this.pointer.y = y
  }

  setYaw(value) {
    this.targetYaw = value
  }

  hop() {
    this.hop = 1
  }

  pulse() {
    this.pulse = 1
  }

  startReveal() {
    this.canReveal = true
    this._resize()
  }

  dispose() {
    this.disposed = true
    this.renderer.setAnimationLoop(null)
    window.removeEventListener('resize', this._onResize)
    this.planeGeo?.dispose()
    this.planeMat?.map?.dispose()
    this.planeMat?.dispose()
    this.backMat?.dispose()
    this.shadowMat?.dispose()
    this.shadowGeo?.dispose()
    this.renderer.dispose()
  }

  _loadTexture() {
    const loader = new THREE.TextureLoader()
    loader.load(
      TEXTURE_URL,
      (texture) => {
        if (this.disposed) return
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping

        const image = texture.image
        const crop = fitPortraitCrop(image.width, image.height)
        texture.repeat.set(1, crop.repeatY)
        texture.offset.set(0, crop.offsetY)

        const aspect = image.width / Math.max(image.height * crop.repeatY, 1)
        const planeHeight = 2.05
        const planeWidth = planeHeight * aspect

        this.planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight)
        this.planeMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })

        this.backMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          color: 0x6a7280,
          depthWrite: false,
        })

        this.shadowGeo = new THREE.CircleGeometry(0.62, 48)
        this.shadowMat = new THREE.MeshBasicMaterial({
          color: 0x121828,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        })

        this.shadow = new THREE.Mesh(this.shadowGeo, this.shadowMat)
        this.shadow.rotation.x = -Math.PI / 2
        this.shadow.position.set(0, 0.04, 0.08)
        this.shadow.scale.set(1.15, 1, 0.4)

        this.backPlane = new THREE.Mesh(this.planeGeo, this.backMat)
        this.backPlane.position.z = -0.045
        this.backPlane.scale.set(0.992, 0.992, 1)

        this.plane = new THREE.Mesh(this.planeGeo, this.planeMat)
        this.plane.position.y = planeHeight / 2

        this.pivot.add(this.shadow)
        this.pivot.add(this.backPlane)
        this.pivot.add(this.plane)
        this.pivot.position.y = -0.06

        this.planeHeight = planeHeight
        this.ready = true
        this.reveal = this.reduced ? 1 : 0
        this.canReveal = this.reduced
      },
      undefined,
      (error) => {
        console.error('[Portrait] texture load failed', error)
      },
    )
  }

  _resize() {
    const width = this.canvas.clientWidth || 1
    const height = this.canvas.clientHeight || 1
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
  }

  _tick() {
    if (this.disposed) return
    const dt = Math.min(this.clock.getDelta(), 0.05)

    if (this.ready && this.canReveal && this.reveal < 1) {
      this.reveal = Math.min(1, this.reveal + dt * (this.reduced ? 3.5 : 0.85))
    }

    const revealEase = 1 - (1 - this.reveal) ** 3

    if (this.reveal >= 1 && !this.revealedOnce) {
      this.revealedOnce = true
      this.onRevealed?.()
    }

    this.yaw += (this.targetYaw - this.yaw) * 0.1
    this.pivot.rotation.y = 0
    this.pivot.rotation.x = 0
    this.pivot.rotation.z = 0

    const hopLift =
      this.hop > 0 ? Math.sin((1 - this.hop) * Math.PI) * 0.22 : 0
    if (this.hop > 0) this.hop = Math.max(0, this.hop - dt * 1.45)

    const pulseScale = this.pulse > 0 ? 1 - Math.sin(this.pulse * Math.PI) * 0.04 : 0
    if (this.pulse > 0) this.pulse = Math.max(0, this.pulse - dt * 2.8)

    this.root.position.y = hopLift

    if (this.plane) {
      this.plane.position.y = this.planeHeight / 2
      this.plane.scale.set(1 - pulseScale, 1, 1)
      this.backPlane.position.y = this.plane.position.y
      this.backPlane.scale.set(0.992 * (1 - pulseScale), 0.992, 1)
      const alpha = this.canReveal ? revealEase : 0
      this.planeMat.opacity = alpha
      this.backMat.opacity = alpha * 0.22
    }

    if (this.shadow) {
      const shadowPulse = 1 - hopLift * 1.8
      this.shadow.scale.x = 1.35 * shadowPulse
      this.shadow.material.opacity = 0.14 + hopLift * 0.35
    }

    this.renderer.render(this.scene, this.camera)
  }
}
