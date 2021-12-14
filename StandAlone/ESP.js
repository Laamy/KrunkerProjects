// ==UserScript==
// @name         Trero.IO
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  ESP & Aimbot
// @author       yaami<3
// @match        *://krunker.io/*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@latest/build/three.min.js
// ==/UserScript==

const obj3d = new THREE.Object3D();
obj3d.rotation.order = 'YXZ';

const geometry = new THREE.CylinderGeometry(5, 5, 20, 64);
const material = new THREE.MeshLambertMaterial({ color: 'red', });

material.wireframe = true;
material.depthTest = false;
material.opacity = 0.25;
material.transparent = true;
material.renderOrder = 255

const espBoxes = [];
let scene;

let espKeybind = 'X'
let espActive = true;

WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {
	apply(target, thisArgs, args) {
		if (args[0].type === 'Scene' && args[0].name === 'Main') { scene = args[0]; }
		return Reflect.apply(...arguments);
	}
} );

function animate() {
	window.requestAnimationFrame(animate);
	if (scene === undefined) { return; }

	const players = [];
	let localPlr;

	for (let i = 0; i < scene.children.length; i ++) {
		const child = scene.children[ i ];
		if (child.type === 'Object3D') {
			try {
				if ( child.children[0].children[0].type === 'PerspectiveCamera' ) { localPlr = child; } else { players.push(child); }
			} catch (err) {}
		}
	}

	if (players.length < 2) { return; }

	for (let i = 0; i < players.length; i ++) {

		const player = players[i];

		if (player.position.x === localPlr.position.x && player.position.z === localPlr.position.z) { continue; }

		if (player.firstTime !== true) {
			const mesh = new THREE.Mesh(geometry, material);
			mesh.visible = false;
			mesh.position.y = 10;
			espBoxes.push(mesh);
			player.add(mesh);
			player.firstTime = true;
		}
	}
}
animate();

window.addEventListener('keydown', function(event) {
	if (String.fromCharCode(event.keyCode) === espKeybind) {
		espActive = !espActive;
	}
});

setInterval(function(){ // Update ESP Hitboxes
    for (let i = 0; i < espBoxes.length; i ++) {
		espBoxes[i].visible = espActive;
	}
}, 1000);
