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

function printTable(outputNode, stringArray, startingIndex, endingIndex, delimiterType){
  var tableObject = document.createElement('table');
  var tableHeadObject = document.createElement('thead');
  var tableBodyObject = document.createElement('tbody');
  var divObject = document.createElement('div');

  tableObject.classList.add("table");
  tableObject.classList.add("table-hover");

  // Create table header
  var outputDiv = outputNode.appendChild(divObject);
  var tableHandle = outputDiv.appendChild(tableObject);
  var tableHeadHandle = tableHandle.appendChild(tableHeadObject);

  var tableRowArray = stringArray[startingIndex].trim();
  tableRowArray = tableRowArray.split(delimiterType);
  var tableRow = tableHeadHandle.insertRow(0);
  for (var tableElementIterator in tableRowArray){
    tableRowArray[tableElementIterator] = tableRowArray[tableElementIterator].trim();
    var tableElement = tableRow.insertCell(tableElementIterator);
    tableElement.innerHTML = tableRowArray[tableElementIterator];
  }

  // Fill table with data
  var tableDataHandle = tableHandle.appendChild(tableBodyObject);
  var rowNumber = 0;

  var dataArray = new Array();

  for (var i=startingIndex+1; i < endingIndex; i++){
    tableRowArray = stringArray[i].trim();
    if(tableRowArray === ""){
      continue;
    }
    tableRowArray = tableRowArray.split(delimiterType);
    tableRow = tableDataHandle.insertRow(rowNumber);
    for (tableElementIterator in tableRowArray){
      tableRowArray[tableElementIterator] = tableRowArray[tableElementIterator].trim();
      tableElement = tableRow.insertCell(tableElementIterator);
      tableElement.innerHTML = tableRowArray[tableElementIterator];
    }
    rowNumber++;
    tableRowArray = tableRowArray.map(function(x) {
      return parseInt(x);
    });
    dataArray.push(tableRowArray);
  }
  return dataArray;
}

// Read file from input or drag

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  if(typeof evt.dataTransfer != 'undefined'){
    var files = evt.dataTransfer.files; // if drag
  } else{
    var files = evt.target.files; // if input
  }

  var outputDiv = document.getElementById("output");

  while (outputDiv.firstChild) {
    outputDiv.removeChild(outputDiv.firstChild);
  }

  var reader = new FileReader();

  reader.onloadend = function(event) {


    var fileStringArray = this.result.split("\n");

    printTable(outputDiv, fileStringArray, 0, 2, ",");
    var dataArray = printTable(outputDiv, fileStringArray, 2, fileStringArray.length, "\t");
    drawChart(dataArray);
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



// Print chart

google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);

function prepareChartData(dataArray){
  var dataX = new google.visualization.DataTable();
  var dataY = new google.visualization.DataTable();
  var dataZ = new google.visualization.DataTable();

  var numRows = dataArray.length;

  dataX.addColumn('number', 'Time');
  dataX.addColumn('number', 'X-Axis Acceleration');

  for (var i = 0; i < numRows; i++){
    dataX.addRow([dataArray[i][0],dataArray[i][1]]);
  }

  dataY.addColumn('number', 'Time');
  dataY.addColumn('number', 'Y-Axis Acceleration');

  for (var i = 0; i < numRows; i++){
    dataY.addRow([dataArray[i][0],dataArray[i][2]]);
  }

  dataZ.addColumn('number', 'Time');
  dataZ.addColumn('number', 'Z-Axis Acceleration');

  for (var i = 0; i < numRows; i++){
    dataZ.addRow([dataArray[i][0],dataArray[i][2]]);
  }

  var data = [dataX, dataY, dataZ];

  return data;
}

function drawChart(dataArray) {

  var data = prepareChartData(dataArray);

  var options = {
    title: 'Dane z akcelerometru - os X',
    hAxis: {title: 'Czas [us]'},
    vAxis: {title: 'Przyspieszenie [a.u.]'},
    legend: 'none',
    backgroundColor: 'transparent',
    explorer: {
            //actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 10.0},
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(data[1], options);
}
