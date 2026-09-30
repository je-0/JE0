import * as THREE from 'three'
import { clamp, lerp } from '@/utils/math'

const BG = 0x07080c
const ACCENT = 0xe36a3a
const PAPER = 0xf3eee4
const MOON = 0xd8cbb6

export class Experience {
  constructor(canvas) {
    this.canvas = canvas
    this.timer = new THREE.Timer()
    this.timer.connect(document)
    this.progress = 0
    this.targetProgress = 0
    this.pointer = { x: 0, y: 0 }
    this.targetPointer = { x: 0, y: 0 }
    this.disposed = false

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(BG, 0.028)
    this.scene.background = new THREE.Color(BG)

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80)
    this.camera.position.set(0, 0.05, 8.8)

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(BG, 1)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.root = new THREE.Group()
    this.scene.add(this.root)

    this._createLights()
    this._createMoon()
    this._createSculpture()
    this._createOrbiters()
    this._createRings()
    this._createParticles()

    this._onResize = this._resize.bind(this)
    this._onPointer = this._pointer.bind(this)
    window.addEventListener('resize', this._onResize)
    window.addEventListener('pointermove', this._onPointer)
    this._resize()

    this.renderer.setAnimationLoop((timestamp) => this._tick(timestamp))
  }

  setProgress(value) {
    this.targetProgress = clamp(value, 0, 1)
  }

  _createLights() {
    this.ambient = new THREE.AmbientLight(0x2a2d38, 0.7)
    this.scene.add(this.ambient)

    this.key = new THREE.DirectionalLight(0xf3e6d4, 1.15)
    this.key.position.set(2.4, 5.2, 4.2)
    this.scene.add(this.key)

    this.accent = new THREE.PointLight(ACCENT, 12, 18, 2)
    this.accent.position.set(-2.8, 0.4, 2.4)
    this.scene.add(this.accent)

    this.fill = new THREE.PointLight(0x8aa0c8, 5, 16, 2)
    this.fill.position.set(3.2, -1.4, -2)
    this.scene.add(this.fill)
  }

  _createMoon() {
    const geo = new THREE.SphereGeometry(3.6, 48, 48)
    const mat = new THREE.MeshStandardMaterial({
      color: MOON,
      emissive: 0x1c1812,
      roughness: 1,
      metalness: 0,
    })
    this.moon = new THREE.Mesh(geo, mat)
    this.moon.position.set(-7.4, 3.6, -14)
    this.scene.add(this.moon)
  }

  _createSculpture() {
    const geo = new THREE.CapsuleGeometry(0.72, 1.55, 8, 20)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x14161c,
      metalness: 0.58,
      roughness: 0.38,
      envMapIntensity: 0.7,
    })
    this.core = new THREE.Mesh(geo, mat)
    this.core.rotation.z = Math.PI / 2.4
    this.root.add(this.core)

    const wireGeo = new THREE.IcosahedronGeometry(1.7, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: PAPER,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    this.wire = new THREE.Mesh(wireGeo, wireMat)
    this.root.add(this.wire)

    const innerGeo = new THREE.OctahedronGeometry(0.55, 0)
    const innerMat = new THREE.MeshStandardMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.4,
    })
    this.ember = new THREE.Mesh(innerGeo, innerMat)
    this.root.add(this.ember)
  }

  _createOrbiters() {
    this.orbiters = new THREE.Group()
    this.root.add(this.orbiters)

    const shapes = [
      new THREE.TetrahedronGeometry(0.18, 0),
      new THREE.OctahedronGeometry(0.16, 0),
      new THREE.DodecahedronGeometry(0.15, 0),
    ]

    for (let i = 0; i < 9; i += 1) {
      const geo = shapes[i % shapes.length]
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? ACCENT : PAPER,
        metalness: 0.5,
        roughness: 0.35,
        emissive: i % 3 === 0 ? ACCENT : 0x000000,
        emissiveIntensity: i % 3 === 0 ? 0.25 : 0,
      })
      const mesh = new THREE.Mesh(geo, mat)
      const angle = (i / 9) * Math.PI * 2
      const radius = 2.35 + (i % 3) * 0.18
      mesh.userData = { angle, radius, speed: 0.18 + (i % 4) * 0.05 }
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 0.55, Math.sin(angle) * radius)
      this.orbiters.add(mesh)
    }
  }

  _createRings() {
    this.rings = new THREE.Group()
    this.root.add(this.rings)

    for (let i = 0; i < 3; i += 1) {
      const geo = new THREE.TorusGeometry(2.1 + i * 0.38, 0.008, 16, 128)
      const mat = new THREE.MeshBasicMaterial({
        color: i === 1 ? ACCENT : PAPER,
        transparent: true,
        opacity: 0.16,
      })
      const ring = new THREE.Mesh(geo, mat)
      ring.rotation.x = Math.PI / 2 + i * 0.18
      ring.rotation.y = i * 0.3
      this.rings.add(ring)
    }
  }

  _createParticles() {
    const count = 1400
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      const r = 3.2 + Math.random() * 7.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62
      positions[i * 3 + 2] = r * Math.cos(phi)
      scales[i] = 0.35 + Math.random() * 1.6
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.particleUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(PAPER) },
      uAccent: { value: new THREE.Color(ACCENT) },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        varying float vScale;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.22 + position.x * 0.35) * 0.16;
          p.x += cos(uTime * 0.14 + position.z * 0.2) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aScale * (170.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vScale = aScale;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAccent;
        varying float vScale;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.08, d);
          vec3 color = mix(uColor, uAccent, smoothstep(0.5, 1.6, vScale));
          gl_FragColor = vec4(color, alpha * 0.78);
        }
      `,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  _pointer(event) {
    this.targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1
    this.targetPointer.y = (event.clientY / window.innerHeight) * 2 - 1
  }

  _resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  _tick(timestamp) {
    if (this.disposed) return
    this.timer.update(timestamp)
    const elapsed = this.timer.getElapsed()
    this.progress = lerp(this.progress, this.targetProgress, 0.06)
    this.pointer.x = lerp(this.pointer.x, this.targetPointer.x, 0.06)
    this.pointer.y = lerp(this.pointer.y, this.targetPointer.y, 0.06)

    const p = this.progress
    this.particleUniforms.uTime.value = elapsed

    this.root.rotation.y = elapsed * 0.045 + p * 1.15
    this.root.rotation.x = Math.sin(elapsed * 0.1) * 0.08 + p * 0.22
    this.wire.rotation.y = -elapsed * 0.1
    this.ember.rotation.x = elapsed * 0.32
    this.ember.rotation.z = elapsed * 0.18
    this.core.rotation.y = elapsed * 0.06
    this.core.scale.setScalar(1 + Math.sin(elapsed * 0.55) * 0.02 + p * 0.12)
    if (this.moon) {
      this.moon.rotation.y = elapsed * 0.02
      this.moon.position.y = 3.6 + Math.sin(elapsed * 0.18) * 0.12
    }

    this.orbiters.children.forEach((mesh) => {
      const { radius, speed } = mesh.userData
      mesh.userData.angle += 0.004 * speed
      mesh.position.x = Math.cos(mesh.userData.angle) * radius
      mesh.position.z = Math.sin(mesh.userData.angle) * radius
      mesh.position.y = Math.sin(mesh.userData.angle * 1.6 + elapsed) * (0.45 + p * 0.4)
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.013
    })

    this.rings.children.forEach((ring, index) => {
      ring.rotation.z = elapsed * (0.05 + index * 0.02)
      ring.material.opacity = 0.08 + p * 0.22
    })

    const camZ = 8.8 - p * 2.1
    const camY = 0.05 + Math.sin(p * Math.PI) * 0.42
    this.camera.position.x = lerp(this.camera.position.x, this.pointer.x * 0.38, 0.045)
    this.camera.position.y = lerp(this.camera.position.y, camY - this.pointer.y * 0.2, 0.045)
    this.camera.position.z = lerp(this.camera.position.z, camZ, 0.045)
    this.camera.lookAt(0, 0.1, 0)

    this.accent.intensity = 10 + Math.sin(elapsed * 0.9) * 2 + p * 6
    this.accent.position.x = -2.8 + Math.sin(elapsed * 0.28) * 0.45
    this.scene.fog.density = 0.024 + p * 0.01

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    this.renderer.setAnimationLoop(null)
    this.timer.disconnect()
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('pointermove', this._onPointer)
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach((mat) => mat.dispose())
        else object.material.dispose()
      }
    })
    this.renderer.dispose()
  }
}
