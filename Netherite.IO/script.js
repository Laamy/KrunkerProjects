// ==UserScript==
// @name         Netherite.IO
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Netherite rewritten for .IO games (Krunker edition)
// @author       yeemi<3#9764
// @match        *://krunker.io/*
// @match        *://*.browserfps.com/*
// @match        *://browserfps.com/*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@latest/build/three.min.js
// ==/UserScript==

const modules = []; // modules array
const espBoxes = []; // ESP Boxes

const btnArray = []; // UI Elements
const labArray = [];
const panelArray = [];

const tempVector = new THREE.Vector3();
const entityLoop = new THREE.Object3D();
entityLoop.rotation.order = 'YXZ';

const geometry = new THREE.CylinderGeometry(5, 5, 20, 64);
const material = new THREE.MeshLambertMaterial({ color: 'red', depthTest: false, renderOrder: Infinity, transparent: true, opacity: 0.25, });

// UI Library
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

// Module Library
function addModule(name, desc, keybind, category, enabled) {
	
	let moduleArray = [];
	moduleArray.push(name);
	moduleArray.push(desc);
	moduleArray.push(keybind);
	moduleArray.push(category);
	moduleArray.push(enabled);
	
	modules.push(moduleArray);
	
}
function getModuleByName(name) {
	
	for (let i = 0; i < modules.length; i ++)
	{
		let moduleArray = modules[i];
		
		if (moduleArray[0] == name)
		{
			return moduleArray;
		}
	}
	
}

addModule("TestModule", "Module used for testing", 0x07, "Misc", false);

let testModule = getModuleByName("TestModule");

createLab(255, 0, testModule[1], "transparent");