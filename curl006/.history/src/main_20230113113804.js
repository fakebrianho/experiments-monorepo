import './style.css'
import * as THREE from 'three'
import { sizes, camera } from './camera'
import { PARAMS, pane, orbit } from './controls'
import loadModels from './loadModels'
import { resize } from './eventListeners'
import initFbo from './initFBO'
import background from './background'
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
	add()
	scene.add(group)
	// model = loadModels(group, scene)
	// scene.environment = model.env
	// scene.environment.mapping = THREE.EquirectangularReflectionMapping
	animate()
}

function add() {
	fbo = initFbo(renderer)
	const bg = background()
	scene.add(bg)
	scene.add(fbo.particles)
}

function animate() {
	requestAnimationFrame(animate)
	time = clock.getElapsedTime()
	fbo.particles.rotation.x += 0.01
	fbo.particles.rotation.y += 0.005
	fbo.particles.rotation.z -= 0.012
	fbo.renderMaterial.uniforms.uPointSize.value = PARAMS.particleSize
	fbo.renderMaterial.uniforms.uOpacity.value = PARAMS.opacity
	fbo.simulationMaterial.uniforms.uCurlFreq.value = PARAMS.curl
	fbo.simulationMaterial.uniforms.uSpeed.value = PARAMS.particleSpeed
	fbo.update(time)
	renderer.render(scene, camera)
	// scene.children[2]
	console.log(Math.abs(Math.sin(time) * 3) + 5)
	// if (scene.children[2]) {
	// console.log((scene.children[2].scale.x *= Math.abs(Math.sin(time) * 2)))
	// scene.children[2].scale.x = Math.abs(Math.sin(time) * 3) + 5
	// scene.children[2].scale.y = Math.abs(Math.sin(time) * 3) + 5
	// scene.children[2].scale.z = Math.abs(Math.sin(time) * 3) + 5
	// }
	// console.log(scene.children[2])
}
