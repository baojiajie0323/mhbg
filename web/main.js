var child_process = require('child_process')
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Tray = require('tray');
const net = require('net');
const path = require('path');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Make sure only one app instance is running.
const pipePath = path.join('\\\\?\\pipe', __filename);

const server = net.createServer(function(c) {
	console.log('client connected');

	c.on('end', function() {
		console.log('client disconnected');

		if (mainWindow) {
			mainWindow.focus();
		}
	});
});

server.listen(pipePath);

server.on('error', function(err) {
	console.log(err);

	// Connect to the running instance, make its window active.
	const client = net.connect(pipePath, function() {
		client.end();
		app.quit();
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
var appIcon = null;
app.on('ready', function() {

  // Create the browser window.
  var atomScreen = require('screen');
  var size = atomScreen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    title:"智能验收称重系统",
    width: size.width,
    height: size.height,
    "web-preferences":{
      "web-security":false,
      plugins: true
    },
    frame:false,
  });
  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/src/dist/index.html');
  //mainWindow.loadUrl('http://localhost:8989');

  // Open the devtools.
  //mainWindow.openDevTools();
  mainWindow.setMenuBarVisibility(false);
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

app.on('logoff', function(){
  app.quit();
})

app.on('min', function(){
  mainWindow.minimize();
})

app.on('callCmd', function(data) {
  var cmd = `start "" ${data.cmd} ${data.param.join(' ')}`
  console.log(`callCmd: ${cmd}`)
  child_process.exec(cmd)
})

app.on('notify',function(data){
  appIcon.displayBalloon(data);
})

app.on('export',function(data){
  data.conf.cols.forEach(function(c) {
    c.beforeCellWrite = function(row, cellData, eOpt){
                console.log('excel',row, cellData, eOpt);
                eOpt.styleIndex = 2;
                return cellData;
            }
  })

  var result = nodeExcel.execute(data.conf);
  var fs = require('fs');
  fs.writeFileSync(data.filename, result, 'binary');
})

app.on('tabtip',function(){
  var fs = require('fs');
  var file = "C:\\Program Files\\Common Files\\microsoft shared\\ink\\tabtip.exe";
  fs.exists(file, function(exists) {
    if (exists) {
        // child_process.exec(`start "" "C:\\Program Files\\Common Files\\microsoft shared\\ink\\tabtip.exe" ""`);
      } else {
        // mongodb
      }
  });
})
