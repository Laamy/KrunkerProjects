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

const btnArray = [];
const labArray = [];

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

createLab(500, 500 - 24, "Press this button :D", "transparent");

createBtn(500, 500, "Press me please >.<", "white", function() {
	alert("test");
});
