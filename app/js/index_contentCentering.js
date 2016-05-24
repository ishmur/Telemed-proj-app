'use strict';

var contentContainer = document.getElementById("contentContainer");

function vertCenter(obj,objProperty) {
    obj.style[objProperty] = (window.innerHeight - obj.clientHeight)/2 + "px";
}

window.addEventListener("resize", function() {
    vertCenter(contentContainer, 'margin-top');
});

vertCenter(contentContainer, 'margin-top');
