'use strict';

const electron = require('electron');
const app = require('app');
const BrowserWindow = require('browser-window');
const ipcMain = require('electron').ipcMain;

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 500
  });

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipcMain.on('changePage', function (event, arg) {
    mainWindow.loadURL('file://' + __dirname + '/app/' + arg);
});
