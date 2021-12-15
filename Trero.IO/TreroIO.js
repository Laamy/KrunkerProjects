// ==UserScript==
// @name         Trero.IO
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  ESP Aimbot & XRay ALSO DONT FORGET TO JOIN OUR DISCORD ! https://discord.gg/FtT2nRvczq
// @author       yaami<3
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

const targetGeometry = new THREE.TorusGeometry(10, 0.5, 15, 100); // new THREE.CylinderGeometry(5, 5, 20, 64);
const targetGmaterial = new THREE.MeshLambertMaterial({
	color: 'red',
});

material.wireframe = false;
material.depthTest = false;
material.opacity = 0.50;
material.transparent = true;
material.renderOrder = Infinity;

const espBoxes = [];
let isActive = true;
let scene;

let aimbotKeybind = 'F'
let aimbotActive = false;

let espKeybind = 'V'
let espActive = false;

let xrayKeybind = 'X'
let xrayActive = false;

let bhopKeybind = 'C'
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

var xrayText = document.createElement('div');
xrayText.style.position = 'absolute';
xrayText.style.width = 100;
xrayText.style.height = 100;
xrayText.style.backgroundColor = "transparent";
xrayText.innerHTML = "XRay [" + xrayKeybind + "] [" + !xrayActive + "]";
xrayText.style.top = (200 - (24 * 2)) + 'px';
xrayText.style.left = 'px';
document.body.appendChild(xrayText);

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

	let localPlr;

	for (let i = 0; i < scene.children.length; i ++) {
		const child = scene.children[ i ];
		if (child.type === 'Object3D') {
			try {
				if ( child.children[0].children[0].type === 'PerspectiveCamera' ) { localPlr = child; } else { players.push(child); }
			} catch (err) {}
		}
		else if (child.type === 'Mesh') {
			if (xrayActive) {
				child.material.transparent = true;
				child.material.opacity = 0.6;
			}
			else {
				child.material.transparent = false;
				child.material.opacity = 1;
			}
		}
		else if (child.type === 'StaticMesh') {
			child.type = 'Mesh';
		}
	}

	if (players.length < 2) {
		return;
	}

	let targetPlayer;
	let minDistance = Infinity;

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

		const distance = player.position.distanceTo(localPlr.position);

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

	entityLoop.position.copy(localPlr.position);

	entityLoop.lookAt(tempVector);

	if (aimbotActive){
		localPlr.children[0].rotation.x = -entityLoop.rotation.x; // 0.04 is the sweet spot for aimbot
		localPlr.rotation.y = entityLoop.rotation.y + Math.PI;
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
	if (String.fromCharCode(event.keyCode) === xrayKeybind) {
		xrayActive = !xrayActive;
		xrayText.innerHTML = "XRay [" + xrayKeybind + "] [" + !xrayActive + "]";
	}
});

setInterval(function(){ // Update ESP Hitboxes
    for (let i = 0; i < espBoxes.length; i ++) {
		espBoxes[i].visible = espActive;
	}
}, 1000);
