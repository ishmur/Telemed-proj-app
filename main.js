'use strict';

const electron = require('electron');
const app = require('app');
const BrowserWindow = require('browser-window');
const ipcMain = require('electron').ipcMain;
const pg = require('pg');
const squel = require("squel");

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800
  });

  mainWindow.loadURL('file://' + __dirname + '/app/home.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipcMain.on('changePage', function (event, arg) {
    mainWindow.loadURL('file://' + __dirname + '/app/' + arg);
});

// Databse connection

const dbConfigFile = require('./app/js/db');

var DATABASE_URL = dbConfigFile.DATABASE_URL;

function getDatetimeString(){
  var time = new Date();
  var timeString = time.getFullYear() +"-"+ (1+time.getMonth()) +"-"+ time.getDate() +" "+ time.getHours() +":"+ time.getMinutes() +":"+ time.getSeconds() +"UTC";
  return timeString;
}

ipcMain.on('insert', function (event, arg) {

  // Get a Postgres client from the connection pool
  pg.defaults.ssl = true;
  pg.connect(DATABASE_URL, function(err, client, done) {

    // Handle connection errors
    if(err) {
      done();
      console.log(err);
    }

    for (var index in arg){
      var currentTime = getDatetimeString();
      arg[index]['header']['created_at'] = currentTime;
      arg[index]['header']['updated_at'] = currentTime;

      // SQL Query > Insert Data
      var queryText = squel.insert()
                                    .into("exams")
                                    .setFieldsRows([
                                      arg[index]['header']
                                    ])
                                    .toString();
      queryText += "RETURNING id";
      var query;

      query = client.query(queryText, function(err, result){
        if(err) {
          done();
          console.log(err);
        } else {
          var newlyCreatedUserId = result.rows[0].id;
          var samplesArray = arg[index]['data'];
          for (var rowIndex in samplesArray){
            samplesArray[rowIndex]['exam_id'] = newlyCreatedUserId;
            samplesArray[rowIndex]['created_at'] = currentTime;
            samplesArray[rowIndex]['updated_at'] = currentTime;
          }
          queryText = squel.insert()
                                    .into("samples")
                                    .setFieldsRows(
                                      samplesArray
                                    )
                                    .toString();
          query = client.query(queryText);
        }
      });
    }

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
    });

  })
});
