'use strict';

const ipcRenderer = require('electron').ipcRenderer;

var btnLogin = document.getElementById("btnLogin");
var btnCancelLogin = document.getElementById("cancelLogin");
var modalLogin = document.getElementById("modalLogin");
var modalDialogLogin = document.getElementsByClassName("modal-dialog")[0];
var spanCloseLogin = document.getElementsByClassName("close")[0];
var btnHome = document.getElementById("btnHome");

function resizeModal(modajDialogObj) {
  modajDialogObj.style['margin-top'] = (window.innerHeight - modajDialogObj.clientHeight)/2 + "px";
}

window.addEventListener("resize", resizeModal(modalDialogLogin));

btnLogin.onclick = function() {
    modalLogin.style.display = "block";
    resizeModal(modalDialogLogin);
}

spanCloseLogin.onclick = function() {
    modalLogin.style.display = "none";
}

btnCancelLogin.onclick = function() {
    modalLogin.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalLogin) {
        modalLogin.style.display = "none";
    }
}

btnHome.addEventListener('click', function () {
    ipcRenderer.send('changePage', 'home.html');
});
