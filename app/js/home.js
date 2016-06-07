'use strict';

const funLib = require('../app/js/library');
const ipcRenderer = require('electron').ipcRenderer;
const {dialog} = require('electron').remote;

var btnHome = document.getElementById("btnHome");
var bodyTag = document.getElementById("bodyTag");

var chartData = new Array();
var btnChooseChartArray = document.getElementsByClassName("btn-chart");
var chartRow = document.getElementsByClassName("chart-row")[0];

// Window fadeIn / fadeOut on load

window.onload = function() {
  setTimeout(function() {
    funLib.fadeIn(bodyTag, true);
  }, funLib.fadeInDelay);
}


// Read file from input or drag

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
  }
}

function getFileData(stringArray, startingIndex, endingIndex, delimiterType){
  var dataArray = new Array();

  for (var i=startingIndex+1; i < endingIndex; i++){
    var tableRowArray = stringArray[i].trim();
    if(tableRowArray === ""){
      continue;
    }
    tableRowArray = tableRowArray.split(delimiterType);
    tableRowArray = tableRowArray.map(function(x) {
      return parseInt(x);
    });
    dataArray.push(tableRowArray);
  }
  return dataArray;
}



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
    var dataArray = getFileData(fileStringArray, 2, fileStringArray.length, "\t");
    chartRow.classList.remove("chart-row");
    chartData = prepareChartData(dataArray);
    drawChart(0);
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


function drawChart(currentPlot) {

  switch(currentPlot){
    default:
        currentPlot = 0;
        var emptyData = new google.visualization.DataTable();
        emptyData.addColumn('number', 'Time');
        emptyData.addColumn('number', 'X-Axis Acceleration');
        var options = {
          title: 'Dane z akcelerometru - oś X',
          hAxis: {title: 'Czas [us]'},
          vAxis: {title: 'Przyspieszenie [a.u.]'},
          legend: 'none',
          colors: ['purple'],
          backgroundColor: 'transparent',
          explorer: {
                  axis: 'horizontal',
                  keepInBounds: true,
                  maxZoomIn: 10.0,
                  zoomDelta: 1.3
          },
          series: {
                  0: { enableInteractivity: false } // turn off tooltips
          },
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(emptyData, options);

        return null;

    case 1:
      var options = {
        title: 'Dane z akcelerometru - oś X',
        hAxis: {title: 'Czas [us]'},
        vAxis: {title: 'Przyspieszenie [a.u.]'},
        legend: 'none',
        colors: ['purple'],
        backgroundColor: 'transparent',
        explorer: {
                axis: 'horizontal',
                keepInBounds: true,
                maxZoomIn: 10.0,
                zoomDelta: 1.3
        },
        series: {
                0: { enableInteractivity: false } // turn off tooltips
        },
      };
      break;

    case 2:
      var options = {
        title: 'Dane z akcelerometru - oś Y',
        hAxis: {title: 'Czas [us]'},
        vAxis: {title: 'Przyspieszenie [a.u.]'},
        legend: 'none',
        colors: ['green'],
        backgroundColor: 'transparent',
        explorer: {
                axis: 'horizontal',
                keepInBounds: true,
                maxZoomIn: 10.0,
                zoomDelta: 1.3
        },
        series: {
                0: { enableInteractivity: false } // turn off tooltips
        },
      };
      break;

    case 3:
      var options = {
        title: 'Dane z akcelerometru - oś Z',
        hAxis: {title: 'Czas [us]'},
        vAxis: {title: 'Przyspieszenie [a.u.]'},
        legend: 'none',
        colors: ['blue'],
        backgroundColor: 'transparent',
        explorer: {
                axis: 'horizontal',
                keepInBounds: true,
                maxZoomIn: 10.0,
                zoomDelta: 1.3
        },
        series: {
                0: { enableInteractivity: false } // turn off tooltips
        },
      };
      break;
  }

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(chartData[currentPlot-1], options);
}


btnChooseChartArray[0].onclick = function(){drawChart(1);}
btnChooseChartArray[1].onclick = function(){drawChart(2);}
btnChooseChartArray[2].onclick = function(){drawChart(3);}
