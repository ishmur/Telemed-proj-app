'use strict';

const funLib = require('../app/js/library');
const ipcRenderer = require('electron').ipcRenderer;
const {dialog} = require('electron').remote;

var btnHome = document.getElementById("btnHome");
var bodyTag = document.getElementById("bodyTag");



// Window fadeIn / fadeOut on load

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



// Read file from input or drag

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  if(typeof evt.dataTransfer != 'undefined'){
    var files = evt.dataTransfer.files; // if drag
  } else{
    var files = evt.target.files; // if input
  }

  var reader = new FileReader();

  reader.onloadend = function(event) {
    var tableObject = document.createElement('table');
    var tableBodyObject = document.createElement('tbody');
    tableObject.classList.add("table");
    tableObject.classList.add("table-hover");
    var divObject = document.createElement('div');

    var fileStringArray = this.result.split("\n");

    var headerDiv = document.getElementById("output").appendChild(divObject);
    headerDiv.innerHTML += "<h3>Naglowek pliku</h3>";
    for (var i=0; i != 3; i++){
      var headerText = fileStringArray[i] + "<br>";
      headerDiv.innerHTML += headerText;
    }

    var tableHandle = headerDiv.appendChild(tableObject);
    tableHandle = tableHandle.appendChild(tableBodyObject);

    for (i=3; i != 5; i++){
      var tableRowArray = fileStringArray[i].trim();
      tableRowArray = tableRowArray.split("\t");
      var tableRow = tableHandle.insertRow(i-3);
      for (var tableElementIterator in tableRowArray){
        var tableElement = tableRow.insertCell(tableElementIterator);
        tableElement.innerHTML = tableRowArray[tableElementIterator];
      }
    }
  };

  reader.readAsText(files[0]);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'send';
}

window.addEventListener('dragover', handleDragOver, false);
window.addEventListener('drop', handleFileSelect, false);
document.getElementById('file').addEventListener('change',handleFileSelect,false);
