'use strict';

const fadeLib = require('../app/js/fading');
const ipcRenderer = require('electron').ipcRenderer;

var btnHome = document.getElementById("btnHome");
var bodyTag = document.getElementById("bodyTag");
var divNav = document.getElementById("myNavbar");
var btnNav = document.getElementsByClassName("navbar-toggle")[0];

window.onload = function() {
  setTimeout(function() {
    fadeLib.fadeIn(bodyTag, true);
  }, fadeLib.fadeInDelay);
}

btnHome.addEventListener('click', function() {
  fadeLib.fadeOut(bodyTag, true);
  setTimeout(function() {
    ipcRenderer.send('changePage', 'index.html');
  }, fadeLib.fadeOutDelay);
});

btnNav.addEventListener('click', function() {
  divNav.classList.toggle("show");
});

window.onclick = function(event) {
    if (event.target == divNav) {
        divNav.classList.remove("show");
    }
};
