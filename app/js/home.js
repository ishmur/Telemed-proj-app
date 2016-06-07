'use strict';

const funLib = require('../app/js/library');
const ipcRenderer = require('electron').ipcRenderer;
const {dialog} = require('electron').remote;
const squel = require("squel");

var btnHome = document.getElementById("btnHome");
var bodyTag = document.getElementById("bodyTag");

var fileDataArray = [];
var formButton = document.getElementById("form-submit");
var headerLength = 4;


// Window fadeIn / fadeOut on load

window.onload = function() {
  setTimeout(function() {
    funLib.fadeIn(bodyTag, true);
  }, funLib.fadeInDelay);
}


// Read file data

function formatUploadData(file){
  var fileInfo = {};
  var fileTextStringArray = file.split("\n");

  // Header - Exam information
  var headerString = fileTextStringArray[0];
  var headerArray = headerString.split(",");
  var headerHash = {};
  headerHash['patient'] = headerArray[0].trim();
  headerHash['activity'] = headerArray[1].trim();
  headerHash['first_name'] = headerArray[2].trim();
  headerHash['last_name'] = headerArray[3].trim();
  fileInfo['header'] = headerHash;

  // Data - Samples
  var samplesArray = [];
  for (var index in fileTextStringArray){
    if (index < 2) continue; // skip header rows
    var rowText = fileTextStringArray[index].trim();
    if (rowText === "") continue; // skip empty rows
    var rowHash = {};
    rowText = rowText.split("\t");
    rowHash['time'] = rowText[0];
    rowHash['ax'] = rowText[1];
    rowHash['ay'] = rowText[2];
    rowHash['az'] = rowText[3];
    samplesArray.push(rowHash);
  }
  fileInfo['data'] = samplesArray;

  fileDataArray.push(fileInfo);
}

 function handleFileSelect(evt) {

   var files = evt.target.files; // files is a FileList of File objects
   var output = [];
   fileDataArray = [];

   document.getElementById('fileList').innerHTML = ''; // clear when file upload was cancelled
   enableFormButton(false);

   for (var i = 0, f; f = files[i]; i++) {

     var errorCounter = 0;
     var reader = new FileReader();
     var fileBegining = "";
     var headerString = "";

     reader.onload = (function(theFile) {

       return function(e) {
         fileBegining = e.target.result;
         headerString = fileBegining.substring(0, fileBegining.indexOf("\n"));

         if (headerString.split(",").length == headerLength) {
           formatUploadData(fileBegining);
           output.push(
               '<li>',
               '<strong>', theFile.name, '</strong>  - ' + headerString,
               '</li>');
           document.getElementById('fileList').innerHTML = '<ul>' + output.join('') + '</ul>';
         } else {
           errorCounter++;
           output.push(
               "<li class='text-danger'>",
               '<strong>', theFile.name, '</strong>  - ' + 'plik zawiera nieprawidłowy format danych',
               '</li>');
           document.getElementById('fileList').innerHTML = '<ul>' + output.join('') + '</ul>';
         }

         if (errorCounter){
           enableFormButton(false);
         }
         else {
           enableFormButton(true);
         }
       };
     })(f);

     reader.readAsText(f);
   }
 }

function enableFormButton(actionBool){
  if(actionBool){
    formButton.disabled = false;
    formButton.value = "Zapisz";
    formButton.classList.remove("btn-danger");
    formButton.classList.add("btn-steel-blue");
  }
  else {
    formButton.disabled = true;
    formButton.value = "Zapis niemożliwy";
    formButton.classList.remove("btn-steel-blue");
    formButton.classList.add("btn-danger");
  }
}


 function handleDragOver(evt) {
   evt.stopPropagation();
   evt.preventDefault();
 }

 window.addEventListener('dragover', handleDragOver, false);
 window.addEventListener('drop', handleDragOver, false);
 document.getElementById('new_exam').addEventListener('change',handleFileSelect,false);



 formButton.addEventListener('click', function () {
   console.log(fileDataArray);
    ipcRenderer.send('insert', fileDataArray);
 });
