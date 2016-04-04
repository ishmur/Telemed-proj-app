'use strict';

// Get the modal
var modalLogin = document.getElementById("modalLogin");
var modalDialogLogin = document.getElementsByClassName("modal-dialog")[0];
var btnLogin = document.getElementById("btnLogin");
var btnCancelLogin = document.getElementById("cancelLogin");
var spanCloseLogin = document.getElementsByClassName("close")[0];

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
