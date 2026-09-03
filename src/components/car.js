import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/examples/js/libs/draco/")
loader.setDRACOLoader(dracoLoader)

export const loadCar = () =>
  new Promise((resolve, reject) => {
    loader.load(
      // "models/chevrolet-c7/scene.gltf",
      // "models/mclaren_p1/scene.gltf",
      "/models/2019_chevrolet_corvette_c8_stingray/scene.gltf",
      (gltf) => {
        gltf.scene.scale.set(0.85, 0.85, 0.85)
        // gltf.scene.scale.set(0.005, 0.005, 0.005)
        // gltf.scene.position.set(-0.9, -0.05, 2)
        gltf.scene.position.set(0, 0.05, 0)
        gltf.scene.rotation.set(0, Math.PI, 0)
        gltf.scene.traverse((object) => {
          if (object.isMesh) {
            object.material.envMapIntensity = 20
            object.castShadow = true
            object.receiveShadow = true
          }

          if (object.name === "Main_Chassis_Body_Color_0") {
            object.material.color = new THREE.Color(0x520804)
          }
        })

        resolve(gltf)
        dracoLoader.dispose()
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
      },
      (err) => {
        console.error("Error loading model", err)
      }
    )
  })
