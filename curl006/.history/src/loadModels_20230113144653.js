import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
const envLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
)
gltfLoader.setDRACOLoader(dracoLoader)

export default async function loadModels(scene, s2) {
	const [{ scene: gltfScene }, env] = await Promise.all([
		/*
		Author: glenatron (https://sketchfab.com/glenatron)
		License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
		Source: https://sketchfab.com/3d-models/gelatinous-cube-e08385238f4d4b59b012233a9fbdca21
		Title: Gelatinous Cube
		*/
		new Promise((res) => {
			gltfLoader.load('/human_heart.glb', res)
		}),
		new Promise((res) => {
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
			// console.log(gltfScene)
		}),
	])

	gltfScene.position.set(0, -0.5, 0)
	const mesh = gltfScene.getObjectByName('Object_5')
	const newMat = new THREE.PointsMaterial({ color: 'red', size: 0.01 })
	const newGeo = mesh.geometry
	const newMesh = new THREE.Points(newGeo, newMat)
	newMesh.scale.set(0.1, 0.1, 0.1)
	newMesh.position.set(0, -1.1, 0)
	s2.environment = env
	s2.environment.mapping = THREE.EquirectangularReflectionMapping
	scene.add(newMesh)
	return newMesh
}
