// ==UserScript==
// @name         Debugging Trero.IO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  testing shit
// @author       yaami<3
// @match        *://krunker.io/*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// ==/UserScript==

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

createPanel(500, 500, 50, 100, "red");
