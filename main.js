'use strict';

const electron = require('electron');
const app = require('app');
const BrowserWindow = require('browser-window');
const ipcMain = require('electron').ipcMain;
const pg = require('pg');

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

pg.defaults.ssl = true;
pg.connect(DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
