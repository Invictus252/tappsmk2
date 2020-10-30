const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const app = new express();
var airodump = {};
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const usernameRegEx = /^[a-zA-Z\s]*$/;

const dbInfo = {
  host: "localhost",
  user: "root",
  password: "",
  database: "TappsDB"
};
const sessionOptions = {
  secret: "ChooChoo",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: null}
};
const connection = mysql.createConnection(dbInfo);

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
app.get("/getTasks", getTasks);
app.get("/getDBsize", getDBsize);
app.get("/readyDir", readyDir);
app.listen(process.env.PORT || 3000, process.env.IP, startHandler());

connection.connect(function(err) {
  if(err) throw err;
});

function startHandler() {
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
  res.writeHead(200, {"Content-Type" : "application/json"});
  res.end(JSON.stringify(object));
}

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

function buildUser(dbObject) {
  return {Id: dbObject.Id, Email: dbObject.Email, UserName: dbObject.UserName, AuthLevel : dbObject.AuthLevel};
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

function getScanResults(req,res) {
  connection.query("SELECT * FROM ScanResults;", function(err, dbResult) {
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

function getTasks(req,res) {
  connection.query("SELECT * FROM CreationTasks;", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let tasks = dbResult.map(function(task) {return buildTask(task)});
      writeResult(res, {result: tasks});
    }
  });
}

function getDBsize(req,res) {
  connection.query("SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) 'Size'  FROM information_schema.tables WHERE table_schema = 'TappsDB';", function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let size = dbResult[0]['Size'];
      writeResult(res, {result: size});
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

function buildQuestion(dbObject) {
  return {Id: dbObject.Id, Question: dbObject.Question};
}

function buildTask(dbObject) {
  return {Id: dbObject.Id, Task: dbObject.Task, BeginDate: dbObject.Begin};
}

function buildUserQuestions(dbObject) {
  return {SecurityQuestion1Id: dbObject.SecurityQuestion1Id, SecurityQuestion2Id: dbObject.SecurityQuestion2Id};
}

function buildScan(dbObject) {
  return {Id: dbObject.Id, DeviceName: dbObject.DeviceName, Mac: dbObject.Mac, OUI :dbObject.OUI, Power: dbObject.Power, Distance: dbObject.Distance, FTS: dbObject.FirstTimeSeen, LTS: dbObject.LastTimeSeen };
}

function initAirmon(req,res){
  let proc = require('child_process');
  child = proc.spawn('airmon-ng',['start','wlan1']);

  child.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  writeResult(res, {success: "Monitor initialized"});
}

function initAirodump(req,res){
  let proc = require('child_process');
  airodump = proc.spawn('airodump-ng', ['-w','test','--output-format', 'csv','wlan1mon']);

  airodump.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  writeResult(res, {success: "Dump initialized"});
}

function killAirodump(req,res){
  airodump.kill();
  writeResult(res, {success: "Dump killed"});
}

function killAirmon(req,res){
  let proc = require('child_process');
  child = proc.spawn('airmon-ng',['stop','wlan1mon']);

  child.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  child = proc.spawn('ifconfig',['wlan1','up']);

  child.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  writeResult(res, {success: "Monitor killed & reinitialized"});
}

function processScan(req,res){
  let proc = require('child_process');
  child = proc.spawn('airgraph-ng' ,['-g','CAPR','-i', 'test-01.csv','-o','test.png','-s',1]);

  child.stderr.on('data', function (data) {
    // console.log(data.toString());
  });
  writeResult(res, {success: "Scan processing successfully"});

}

function readyDir(req,res){
  let this_png = 'test.png';
  let this_csv = 'test-01.csv';

  fs.unlink(this_png, (err) => {
    if (err) {
      console.error(err)
      return
    }

    //file removed
  });
  fs.unlink(this_csv, (err) => {
    if (err) {
      console.error(err)
      return
    }

    //file removed
  });
  writeResult(res, {success: "DIR Ready"});
}
