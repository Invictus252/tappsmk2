const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const app = new express();
var airodump = {};
var dumpStatus = false;
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const usernameRegEx = /^[a-zA-Z\s]*$/;

const dbInfo = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "TappsDB"
};
const sessionOptions = {
  secret: "ChooChoo",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: null}
};
const connection = mysql.createConnection(dbInfo);



const worldArt2 = ".. . . . . . . . . . . . . . . . . . . BRAVO . . . . . . .\n"+
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
                  ".. . . . . . . . . . . . . . . . . . . . . . . . . . . . .";

app.use(session(sessionOptions));
app.use(express.static('public'));
app.all("/", serveIndex);
app.get("/register", register);
app.get("/login", login);
app.get("/logout", logout);
app.get("/resetPassword", resetPassword);
app.get("/whoIsLoggedIn", whoIsLoggedIn);
app.get("/retrieveUserSecurityQuestions", retrieveUserSecurityQuestions);
app.get("/getSecurityQuestions", getSecurityQuestions);
app.get("/initAirmon", initAirmon);
app.get("/killAirmon", killAirmon);
app.get("/initAirodump", initAirodump);
app.get("/killAirodump", killAirodump);
app.get("/processScan", processScan);
app.get("/getScanResults", getScanResults);
app.get("/getScanCount", getScanCount);
app.get("/getUserCount", getUserCount);
app.get("/getMacCount", getMacCount);
app.get("/getDBsize", getDBsize);
app.get("/getBravoLog", getBravoLog);
app.get("/readyDir", readyDir);
app.get("/readyScan", readyScan);
app.get("/currentScanStatus", currentScanStatus);
app.get("/resetScanStatus", resetScanStatus);
app.get("/findReadyClients", findReadyClients);
app.listen(3000, process.env.IP, startHandler());

connection.connect(function(err) {
  if(err) throw err;
});

function startHandler() {
  console.log(worldArt2);
  console.log("\x1b[33m","T" + "\x1b[31m","rilateral ",
              "\x1b[33m","A" + "\x1b[31m","ccess",
              "\x1b[33m","P" + "\x1b[31m","oint",
              "\x1b[33m","P" + "\x1b[31m","ositioning",
              "\x1b[33m","S" + "\x1b[31m","ystem",
              "\x1b[34m","is online\n\n");
}

function serveIndex(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  let index = fs.readFileSync('index.html');
  res.end(index);
}

function writeResult(res, object) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(object));
}

// USER LOGIN & REGISTRATION

function register(req, res) {
  if(!validateEmail(req.query.email)) {
    writeResult(res, {error: "Email is not valid!"})
    return;
  }
  if(!validatePassword(req.query.password)) {
    writeResult(res, {error: "Password is invalid: Must be at least eight characters and must contain at least one Uppercase letter, one Lowercase letter, and a number!"})
    return;
  }
  if(!validateUserName(req.query.userName)) {
    writeResult(res, {error: "User Name is invalid: Must be only letters"})
    return;
  }

  let email = getEmail(req);
  let password = bcrypt.hashSync(req.query.password, 12);
  let userName = req.query.userName;
  let securityQuestion1 = req.query.securityQuestion1;
  let securityQuestion2 = req.query.securityQuestion2;

  if (!checkSecurityQuestions(securityQuestion1,securityQuestion2)) {
    writeResult(res, {error: "Error creating user: You must choose 2 DIFFERENT Security Questions"});
    return;
  }

  let securityAnswer1 = bcrypt.hashSync(req.query.securityAnswer1, 12);
  let securityAnswer2 = bcrypt.hashSync(req.query.securityAnswer2, 12);

  connection.query("INSERT INTO Users (Email, Password, UserName, AuthLevel, SecurityQuestion1Id, SecurityQuestion2Id,SecurityAnswer1, SecurityAnswer2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [email, password, userName, 2,securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2], function(err, dbResult) {
    if(err) {
      writeResult(res, {error: "Error creating user: " + err.message});
    }
    else {
      connection.query("SELECT Id, Email, UserName FROM Users WHERE Email = ?", [email], function(err, dbResult) {
        if(err) {
          writeResult(res, {error: "Error loading user: " + err.message});
        }
        else {
          req.session.user = buildUser(dbResult[0]);
          writeResult(res, {user: req.session.user});
        }
      });
    }
  });
}

function login(req, res) {
  if(!req.query.email || !req.query.password) {
    writeResult(res, {error: "Email is required."});
    return;
  }

  let email = getEmail(req);
  connection.query("SELECT Id, Email, Password, UserName, AuthLevel FROM Users WHERE Email = ?", [email], function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      if(dbResult.length == 1 && bcrypt.compareSync(req.query.password, dbResult[0].Password)) {
        req.session.user = buildUser(dbResult[0]);
        writeResult(res, {user: req.session.user});
      }
      else {
        writeResult(res, {error: "Invalid email or password."});
      }
    }
  });
}

function logout(req, res) {
  req.session.user = undefined;
  writeResult(res, {user: undefined});
}

function resetPassword(req, res) {
	if(!validateEmail(req.query.email)) {
    writeResult(res, {error: "Email is not valid!"})
    return;
  }

	if(!validatePassword(req.query.password)) {
    writeResult(res, {error: "Password is invalid: Must be at least eight characters and must contain at least one Uppercase letter, one Lowercase letter, and a number!"})
    return;
  }

  let secAnswer1 = req.query.securityAnswer1;
  let secAnswer2 = req.query.securityAnswer2;
	let email = getEmail(req);
  let password = bcrypt.hashSync(req.query.password, 12);

	connection.query("SELECT * FROM Users WHERE Email = ?", [email], function(err, dbResult) {
    if(err) {
      writeResult(res, {error: "Error creating user: " + err.message});
    }
    else {
      if((dbResult.length == 1 && bcrypt.compareSync(secAnswer1, dbResult[0].SecurityAnswer1))
        && (dbResult.length == 1 && bcrypt.compareSync(secAnswer2, dbResult[0].SecurityAnswer2)) == true) {
          req.session.user = buildUser(dbResult[0]);
          connection.query("UPDATE Users SET Password = ? WHERE Email = ?", [password, email], function(err, dbResult) {
            if(err) {
              writeResult(res, {error: "Error Reseting Password: " + err.message});
            }
            else {
              writeResult(res, {user: req.session.user});
            }
          });
      }
      else {
        writeResult(res, {error: "Answers do not match. Check your answers and resubmit"});
      }
    }
  });
}

function whoIsLoggedIn(req, res) {
  if(req.session.user == undefined)
    writeResult(res, {user: undefined});
  else
    writeResult(res, {user: req.session.user});
}

function getEmail(req) {
  return String(req.query.email).toLocaleLowerCase();
}

function validateEmail(email) {
  if(!email)
    return false;
  return emailRegEx.test(email.toLowerCase());
}

function validatePassword(password) {
  if(!password)
    return false;
  return passwordRegEx.test(password);
}

function validateUserName(userName) {
  if(!userName)
    return false;
  return usernameRegEx.test(userName);
}

function checkSecurityQuestions(x,y) {
  if(x == y ) {
    return false;
  }
  else {
    return true;
  }
}

function getSecurityQuestions(req,res) {
  connection.query("SELECT * FROM SecurityQuestions;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let questions = dbResult.map(function(question) {return buildQuestion(question)});
      writeResult(res, {result: questions});
    }
  });
}

function retrieveUserSecurityQuestions(req,res) {
  if(!req.query.email || !validateEmail(req.query.email)) {
    writeResult(res, {error: "Valid Email is required."});
    return;
  }

  connection.query("SELECT SecurityQuestion1Id, SecurityQuestion2Id FROM Users WHERE Email = ?;", [req.query.email], function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    if(dbResult.length == 0) {
      writeResult(res, {error: "Invalid User"});
    }
    else {
      let questions = dbResult.map(function(question) {return buildUserQuestions(question)});

      let question1ID = questions[0].SecurityQuestion1Id;
      let question2ID = questions[0].SecurityQuestion2Id;

      connection.query("SELECT SecurityQuestions.Question FROM SecurityQuestions WHERE Id IN (?, ?) ORDER BY FIELD(Id, ?, ?);", [question1ID, question2ID, question1ID, question2ID], function(err, dbResult) {
        if(err) {
          writeResult(res, {error: err.message});
        }
        else {
          let question = dbResult.map(function(question) {return buildQuestion(question)});
          writeResult(res, {result: question})
        }
      });
    }
  });
}

// PAGE FUNCTIONS

function getScanResults(req,res) {
  connection.query("SELECT * FROM ScanResults ORDER BY Id DESC LIMIT 20;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let scans = dbResult.map(function(scan) {return buildScan(scan)});
      writeResult(res, {result: scans});
    }
  });
}

function getScanCount(req,res) {
  connection.query("SELECT COUNT(*) FROM StoredScans;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let stored = dbResult[0]['COUNT(*)'];
      writeResult(res, {result: stored});
    }
  });
}

function getUserCount(req,res) {
  connection.query("SELECT COUNT(*) FROM Users;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let count = dbResult[0]['COUNT(*)'];
      writeResult(res, {result: count});
    }
  });
}

function getMacCount(req,res) {
  connection.query("SELECT COUNT(*) FROM ScanResults;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let count = dbResult[0]['COUNT(*)'];
      writeResult(res, {result: count});
    }
  });
}

function getDBsize(req,res) {
  connection.query("SELECT ROUND(SUM(data_length + index_length) / 1024 , 1) 'Size'  FROM information_schema.tables WHERE table_schema = 'TappsDB';", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let size = dbResult[0]['Size'];
      writeResult(res, {result: size});
    }
  });
}

// SCAN FUNCTIONS

function killAirodump(req,res){
  if(dumpStatus){
    airodump.kill();
    writeResult(res, {success: "Dump killed"});
  } else{
    writeResult(res, {success: "Dump not taken"});
  }
  dumpStatus = false;
}

function killAirmon(req,res){
  let proc = require('child_process');
  child = proc.spawn('airmon-ng',['stop','wlan1mon']);

  child.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  child = proc.spawn('ifconfig',['wlan1','up']);

  child.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  req.session.stage = 0
  writeResult(res, {success: "Monitor killed & reinitialized", stage:req.session.stage});
}

function processScan(req,res){
  let proc = require('child_process');
  child = proc.spawn('airgraph-ng' ,['-g','CAPR','-i', req.query.filename + '-01.csv','-o',req.query.filename + '.png','-s',req.query.scanId]);

  child.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  req.session.stage = 4
  writeResult(res, {success: "Scan processing successfully", stage:req.session.stage});

}

function readyDir(req,res){
  let this_png = req.query.filename + '.png';
  let this_csv = req.query.filename + '-01.csv';
  fs.unlink(this_png, (err) => {
    //file removed
    if(err){
      console.log(err);
    }
  });
  fs.unlink(this_csv, (err) => {
    if(err){
      console.log(err);
    }
    //file removed
  });
  req.session.stage = 1;
  writeResult(res, {success: "DIR Ready", stage:req.session.stage});
}

function readyScan(req, res) {
  let location = req.query.location;
  let notes = req.query.notes;
  let fileName = req.query.filename;
  let date_ob = new Date();

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
  let timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  connection.query("INSERT INTO StoredScans(TimeStamp,Location,Notes,FileName) VALUES (?, ?, ?, ?)", [timestamp, location, notes, fileName], function(err, dbResult) {
    if(err) {
      console.log(err);
      writeResult(res, {error: "Error : " + err.message});
    }
    else {
      connection.query("SELECT * FROM StoredScans ORDER BY Id DESC LIMIT 1", function(err, dbResult) {
        if(err) {
          writeResult(res, {error: "Error : " + err.message});
        }
        else {
          req.session.scan = dbResult.map(function(scan) {return buildScanDB(scan)}); 
          req.session.stage = 0;  
          writeResult(res, {scan: req.session.scan, stage: req.session.stage});
        }
      });
    }
  });
}

function initAirmon(req,res){
  let proc = require('child_process');
  child = proc.spawn('airmon-ng',['start','wlan1']);

  child.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  req.session.stage = 2;  
  writeResult(res, {success: "Monitor initialized", stage: req.session.stage});
}

function initAirodump(req,res){
  dumpStatus = true;
  let proc = require('child_process');
  airodump = proc.spawn('airodump-ng', ['-w',req.query.filename,'--output-format', 'csv','wlan1mon']);

  airodump.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  req.session.stage = 3
  writeResult(res, {success: "Dump initialized", stage:req.session.stage});
}

function currentScanStatus(req, res) {
  if(req.session.scan == undefined)
    writeResult(res, {scan: undefined});
  else
    writeResult(res, {scan: req.session.scan, stage: req.session.stage});
}

function resetScanStatus(req, res) {
  req.session.scan = undefined;
  currentScanStatus(req,res);
}

// RENDER READY CLIENT FUNCTIONS

function findReadyClients(req, res) {
  connection.query("SELECT DISTINCT a.Mac, a.ScanGroup, a.OUI, a.FirstTimeSeen, a.distance as alpha_distance, b.bravo_distance, c.charlie_distance FROM ScanResults a JOIN ( select Mac, ScanGroup, distance as bravo_distance FROM ScanResults WHERE DeviceName = 'BRAVO') b on a.Mac = b.Mac and a.ScanGroup = b.ScanGroup JOIN ( select Mac, ScanGroup, distance as charlie_distance FROM ScanResults WHERE DeviceName = 'CHARLIE') c on a.Mac = c.Mac and a.ScanGroup = c.ScanGroup WHERE a.DeviceName = 'ALPHA' and a.Mac REGEXP '^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$' ORDER BY a.Id DESC LIMIT 5;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let clients = dbResult.map(function(client) {return buildReadyClient(client)});
      writeResult(res, {result: clients});
    }
  });
}

// RENDER LOG CLIENTS

function getBravoLog(req, res){  
  // Calling the readFileSync() method 
  // to read 'input.txt' file 
  const data = fs.readFileSync('./logs/tapps.log','utf8'); 
    
  // Display the file data 
  writeResult(res, {result: data});
  //console.log(data); 
}


// BUILD CONTROLLERS

function buildScan(dbObject) {
  return {Id: dbObject.Id, DeviceName: dbObject.DeviceName, Mac: dbObject.Mac, OUI :dbObject.OUI, Power: dbObject.Power, Distance: dbObject.Distance, FTS: dbObject.FirstTimeSeen, LTS: dbObject.LastTimeSeen ,ScanGroup: dbObject.ScanGroup};
}

function buildScanDB(dbObject) {
  return {Id: dbObject.Id, Location: dbObject.Location, TimeStamp: dbObject.TimeStamp, Notes: dbObject.Notes, FileName: dbObject.FileName};
}

function buildQuestion(dbObject) {
  return {Id: dbObject.Id, Question: dbObject.Question};
}

function buildUserQuestions(dbObject) {
  return {SecurityQuestion1Id: dbObject.SecurityQuestion1Id, SecurityQuestion2Id: dbObject.SecurityQuestion2Id};
}

function buildUser(dbObject) {
  return {Id: dbObject.Id, Email: dbObject.Email, UserName: dbObject.UserName, AuthLevel : dbObject.AuthLevel};
}

function buildReadyClient(dbObject) {
  return {MAC : dbObject.Mac, 
          ScanGroup : dbObject.ScanGroup, 
          ClientType : dbObject.OUI,
          FTS : dbObject.FirstTimeSeen,  
          alphaDistance : dbObject.alpha_distance,
          bravoDistance : dbObject.bravo_distance,
          charlieDistance : dbObject.charlie_distance};
}