'use strict';

function fadeOut(element) {
    var opacity = 1;
    function decrease () {
        opacity -= 0.05;
        if (opacity <= 0){
            // complete
            element.style.opacity = 0;
            return true;
        }
        element.style.opacity = opacity;
        requestAnimationFrame(decrease);
    }
    decrease();
}

function fadeIn(element) {
    var opacity = 0;
    function increase () {
        opacity += 0.05;
        if (opacity >= 1){
            // complete
            element.style.opacity = 1;
            return true;
        }
        element.style.opacity = opacity;
        requestAnimationFrame(increase);
    }
    increase();
}

module.exports = {
  fadeOut: fadeOut,
  fadeIn: fadeIn
}
