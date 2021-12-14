// ==UserScript==
// @name         Trero.IO
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  ESP
// @author      yaami<3
// @match        *://krunker.io/*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@latest/build/three.min.js
// ==/UserScript==

const tempVector = new THREE.Vector3();
const entityLoop = new THREE.Object3D();

entityLoop.rotation.order = 'YXZ';

const geometry = new THREE.CylinderGeometry(5, 5, 20, 64);
const material = new THREE.MeshLambertMaterial({
	color: 'red',
});

material.wireframe = true;
material.depthTest = false;
material.opacity = 0.25;
material.transparent = true;
material.renderOrder = 255

const espBoxes = [];
let isActive = true;
let scene;

let aimbotKeybind = 'F'
let aimbotActive = false;

let espKeybind = 'X'
let espActive = true; // I wanna make nametags

let bhopKeybind = 'V'
let bhopActive = false;

var aimbotText = document.createElement('div');
aimbotText.style.position = 'absolute';
aimbotText.style.width = 100;
aimbotText.style.height = 100;
aimbotText.style.backgroundColor = "transparent";
aimbotText.innerHTML = "Aimbot [" + aimbotKeybind + "] [" + !aimbotActive + "]";
aimbotText.style.top = 200 + 'px';
aimbotText.style.left = 'px';
document.body.appendChild(aimbotText);

var espText = document.createElement('div');
espText.style.position = 'absolute';
espText.style.width = 100;
espText.style.height = 100;
espText.style.backgroundColor = "transparent";
espText.innerHTML = "ESP [" + espKeybind + "] [" + !espActive + "]";
espText.style.top = (200 - 24) + 'px';
espText.style.left = 'px';
document.body.appendChild(espText);

WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {
	apply(target, thisArgs, args) {
		if (args[0].type === 'Scene' && args[0].name === 'Main') {
			scene = args[0];
		}
		return Reflect.apply(...arguments);
	}
} );

function animate() {
	window.requestAnimationFrame(animate);
	if (isActive === false || scene === undefined) {
		return;
	}

	const players = [];

	let myPlayer;

	for (let i = 0; i < scene.children.length; i ++) {
		const child = scene.children[ i ];
		if (child.type === 'Object3D') {
			try {
				if ( child.children[0].children[0].type === 'PerspectiveCamera' ) { myPlayer = child; } else { players.push(child); }
			} catch (err) {}
		}
	}

	if (players.length < 2) {
		return;
	}

	let targetPlayer;
	let minDistance = Infinity;

	for (let i = 0; i < players.length; i ++) {

		const player = players[i];

		if (player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z) { continue; }

		if (player.firstTime !== true) {
			const mesh = new THREE.Mesh(geometry, material);
			mesh.visible = false;
			mesh.position.y = 10;
			espBoxes.push(mesh);
			player.add(mesh);
			player.firstTime = true;
		}

		const distance = player.position.distanceTo(myPlayer.position);

		if (distance < minDistance) {
			targetPlayer = player;
			minDistance = distance;
		}
	}

	if (targetPlayer === undefined) {
		return;
	}

	tempVector.setScalar(0);

	targetPlayer.children[0].children[0].localToWorld(tempVector);

	entityLoop.position.copy(myPlayer.position);

	entityLoop.lookAt(tempVector);

	if (aimbotActive){
		myPlayer.children[0].rotation.x = -entityLoop.rotation.x; // 0.04 is the sweet spot for aimbot
		myPlayer.rotation.y = entityLoop.rotation.y + Math.PI;
	}
}

animate();

window.addEventListener('keydown', function(event) {
	if (String.fromCharCode(event.keyCode) === espKeybind) {
		espText.innerHTML = "ESP [" + espKeybind + "] [" + !espActive + "]"; // Update ESP
		
		espActive = !espActive;
		for (let i = 0; i < espBoxes.length; i ++) {
			espBoxes[i].visible = espActive;
		}
	}
	if (String.fromCharCode(event.keyCode) === aimbotKeybind) {
		aimbotText.innerHTML = "Aimbot [" + aimbotKeybind + "] [" + !aimbotActive + "]"; // Update Aimbot
		
		aimbotActive = !aimbotActive;
	}
	if (String.fromCharCode(event.keyCode) === bhopKeybind) {
		bhopActive = !bhopActive;
	}
});

setInterval(function(){ // Update ESP Hitboxes
    for (let i = 0; i < espBoxes.length; i ++) {
		espBoxes[i].visible = espActive;
	}
}, 1000);
