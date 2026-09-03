import "./variation.css"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { Reflector } from "three/examples/jsm/objects/Reflector"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

const canvas = document.querySelector(".modern-webgl")
const loaderElement = document.querySelector(".loader")
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x010308)
scene.fog = new THREE.FogExp2(0x010308, 0.06)

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 140)
camera.position.set(5.9, 2.25, 7.6)

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, powerPreference: "high-performance" })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.88
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.38, 0.55, 0.16)
composer.addPass(bloom)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 5.5
controls.maxDistance = 10
controls.minPolarAngle = Math.PI / 4.4
controls.maxPolarAngle = Math.PI / 2.05
const setCameraLayout = () => {
  if (window.innerWidth <= 700) {
    camera.position.set(7.8, 2.15, 11.5)
    controls.target.set(-0.8, 0.52, -0.45)
    return
  }

  camera.position.set(5.9, 2.25, 7.6)
  controls.target.set(-0.55, 0.55, -0.45)
}

setCameraLayout()

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
pmrem.dispose()

scene.add(new THREE.HemisphereLight(0x5c8ca0, 0x04070d, 0.9))
const keyLight = new THREE.DirectionalLight(0xcbeeff, 1.7)
keyLight.position.set(4, 6, 5)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(1024, 1024)
scene.add(keyLight)

const cyanLight = new THREE.SpotLight(0x67d8ff, 22, 20, 0.6, 0.8, 1.7)
cyanLight.position.set(-5, 4, -3)
cyanLight.target.position.set(0, 0, 0)
scene.add(cyanLight, cyanLight.target)
const rimLight = new THREE.SpotLight(0x8ea5ff, 38, 20, 0.55, 0.75, 1.8)
rimLight.position.set(4, 2.5, 4)
rimLight.target.position.set(0, 0.4, 0)
scene.add(rimLight, rimLight.target)

const tunnel = new THREE.Group()
scene.add(tunnel)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8.2, 110, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x030912, metalness: 0.88, roughness: 0.28 })
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
tunnel.add(floor)

const reflectionResolution = () => Math.min(Math.round(window.innerWidth * window.devicePixelRatio), 1024)
const trackReflector = new Reflector(new THREE.PlaneGeometry(8.16, 110), {
  clipBias: 0.002,
  color: 0x11151a,
  textureWidth: reflectionResolution(),
  textureHeight: reflectionResolution(),
  encoding: THREE.sRGBEncoding
})
trackReflector.rotation.x = -Math.PI / 2
trackReflector.position.y = 0.016
tunnel.add(trackReflector)

const shoulderMaterial = new THREE.MeshStandardMaterial({ color: 0x06101c, metalness: 0.82, roughness: 0.22 })
for (const x of [-4.55, 4.55]) {
  const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 110), shoulderMaterial)
  shoulder.position.set(x, 0.02, 0)
  shoulder.receiveShadow = true
  tunnel.add(shoulder)
}

const laneMaterial = new THREE.MeshBasicMaterial({ color: 0x67d8ff, transparent: true, opacity: 0.65 })
const laneLights = []
for (let i = 0; i < 36; i++) {
  const segment = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, 0.72), laneMaterial)
  segment.position.set(i % 2 ? -1.6 : 1.6, 0.022, -i * 3.1)
  tunnel.add(segment)
  laneLights.push(segment)
}

const streakMaterial = new THREE.MeshBasicMaterial({
  color: 0xc8f5ff,
  transparent: true,
  opacity: 0.14,
  blending: THREE.AdditiveBlending
})
const speedStreaks = []
for (let i = 0; i < 28; i++) {
  const streak = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.7 + (i % 5) * 0.32), streakMaterial)
  streak.position.set((i % 2 ? -1 : 1) * (2.5 + (i % 6) * 0.52), 0.28 + (i % 7) * 0.2, -i * 2.8)
  tunnel.add(streak)
  speedStreaks.push(streak)
}

const archMaterial = new THREE.MeshBasicMaterial({ color: 0xff5a4d, toneMapped: false })
const arches = []
const archGeometry = new THREE.TorusGeometry(4.3, 0.034, 8, 64, Math.PI)
for (let i = 0; i < 15; i++) {
  const arch = new THREE.Mesh(archGeometry, archMaterial)
  arch.position.set(0, 0, -i * 4.2 - 1.2)
  tunnel.add(arch)
  arches.push(arch)
}

const sculptureMaterial = new THREE.MeshStandardMaterial({ color: 0x17334a, emissive: 0x0b2540, emissiveIntensity: 0.75, metalness: 0.9, roughness: 0.18 })
const sculptures = []
for (let i = 0; i < 42; i++) {
  const sculpture = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), sculptureMaterial)
  const side = i % 2 === 0 ? -1 : 1
  sculpture.position.set(side * (5.2 + ((i * 7) % 18) / 10), 0.6 + ((i * 11) % 19) / 15, -3 - i * 1.8)
  sculpture.scale.setScalar(0.3 + ((i * 13) % 7) / 8)
  sculpture.rotation.set(i * 0.37, i * 0.21, i * 0.13)
  tunnel.add(sculpture)
  sculptures.push(sculpture)
}

let carModel
const carLoader = new GLTFLoader()

const paintCar = (color) => {
  if (!carModel) return
  carModel.traverse((object) => {
    if (object.name === "Main_Chassis_Body_Color_0") {
      object.material.color.set(color)
      object.material.metalness = 0.72
      object.material.roughness = 0.16
      object.material.clearcoat = 1
      object.material.clearcoatRoughness = 0.08
      object.material.needsUpdate = true
    }
  })
}

const setActivePaint = (button) => {
  document.querySelectorAll(".paint-swatch").forEach((swatch) => swatch.classList.toggle("is-active", swatch === button))
  paintCar(button.dataset.color)
}

const swatches = [...document.querySelectorAll(".paint-swatch")]
swatches.forEach((button) => button.addEventListener("click", () => setActivePaint(button)))
document.querySelector("[data-next-color]").addEventListener("click", () => {
  const activeIndex = swatches.findIndex((button) => button.classList.contains("is-active"))
  setActivePaint(swatches[(activeIndex + 1) % swatches.length])
})

const speedModes = {
  slow: { rate: 0.36, fov: 36, bloom: 0.28, streakScale: 0.45 },
  default: { rate: 1, fov: 38, bloom: 0.38, streakScale: 1 },
  fast: { rate: 4.4, fov: 44, bloom: 0.56, streakScale: 3.8 }
}
let selectedSpeed = "default"
let currentRate = speedModes.default.rate
let travel = 0

const setSpeed = (button) => {
  selectedSpeed = button.dataset.speed
  document.querySelectorAll(".speed-button").forEach((speedButton) => {
    const isActive = speedButton === button
    speedButton.classList.toggle("is-active", isActive)
    speedButton.setAttribute("aria-pressed", String(isActive))
  })
}

document.querySelectorAll(".speed-button").forEach((button) => button.addEventListener("click", () => setSpeed(button)))

carLoader.load(
  "/models/2019_chevrolet_corvette_c8_stingray/scene.gltf",
  (gltf) => {
    carModel = gltf.scene
    carModel.scale.setScalar(0.87)
    carModel.position.set(0, 0.05, 0)
    carModel.rotation.y = Math.PI
    carModel.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = true
      object.receiveShadow = true
      object.material.envMapIntensity = 2.1
    })
    paintCar(document.querySelector(".paint-swatch.is-active").dataset.color)
    scene.add(carModel)
    loaderElement.classList.add("is-hidden")
  },
  undefined,
  (error) => {
    console.error("Unable to load the C8", error)
    loaderElement.textContent = "Unable to load the C8"
  }
)

const clock = new THREE.Clock()
const updateLoop = () => {
  const delta = clock.getDelta()
  const elapsed = clock.elapsedTime
  const targetMotion = speedModes[selectedSpeed]
  const targetRate = reducedMotion ? 0 : targetMotion.rate
  currentRate = THREE.MathUtils.damp(currentRate, targetRate, 1.45, delta)
  travel += delta * 2.2 * currentRate
  const valueAtCurrentRate = (slow, standard, fast) => {
    if (currentRate <= speedModes.default.rate) {
      const blend = THREE.MathUtils.clamp(
        (currentRate - speedModes.slow.rate) / (speedModes.default.rate - speedModes.slow.rate),
        0,
        1
      )
      return THREE.MathUtils.lerp(slow, standard, blend)
    }

    const blend = THREE.MathUtils.clamp(
      (currentRate - speedModes.default.rate) / (speedModes.fast.rate - speedModes.default.rate),
      0,
      1
    )
    return THREE.MathUtils.lerp(standard, fast, blend)
  }
  const streakScale = valueAtCurrentRate(speedModes.slow.streakScale, speedModes.default.streakScale, speedModes.fast.streakScale)
  const targetOpacity = reducedMotion ? 0 : valueAtCurrentRate(0.05, 0.14, 0.62)
  const targetBloom = reducedMotion ? 0 : valueAtCurrentRate(speedModes.slow.bloom, speedModes.default.bloom, speedModes.fast.bloom)
  const targetFov = reducedMotion ? 38 : valueAtCurrentRate(speedModes.slow.fov, speedModes.default.fov, speedModes.fast.fov)
  const wrap = (value, length) => ((value % length) + length) % length

  arches.forEach((arch, index) => {
    arch.position.z = -64 + wrap(index * 5.2 - travel, 78)
  })
  laneLights.forEach((light, index) => {
    light.position.z = -88 + wrap(index * 3.1 - travel * 1.45, 112)
  })
  speedStreaks.forEach((streak, index) => {
    streak.position.z = -60 + wrap(index * 4.5 - travel * 1.8, 78)
    streak.scale.z = streakScale
  })
  streakMaterial.opacity += (targetOpacity - streakMaterial.opacity) * 0.08
  bloom.strength += (targetBloom - bloom.strength) * 0.04
  camera.fov += (targetFov - camera.fov) * 0.035
  camera.updateProjectionMatrix()
  sculptures.forEach((sculpture, index) => {
    sculpture.rotation.x += reducedMotion ? 0 : (0.0015 + (index % 3) * 0.0008) * currentRate
    sculpture.position.y += reducedMotion ? 0 : Math.sin(elapsed * 0.9 * currentRate + index) * 0.0012
  })
  if (carModel) {
    carModel.position.y = 0.05 + (reducedMotion ? 0 : Math.sin(elapsed * 1.2) * 0.018)
    carModel.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.65) * 0.006
    carModel.traverse((object) => {
      if (["Front_Right_Wheel", "Front_Left_Wheel", "Rear_Right_Wheel", "Rear_Left_Wheel"].includes(object.name)) object.rotation.x -= reducedMotion ? 0 : 0.08 * currentRate
    })
  }
  controls.update()
  composer.render()
  requestAnimationFrame(updateLoop)
}

window.addEventListener("resize", () => {
  setCameraLayout()
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  composer.setSize(window.innerWidth, window.innerHeight)
  trackReflector.getRenderTarget().setSize(reflectionResolution(), reflectionResolution())
})

updateLoop()
