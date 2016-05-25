'use strict';

const funLib = require('../app/js/library');
const ipcRenderer = require('electron').ipcRenderer;

var btnLogin = document.getElementById("btnLogin");
var btnHome = document.getElementById("btnHome");
var contentContainer = document.getElementById("contentContainer");

function vertCenter(obj,objProperty) {
    obj.style[objProperty] = (window.innerHeight - obj.clientHeight)/2 + "px";
}

window.addEventListener("resize", function() {
    vertCenter(contentContainer, 'margin-top');
    vertCenter(contentContainer, 'margin-bottom');
});

vertCenter(contentContainer, 'margin-top');
vertCenter(contentContainer, 'margin-bottom');

window.onload = function() {
  setTimeout(function() {
    funLib.fadeIn(bodyTag, true);
  }, funLib.fadeInDelay);
}

btnHome.addEventListener('click', function () {
    funLib.fadeOut(bodyTag, true);
    setTimeout(function() {
      ipcRenderer.send('changePage', 'home.html');
    }, funLib.fadeOutDelay);
});
