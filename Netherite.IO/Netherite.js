// ==UserScript==
// @name         Trero.IO
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  ESP & Aimbot
// @author       yaami<3
// @match        *://krunker.io/*
// @match        *://*.browserfps.com/*
// @match        *://browserfps.com/*
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

//material.wireframe = true;

material.depthTest = false;
material.renderOrder = Infinity;

material.transparent = true;
material.opacity = 0.25;

const espBoxes = [];
let isActive = true;
let scene;

let aimbotKeybind = 'F'
let aimbotActive = false;

let espKeybind = 'V'
let espActive = false;

let xrayKeybind = 'X'
let xrayActive = false;

let chamsKeybind = 'C'
let chamsActive = false;

const btnArray = [];
const labArray = [];
const panelArray = [];

function createPanel(x, y, sx, sy, color){
	var panelTest = document.createElement('div'); // panel
	panelTest.style.backgroundColor = color;
	panelTest.style.position = 'absolute';
	panelTest.style.padding = sx + 'px ' + sy + 'px';
	panelTest.style.left = x + 'px';
	panelTest.style.top = y + 'px';
	panelArray.push(panelTest);
	document.body.appendChild(panelTest);
};

function createBtn(x, y, text, color, onPressed){
	var buttonTest = document.createElement('button');
	buttonTest.style.position = 'absolute';
	buttonTest.style.width = 100;
	buttonTest.style.height = 100;
	buttonTest.onclick = onPressed;
	buttonTest.style.backgroundColor = color;
	buttonTest.innerHTML = text;
	buttonTest.style.top = y + 'px';
	buttonTest.style.left = x + 'px';
	btnArray.push(buttonTest);
	document.body.appendChild(buttonTest);
};

function createLab(x, y, text, color){
	var labelTest = document.createElement('div');
	labelTest.style.position = 'absolute';
	labelTest.style.width = 100;
	labelTest.style.height = 100;
	labelTest.style.backgroundColor = color;
	labelTest.innerHTML = text;
	labelTest.style.top = y + 'px';
	labelTest.style.left = x + 'px';
	labArray.push(labelTest);
	document.body.appendChild(labelTest);
};

let posX = 255;
let posY = 0;

createLab(posX, posY + (24 * 0), "Netherite.IO", "transparent"); // title
createLab(posX, posY + (24 * 1), "Aimbot [" + aimbotKeybind + "] [" + aimbotActive + "]", "transparent");
createLab(posX, posY + (24 * 2), "ESP [" + espKeybind + "] [" + espActive + "]", "transparent");
createLab(posX, posY + (24 * 3), "XRay [" + xrayKeybind + "] [" + xrayActive + "]", "transparent");
//createLab(posX, posY + (24 * 3), "XRay [" + xrayKeybind + "] [" + xrayActive + "]", "transparent");
createLab(posX, posY + (24 * 4), "Chams [" + chamsKeybind + "] [" + chamsActive + "]", "transparent");

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
		const child = scene.children[i];
		if (child.type === 'Object3D') {
			try {
				if ( child.children[0].children[0].type === 'PerspectiveCamera' ) { localPlr = child; } else { players.push(child); }
			} catch (err) {}
		}
		else if (child.type === 'Mesh') {
			if (xrayActive == true) {
				child.material.transparent = true;
				child.material.opacity = 0.25;
			}
			else {
				child.material.transparent = false;
				child.material.opacity = 1;
			}
		}
		else if (child.type === 'StaticMesh') {
			child.type = 'Mesh'; // static objects fix (This took hours)
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
	//tempVector.testStr = "hello world";
	//labArray[0].innerHTML = targetPlayer.children[0].children[0].originalMat;

	if (tempVector != undefined) {
		targetPlayer.children[0].children[4].children[0].localToWorld(tempVector);
	}

	entityLoop.position.copy(localPlr.position);

	entityLoop.lookAt(tempVector);

	if (aimbotActive == true){
		localPlr.children[0].rotation.x = -entityLoop.rotation.x; // 0.04 is the sweet spot for aimbot
		localPlr.rotation.y = entityLoop.rotation.y + Math.PI;
	}

	if (chamsActive == true) {
		for (let p1 = 0; p1 < targetPlayer.children[0].children.length; p1++) {
			if (targetPlayer.children[0].children[p1].originalMat == undefined){
				targetPlayer.children[0].children[p1].originalMat = targetPlayer.children[0].children[p1].material;
			}

			targetPlayer.children[0].children[p1].material = material;
		}//Legs

		for (let p1 = 0; p1 < targetPlayer.children[0].children[4].children.length; p1++) {
			if (targetPlayer.children[0].children[4].children[p1].originalMat == undefined){
				targetPlayer.children[0].children[4].children[p1].originalMat = targetPlayer.children[0].children[4].children[p1].material;
			}

			targetPlayer.children[0].children[4].children[p1].material = material;
		}//Torso/Head

		for (let p1 = 0; p1 < targetPlayer.children[0].children[4].children[2].children[0].children.length; p1++) {
			if (targetPlayer.children[0].children[4].children[2].children[0].children[p1].originalMat == undefined){
				targetPlayer.children[0].children[4].children[2].children[0].children[p1].originalMat = targetPlayer.children[0].children[4].children[2].children[0].children[p1].material;
			}

			targetPlayer.children[0].children[4].children[2].children[0].children[p1].material = material;
		}//ArmModels
	}
	else {
		for (let p1 = 0; p1 < targetPlayer.children[0].children.length; p1++) {
			if (targetPlayer.children[0].children[p1].originalMat == undefined) continue;
			targetPlayer.children[0].children[p1].material = targetPlayer.children[0].children[p1].originalMat;
		}//Legs

		for (let p1 = 0; p1 < targetPlayer.children[0].children[4].children.length; p1++) {
			if (targetPlayer.children[0].children[4].children[p1].originalMat == undefined) continue;
			targetPlayer.children[0].children[4].children[p1].material = targetPlayer.children[0].children[4].children[p1].originalMat;
		}//Torso/Head

		for (let p1 = 0; p1 < targetPlayer.children[0].children[4].children[2].children[0].children.length; p1++) {
			if (targetPlayer.children[0].children[4].children[2].children[0].children[p1].originalMat == undefined) continue;
			targetPlayer.children[0].children[4].children[2].children[0].children[p1].material = targetPlayer.children[0].children[4].children[2].children[0].children[p1].originalMat;
		}//ArmModels
	}
}

animate();

window.addEventListener('keydown', function(event) {
	if (String.fromCharCode(event.keyCode) === aimbotKeybind) {
		labArray[1].innerHTML = "Aimbot [" + aimbotKeybind + "] [" + aimbotActive + "]"; // Update Aimbot

		aimbotActive = !aimbotActive;
	}
	if (String.fromCharCode(event.keyCode) === espKeybind) {
		labArray[2].innerHTML = "ESP [" + espKeybind + "] [" + espActive + "]"; // Update ESP

		espActive = !espActive;
		for (let i = 0; i < espBoxes.length; i ++) {
			espBoxes[i].visible = espActive;
		}
	}
	if (String.fromCharCode(event.keyCode) === xrayKeybind) {
		xrayActive = !xrayActive;
		labArray[3].innerHTML = "XRay [" + xrayKeybind + "] [" + xrayActive + "]";
	}
	if (String.fromCharCode(event.keyCode) === chamsKeybind) {
		chamsActive = !chamsActive;
		labArray[4].innerHTML = "Chams [" + chamsKeybind + "] [" + chamsActive + "]";
	}
});

setInterval(function(){ // Update ESP Hitboxes
    for (let i = 0; i < espBoxes.length; i ++) {
		espBoxes[i].visible = espActive;
	}
}, 50);// 20 tps update