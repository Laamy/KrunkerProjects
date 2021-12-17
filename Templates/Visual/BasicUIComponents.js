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

const padDivArray = [];

function createPaddedDiv(x, y, sx, sy, color){
	var panelTest = document.createElement('div');
	
	panelTest.style.backgroundColor = color;
	panelTest.style.position = 'absolute';
	
	panelTest.style.padding = 50 + 'px';
	
	panelTest.style.height = sy;
	panelTest.style.width = sx;
	panelTest.style.left = x + 'px';
	panelTest.style.top = y + 'px';
	
	padDivArray.push(panelTest);
	document.body.appendChild(panelTest);
};

createPaddedDiv(500, 500 - 24, 1000, 1000, "red");
