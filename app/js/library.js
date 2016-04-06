'use strict';

/* Set the background-color of <body> element - only set the R, G and B components */
var initColor = "rgba(217,217,238,XXX)";

var fadeInDelay = 0;
var fadeOutDelay = 110;
var valueChange = 0.08;

function setColorAlpha(colorString, alpha) {
  var stringArray = colorString.split(',');
  var newColorString = stringArray[0] + "," + stringArray[1] + "," + stringArray[2] + "," + alpha + ")";
  return newColorString = "background-color: " + newColorString;
}

/* If a browser doesn't have "requestAnimationFrame" function use old version - "setTimeout" */
if (!window.requestAnimationFrame) {
    window. requestAnimationFrame = function (fn) {
        var timer = 16.66; // 60 fps
        setTimeout(fn,timer);
    }
}

function fadeOut(element, changeColor) {
    var opacity = 1;
    var alpha = 1;
    function decrease () {
        opacity -= valueChange;
        alpha -= valueChange;
        if (changeColor) {
          element.setAttribute('style', setColorAlpha(initColor, alpha));
        }
        if (opacity <= 0){
            element.style.opacity = 0;
            return true;
        }
        element.style.opacity = opacity;
        requestAnimationFrame(decrease);
    }
    decrease();
}

function fadeIn(element, changeColor) {
    var opacity = 0;
    var alpha = 0;
    function increase () {
        opacity += valueChange;
        alpha += valueChange;
        if (changeColor) {
          element.setAttribute('style', setColorAlpha(initColor, alpha));
        }
        if (opacity >= 1){
            element.style.opacity = 1;
            return true;
        }
        element.style.opacity = opacity;
        requestAnimationFrame(increase);
    }
    increase();
}

function climbUpDOM(elem, selector) {
// Build path from DOM 'elem' up and return true if it includes 'selector'.
// Based on jquery closest() function.
    var firstChar = selector.charAt(0);
    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        // If selector is a class
        if ( firstChar === '.' ) {
            if ( elem.classList.contains( selector.substr(1) ) ) {
                return elem;
            }
        }
        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( elem.id === selector.substr(1) ) {
                return elem;
            }
        }
        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                return elem;
            }
        }
        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }
    }
    return false;
};

module.exports = {
  fadeOut: fadeOut,
  fadeOutDelay: fadeOutDelay,
  fadeIn: fadeIn,
  fadeInDelay: fadeInDelay,
  climbUpDOM: climbUpDOM
}
