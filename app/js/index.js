'use strict';

// Get the modal
var modalLogin = document.getElementById("myModal-login");
var modalDialogLogin = document.getElementsByClassName("modal-dialog")[0];
var btnLogin = document.getElementById("myBtn-login");
var span = document.getElementsByClassName("close")[0];

function resizeModal(modajDialogObj) {
  modajDialogObj.style['margin-top'] = (window.innerHeight - modajDialogObj.clientHeight)/2 + "px";
}

// When the user clicks the button, open the modal
btnLogin.onclick = function() {
    modalLogin.style.display = "block";
    resizeModal(modalDialogLogin);
}

window.addEventListener("resize", resizeModal(modalDialogLogin));

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modalLogin.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modalLogin.style.display = "none";
    }
}
