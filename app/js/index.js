'use strict';

// Get the modal
var modal = document.getElementById("myModal");
var modalDialog = document.getElementsByClassName("modal-dialog")[0];
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

function resizeModal() {
  modalDialog.style['margin-top'] = (window.innerHeight - modalDialog.clientHeight)/2 + "px";
}

// When the user clicks the button, open the modal
window.onload = function() {
    modal.style.display = "block";
    resizeModal();
}

window.addEventListener("resize", resizeModal);

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
