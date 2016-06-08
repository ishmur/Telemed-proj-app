'use strict';

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const ipcMain = require('electron').ipcMain;
const pg = require('pg');
const squel = require("squel");

var mainWindow = null;


// Handle squirrel events (auto-update, setup.exe, etc)

if (require('electron-squirrel-startup')) return;
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};


// Render window

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800
  });

  mainWindow.loadURL('file://' + __dirname + '/home.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipcMain.on('changePage', function (event, arg) {
    mainWindow.loadURL('file://' + __dirname + '/' + arg);
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});


// Databse connection

const dbConfigFile = require('./js/db');

var DATABASE_URL = dbConfigFile.DATABASE_URL;

function getDatetimeString(){
  var time = new Date();
  var timeString = time.getFullYear() +"-"+ (1+time.getMonth()) +"-"+ time.getDate() +" "+ time.getHours() +":"+ time.getMinutes() +":"+ time.getSeconds() +"UTC";
  return timeString;
}

ipcMain.on('insert', function (event, arg) {

  var statusInfo;
  // Get a Postgres client from the connection pool
  pg.defaults.ssl = true;
  pg.connect(DATABASE_URL, function(err, client, done) {

    // Handle connection errors
    if(err) {
      statusInfo = "failure";
      mainWindow.webContents.send('status', statusInfo);
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
          statusInfo = "failure";
          mainWindow.webContents.send('status', statusInfo);
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
          query = client.query(queryText, function(err, result){
            if(err) {
              statusInfo = "failure";
              mainWindow.webContents.send('status', statusInfo);
              done();
              console.log(err);
            }
          });
        };
      });
    }

      // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      statusInfo = "success";
      mainWindow.webContents.send('status', statusInfo);
    });

  })
});
