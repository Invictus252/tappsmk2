var clientModels ={};
var piA=0;
var piB=0;
var piC=0;
var ctr= 0;

const connectionOptions =  {
          "force new connection" : true,
          "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
          "timeout" : 10000, //before connect_error and connect_timeout are emitted.
          "transports" : ["websocket"]
      };

const socket2 = io("10.10.10.153:3000", connectionOptions);
const socket3 = io("10.10.10.159:3000", connectionOptions);
const socket = io();
const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);

socket3.on('state', function(state) {
  updateSBC(state);
});

socket2.on('state', function(state) {
  updateSBA(state);
});

socket.on('state', function(state) {
  updateSBB(state);
});

getTime();

buildClientTable();


function updateSBB(state) {
  latB = state.lat;
  lonB = state.lon;
  $("#date").text(state.time);
  $("#latBRAVO").text(roundNumber(state.lat,8));
  $("#lonBRAVO").text(roundNumber(state.lon,8));
  $("#altBRAVO").text(state.alt);
}

function updateSBC(state) {
  $("#latCHARLIE").text(roundNumber(state.lat,8));
  $("#lonCHARLIE").text(roundNumber(state.lon,8));
  $("#altCHARLIE").text(state.alt);
}

function updateSBA(state) {
  $("#latALPHA").text(roundNumber(state.lat,8));
  $("#lonALPHA").text(roundNumber(state.lon,8));
  $("#altALPHA").text(state.alt);
}

function roundNumber(num, dec) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

function haversine_distance(mk1, mk2) {
        let R = 3958.8; // Radius of the Earth in miles
        let rlat1 = parseFloat(mk1.lat) * (Math.PI/180); // Convert degrees to radians
        let rlat2 = parseFloat(mk2.lat) * (Math.PI/180); // Convert degrees to radians
        let difflat = rlat2-rlat1; // Radian difference (latitudes)
        let difflon = (parseFloat(mk2.lng)-parseFloat(mk1.lng)) * (Math.PI/180); // Radian difference (longitudes)

        let d = (2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2))))*5280;
        return d;
      }

function initMap(){
  $.getJSON("/getGPS", function(data) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 23,
      center: new google.maps.LatLng(42.6974525,-73.11852633),
      mapTypeId: 'terrain'
  });
    piB = {lat: parseFloat(data.LAT), lng: parseFloat(data.LON)};
    let markerB = new google.maps.Marker({position:piB, map: map});
    $.getJSON("http://10.10.10.153:3000/getGPS", function(data2) {
      piA = {lat: parseFloat(data2.LAT), lng: parseFloat(data2.LON)};
      let markerA = new google.maps.Marker({position:piA, map: map});
      $.getJSON("http://10.10.10.159:3000/getGPS",function(data3){
        piC = {lat: parseFloat(data3.LAT), lng: parseFloat(data3.LON)};
        let markerC = new google.maps.Marker({position:piC, map: map});
        let segA = new google.maps.Polyline({path: [piA, piB], map: map});
        let segB = new google.maps.Polyline({path: [piB, piC], map: map});
        let segC = new google.maps.Polyline({path: [piC, piA], map: map});
        const scanA = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: piA,
            radius: 15,
          });
        const scanB = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: piB,
            radius: 15,
          });
        const scanC = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: piC,
            radius: 15,
          });
        const tappsNET = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            // fillColor: "#0000FF",
            fillOpacity: 0,
            map,
            center: piB,
            radius: 30,
          });
        });
      })

  });


}

function buildClientTable(){
  $.getJSON("http://10.10.10.159:3000/getScan", function(data) {
    clientModels.charlie = data.clients;
    $.getJSON("http://10.10.10.153:3000/getScan", function(data) {
      clientModels.alpha = data.clients;
      $.getJSON("/getScan", function(data) {
        clientModels.bravo = data.clients;
        for(var i in clientModels.alpha){
          buildTable(clientModels.alpha[i],"Alpha",[i])
        }
        for(var i in clientModels.bravo){
          buildTable(clientModels.bravo[i],"Bravo",[i])
        }
        for(var i in clientModels.charlie){
          buildTable(clientModels.charlie[i],"Charlie",[i])
        }
      });
    });

  });


function buildTable(data,station,i){
  let m = Math.pow( 10,( 20 - (20 * Math.log10(parseFloat(data['freqmhz']))) + Math.abs(data['snr-info']['last_signal_dbm'])) / 20 );
  let distance = roundAccurately((m * 3.281 / 3.3),2) ;
  let tr = $('<tr>');
  $(tr).append("<td scope='row'> " + station + " </td>");
  $(tr).append("<td> " + ( parseInt(i) + 1 ) + " </td>");
  $(tr).append("<td>" + data['channel'] + "</td>");
  $(tr).append("<td>" + data['BSSID'] + "</td>");
  $(tr).append("<td>" + data['manuf'] + "</td>");
  $(tr).append("<td>" + data['last-time'] + "</td>");
  $(tr).append("<td>" + data['snr-info']['last_signal_dbm'] + "</td>");
  $(tr).append("<td>" + distance + "</td>");
  $(tr).append("</tr>");
  $('#clientTable tbody').append(tr);
}
  // $('#clientTable tbody').empty();
  // for(var x in clientModels)
  //   console.log(x);

  // function iterate(item, index){
  //   console.log(item[0]);

  // }
}

function getTime(){
  const date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();
  $("#time").text(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  $("#time2").text(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}
