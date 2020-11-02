//Notes
///SELECT StationMAC, COUNT(StationMAC) FROM CapturedMAC GROUP BY StationMAC HAVING COUNT(StationMAC) > 1;  Frequency
const fs = require('fs');
const express = require("express");
const mysql = require("mysql");
const app = new express();
const cors = require('cors')
const http = require('http').createServer(app);
const csv = require('csv-parser');
  var convert= require('xml2json');
const { exec } = require("child_process");
const io = require('socket.io')(http);
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const ch = require('child_process');
const file = '/dev/ttyACM0';
const parser = new parsers.Readline({
  delimiter: '\r\n'
});
const port = new SerialPort(file, {
  baudRate: 4800
});
const GPS = require('./node_modules/gps/gps.js');
const gps = new GPS;
const prev = {lat: null, lon: null};
const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
const dbInfo = {
  host: "localhost",
  user: "root",
  password: "",
  database: "testDbmDB"
};
const conn = mysql.createConnection(dbInfo);
const hosts = ['10.10.10.153'];

// hosts.forEach(function (host) {
//     ping.promise.probe(host)
//         .then(function (res) {
//             console.log(res.alive);
//         });
// });

const worldArt2 =".. . . . . . . . . . . . . . . . . . . BRAVO . . . . . . .\n"+
".. . . . . . . .#######. . . . . . . . . . . . . . . . . .\n"+
".. . . . . . .#. .#### . . . ####. . .###############. . .\n"+
".. . ########. ##. ##. . . ######################### . . .\n"+
".. . . ##########. . . . ######################. . . . . .\n"+
".. . . .######## . . . .   ################### . . . . . .\n"+
".. . . . ### .   . . . .#####. ##############. # . . . . .\n"+
".. . . . . ##### . . . .#######. ##########. . . . . . . .\n"+
".. . . . . .###### . . . .#### . . . . .## . . . . . . . .\n"+
".. . . . . . ##### . . . .#### # . . . . . ##### . . . . .\n"+
".. . . . . . ### . . . . . ##. . . . . . . . ### .#. . . .\n"+
".. . . . . . ##. . . . . . . . . . . . . . . . . . . . . .\n"+
".. . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
port.pipe(parser);
gps.state.bearing = 0;
parser.on('data', function(data) {
  gps.update(data);
});
var parseString = require('xml2js').parseString;

app.use(express.static('public'));
app.all("/",serveIndex);
app.get("/getGPS",getGPS);
app.get("/getScan",getScan);
http.listen(3000, process.env.IP,startHandler());
/// APP FUNCTIONS BELOW
function startHandler() {
  console.log(worldArt2);
  console.log("\x1b[33m","T" + "\x1b[31m","rilateral ",
              "\x1b[33m","A" + "\x1b[31m","ccess",
              "\x1b[33m","P" + "\x1b[31m","oint",
              "\x1b[33m","P" + "\x1b[31m","ositioning",
              "\x1b[33m","S" + "\x1b[31m","ystem",
              "\x1b[34m","is online\n\n");




// MK2
  // io.on('connection', function (socket) {
  //     socket.on('ping', function (data) {
  //         var ping = ch.spawn('ping', [data]);
  //         ping.stdout.on("data", function (data) {
  //             socket.emit("pong", data.toString());
  //         });
  //
  //     });
  // });
  gps.on('data', function() {
      if (prev.lat !== null && prev.lon !== null) {
        gps.state.bearing = GPS.Heading(prev.lat, prev.lon, gps.state.lat, gps.state.lon);
      }
      console.log(gps.state);
      io.emit('state', gps.state);
      prev.lat = gps.state.lat;
      prev.lon = gps.state.lon;
      ;
    });
}
//// MK1
function serveIndex(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {'Content-Type': 'text/html'});
  var index = fs.readFileSync('index2.html');
  res.end(index);
}
function writeResult(res, object) {
  res.writeHead(200, {"Content-Type" : "application/json"});
  res.end(JSON.stringify(object));
}


// function macPower(this_csv){
//   for (var i=5; i<this_csv[0].length-1; i++){
//     if(this_csv[0][i]['0'] != (undefined || NaN || 'Station MAC' || 'BSSID') && this_csv[0][i]['3'] != (undefined || NaN) && i % 14 != 0){
//       m = Math.pow( 10,( 20 - (20 * Math.log10(2417)) + Math.abs(parseInt(this_csv[0][i][3]) )) / 20 );
//       m = roundAccurately((m * 3.281 ),2);
//       mac = this_csv[0][i]['0'];
//       seen = this_csv[0][i]['1'];
//       strength = this_csv[0][i]['3'];
//       distance = m;
//     }
//   }
// }
// function insertData(this_mac,this_op,this_seen,this_strength,this_distance){
//   let data = {StationMAC: this_mac,Op:this_op, LastTimeSeen: this_seen, SignalStrength:this_strength,CalcDistanceFt:this_distance};
//   let sql = "INSERT INTO CapturedMAC SET ?";
//   conn.query(sql, data);
// };

function getGPS(req,res,){
  res.setHeader('Access-Control-Allow-Origin', '*');
  writeResult(res, {StationID: 'BRAVO',LAT:gps.state.lat,LON:gps.state.lon });
}

function getScan(req,res,){

  // fs.readFile( '../test1-01.kismet.netxml', function(err, data) {
  //   var result1 = convert.xml2json(data, {compact: true, spaces: 4});
  //   // var result2 = convert.xml2json(data, {compact: false, spaces: 4});
  //   // console.log(result1);
  //
  //  });
   fs.readFile( 'blazerTest-01.kismet.netxml', function(err, data) {
    var json = convert.toJson(data);
    var this_json = JSON.parse(json);
    var clients = [];

    for (var i in this_json['detection-run']['wireless-network'])
      if(this_json['detection-run']['wireless-network'][i]['type'] = "push")
      clients.push(this_json['detection-run']['wireless-network'][i]);
    writeResult(res, {clients : clients, length : clients.length});
 });

}