// ==UserScript==
// @name         UI Library created for Trero.IO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UI Library
// @author       yaami<3
// @match        *://krunker.io/*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// ==/UserScript==

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

createPanel(500, 500, 28, 105, "grey");

createLab(500, 500, "Press this button :D", "transparent");

createBtn(500, 500 + 24, "Press me please >.<", "white", function() {
	alert("test");
});
