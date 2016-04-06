'use strict';

const funLib = require('../app/js/library');
const ipcRenderer = require('electron').ipcRenderer;

var btnHome = document.getElementById("btnHome");
var bodyTag = document.getElementById("bodyTag");
var divNav = document.getElementById("myNavbar");
var btnNav = document.getElementsByClassName("navbar-toggle")[0];

window.onload = function() {
  setTimeout(function() {
    funLib.fadeIn(bodyTag, true);
  }, funLib.fadeInDelay);
}

btnHome.addEventListener('click', function() {
  funLib.fadeOut(bodyTag, true);
  setTimeout(function() {
    ipcRenderer.send('changePage', 'index.html');
  }, funLib.fadeOutDelay);
});

btnNav.addEventListener('click', function(event) {
  divNav.classList.toggle("show");
});

window.onclick = function(event) {
  // Function hiding the dropdown menu when clicked outside of its area
  if (!funLib.climbUpDOM(event.target, "#myNavbar") && !funLib.climbUpDOM(event.target, ".navbar-toggle")) {
    divNav.classList.remove("show");
  }
}
