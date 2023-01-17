import simVertex from '/@/shaders/simulationVert.glsl'
import simFragment from '/@/shaders/simulationFrag.glsl'
import particlesFragment from '/@/shaders/particlesFragment.glsl'
import particlesVertex from '/@/shaders/particlesVertex.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import FBO from './FBO'
import { getRandomSpherePoint } from './getRandomSpherePoint'
import {
	DataTexture,
	ShaderMaterial,
	AdditiveBlending,
	RGBAFormat,
	FloatType,
	Group,
} from 'three'
import * as THREE from 'three'
const envLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(
	'https://www.gstatic.com/draco/versioned/decoders/1.4.3/'
)
gltfLoader.setDRACOLoader(dracoLoader)
let temp, group, sampler, sampler2

export default async function initFbo(renderer) {
	let returner
	const [{ scene: gltfScene }, env] = await Promise.all([
		/*
		Author: glenatron (https://sketchfab.com/glenatron)
		License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
		Source: https://sketchfab.com/3d-models/gelatinous-cube-e08385238f4d4b59b012233a9fbdca21
		Title: Gelatinous Cube
		*/
		new Promise((res) => {
			// gltfLoader.load('/human_heart.glb', res)
			gltfLoader.load('/skull.glb', res)
			// gltfLoader.load('./japanese_maple_tree.glb', res)
		}),
		new Promise((res) => {
			envLoader.load(
				'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr',
				res
			)
		}),
	])
	const [{ scene: gltfScene2 }] = await Promise.all([
		/*
		Author: glenatron (https://sketchfab.com/glenatron)
		License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
		Source: https://sketchfab.com/3d-models/gelatinous-cube-e08385238f4d4b59b012233a9fbdca21
		Title: Gelatinous Cube
		*/
		new Promise((res) => {
			// gltfLoader.load('/human_heart.glb', res)
			gltfLoader.load('/human_heart.glb', res)
			// gltfLoader.load('./japanese_maple_tree.glb', res)
		}),
	])
	// gltfScene.position.set(0, 4, 0)
	let heart = gltfScene2.getObjectByName('Object_5')
	let skull = gltfScene.getObjectByName('Skull001_default_0')
	sampler = new MeshSurfaceSampler(skull).build()
	sampler2 = new MeshSurfaceSampler(heart).build()
	// sampler.scale.set(4, 4, 4)
	// sampler = new MeshSurfaceSampler(skull.)
	// gltfScene.traverse((obj) => {
	// 	if (obj.isMesh) {
	// 		sampler = new MeshSurfaceSampler(obj).build()
	// 	}
	// })
	const fboWidth = 256
	const fboHeight = 256
	let length = fboWidth * fboHeight * 4
	let data = new Float32Array(length)
	let heartData = new Float32Array(length)
	for (let i = 0; i < length; i += 4) {
		let heartPosition = new THREE.Vector3()
		sampler2.sample(heartPosition)
		heartData[i + 0] = heartPosition.x
		heartData[i + 1] = heartPosition.y
		heartData[i + 2] = heartPosition.z
		heartData[i + 3] = 1.0
		let newPosition = new THREE.Vector3()
		sampler.sample(newPosition)
		data[i + 0] = newPosition.x
		data[i + 1] = newPosition.y
		data[i + 2] = newPosition.z
		data[i + 3] = 1.0
	}
	const positions = new DataTexture(
		data,
		fboWidth,
		fboHeight,
		RGBAFormat,
		FloatType
	)
	positions.needsUpdate = true

	const heartPositions = new DataTexture(
		heartData,
		fboWidth,
		fboHeight,
		RGBAFormat,
		FloatType
	)
	heartPositions.needsUpdate = true

	let simulationMaterial = new ShaderMaterial({
		vertexShader: simVertex,
		fragmentShader: simFragment,
		uniforms: {
			positions: { value: positions },
			heartPositions: { value: heartPositions },
			uTime: { value: 0 },
			uSpeed: { value: 3.0 },
			uCurlFreq: { value: 0.55 },
			currData: { value: 0 },
		},
	})
	let renderMaterial = new ShaderMaterial({
		vertexShader: particlesVertex,
		fragmentShader: particlesFragment,
		uniforms: {
			positions: { value: positions },
			// heartPositions: { value: heartData },
			uTime: { value: 0 },
			uPointSize: { value: 1.4 },
			uOpacity: { value: 0.55 },
			currData: { value: 1 },
		},
		transparent: true,
		blending: AdditiveBlending,
	})
	const fbo = new FBO(
		fboWidth,
		fboHeight,
		renderer,
		simulationMaterial,
		renderMaterial
	)
	return fbo
}

// export default async function initFbo(scene, renderer) {
// 	group = new THREE.Group()
// 	scene.add(group)
// 	temp = await loadModels(group, scene)
// 	// Set up the FBO
// 	const fboWidth = 256
// 	const fboHeight = 256
// 	let length = fboWidth * fboHeight * 4
// 	let data = new Float32Array(length)
// 	for (let i = 0; i < length; i += 4) {
// 		// Random positions inside a sphere
// 		const point = getRandomSpherePoint()
// 		// data[i + 0] = temp[i]
// 		// data[i + 1] = temp[i + 1]
// 		// data[i + 2] = temp[i + 2]
// 		// data[i + 3] = 1.0
// 		// data[i + 0] = temp[i.
// 		// data[i + 1] = point.y
// 		// data[i + 2] = point.z
// 		// data[i + 3] = 1.0
// 		// data[i * 3] = temp[i]
// 		// data[i * 3 + 1] = temp[i + 1]
// 		// data[i * 3 + 2] = temp[i + 2]
// 		// data[i * 3 + 3] = 1.0
// 	}
// 	// Convert the data to a FloatTexture
// 	const positions = new DataTexture(
// 		data,
// 		fboWidth,
// 		fboHeight,
// 		RGBAFormat,
// 		FloatType
// 	)
// 	positions.needsUpdate = true
// 	let simulationMaterial = new ShaderMaterial({
// 		vertexShader: simVertex,
// 		fragmentShader: simFragment,
// 		uniforms: {
// 			positions: { value: positions },
// 			uTime: { value: 0 },
// 			uSpeed: { value: 3.0 },
// 			uCurlFreq: { value: 0.55 },
// 		},
// 	})
// 	let renderMaterial = new ShaderMaterial({
// 		vertexShader: particlesVertex,
// 		fragmentShader: particlesFragment,
// 		uniforms: {
// 			positions: { value: null },
// 			uTime: { value: 0 },
// 			uPointSize: { value: 1.4 },
// 			uOpacity: { value: 0.55 },
// 		},
// 		transparent: true,
// 		blending: AdditiveBlending,
// 	})
// 	const fbo = new FBO(
// 		fboWidth,
// 		fboHeight,
// 		renderer,
// 		simulationMaterial,
// 		renderMaterial
// 	)
// 	return fbo
// 	// scene.add(fbo.particles)
// }

function transferMesh() {
	const fboWidth = 256
	const fboHeight = 256
	let length = fboWidth * fboHeight * 4
	let data = new Float32Array(length)
	for (let i = 0; i < length; i += 4) {
		let newPosition = new THREE.Vector3()
		sampler.sample(newPosition)
		data[i + 0] = newPosition.x
		data[i + 1] = newPosition.y
		data[i + 2] = newPosition.z
		data[i + 3] = 1.0
		// data.set([newPosition.x, newPosition.y, newPosition.z, 1.0], i * 4)
	}
	const positions = new DataTexture(
		data,
		fboWidth,
		fboHeight,
		RGBAFormat,
		FloatType
	)
	positions.needsUpdate = true
	let simulationMaterial = new ShaderMaterial({
		vertexShader: simVertex,
		fragmentShader: simFragment,
		uniforms: {
			positions: { value: positions },
			uTime: { value: 0 },
			uSpeed: { value: 3.0 },
			uCurlFreq: { value: 0.55 },
		},
	})
	let renderMaterial = new ShaderMaterial({
		vertexShader: particlesVertex,
		fragmentShader: particlesFragment,
		uniforms: {
			positions: { value: null },
			uTime: { value: 0 },
			uPointSize: { value: 1.4 },
			uOpacity: { value: 0.55 },
		},
		transparent: true,
		blending: AdditiveBlending,
	})
	const fbo = new FBO(
		fboWidth,
		fboHeight,
		renderer,
		simulationMaterial,
		renderMaterial
	)
}
