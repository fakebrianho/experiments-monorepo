import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import { PARAMS, pane, orbit } from './controls'
// import loadModels from './loadModels'
import { resize } from './eventListeners'
import initFbo from './initFBOModels'
import background from './background'
import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'

studio.initialize()
let fbo, time, canvas, model, group
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
})

const scene = new THREE.Scene()
const clock = new THREE.Clock()

init()
function init() {
	renderer.setSize(sizes.width, sizes.height)
	renderer.setClearColor(0x000000, 0)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
	canvas = renderer.domElement
	canvas.classList.add('webgl')
	document.body.appendChild(canvas)
	document.body.appendChild(renderer.domElement)
	resize(camera, renderer, sizes)
	orbit(camera, renderer)
	group = new THREE.Group()
	scene.add(group)
	// model = loadModels(group, scene)
	// scene.environment = model.env
	// scene.environment.mapping = THREE.EquirectangularReflectionMapping
	add()
}

async function add() {
	fbo = await initFbo(renderer)
	// fbo.particles.rotation.set(-Math.PI / 2, 0, 0)
	fbo.particles.scale.set(0.1, 0.1, 0.1)
	fbo.particles.position.set(0, -1, 0)
	const bg = background()
	scene.add(bg)
	group.add(fbo.particles)
	// scene.add(fbo.particles)
	theatre()
	animate()
}

function theatre() {
	/**
	 * Theatre.js
	 */

	//create project
	const project = getProject('fboMorph')

	// Create a sheet
	const sheet = project.sheet('Animated scene')

	const myFBO = sheet.object('Torus Knot', {
		// Note that the rotation is in radians
		// (full rotation: 2 * Math.PI)
		rotation: types.compound({
			x: types.number(fbo.particles.rotation.x, { range: [-2, 2] }),
			y: types.number(fbo.particles.rotation.y, { range: [-2, 2] }),
			z: types.number(fbo.particles.rotation.z, { range: [-2, 2] }),
		}),
	})
	myFBO.onValuesChange((values) => {
		const { x, y, z } = values.rotation
		fbo.particles.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI)
	})
	console.log(studio)
}

function animate() {
	requestAnimationFrame(animate)
	time = clock.getElapsedTime()
	// fbo.particles.rotation.x += 0.01
	// fbo.particles.rotation.y += 0.005
	// fbo.particles.rotation.z -= 0.012
	fbo.renderMaterial.uniforms.uPointSize.value = PARAMS.particleSize
	fbo.renderMaterial.uniforms.uOpacity.value = PARAMS.opacity
	fbo.simulationMaterial.uniforms.uCurlFreq.value = PARAMS.curl
	fbo.simulationMaterial.uniforms.uSpeed.value = PARAMS.particleSpeed
	fbo.update(time)
	renderer.render(scene, camera)
}
