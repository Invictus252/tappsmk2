const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const app = new express();

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const dbInfo = {
  host: "localhost",
  user: "root",
  password: "",
  database: "SnippetsDB"
};
const sessionOptions = {
  secret: "ChooChoo",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 600000}
};
const connection = mysql.createConnection(dbInfo);

app.use(session(sessionOptions));
app.use(express.static('public'));
app.all("/", serveIndex);
app.get("/whoIsLoggedIn", whoIsLoggedIn);
app.get("/findSnippets", findSnippets);
app.get("/register", register);
app.get("/login", login);
app.listen(3000, process.env.IP, startHandler());

connection.connect(function(err) {
  if(err) throw err;
});

/// APP FUNCTIONS BELOW
function startHandler() {
  console.log("Server listening at http://localhost:3000")
  console.log("\x1b[31m", " FUNCTION JUNCTION is Aware");
  console.log("\x1b[37m","\x1b[41m","    ̿' ̿'\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿     ","\x1b[0m");
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

function buildSnippet(dbObject) {
  return {Id: dbObject.Id,
          Creator: dbObject.Creator,
          Language: dbObject.Language,
          Description: dbObject.Description,
          Snippet: dbObject.Code};
}

// Controller
function findSnippets(req, res) {
  let sql= "SELECT * FROM Snippets";
  let sqlString = [sql];
  if(req.query.filterOn && req.query.filter) {
    sqlString.push(" WHERE " + req.query.filterOn + " LIKE '%" + req.query.filter + "%'");
  }
  if(req.query.sortOn && req.query.order) {
    sqlString.push(" ORDER BY " + req.query.sortOn + " " + req.query.order + ";");
  }
  makeQuery(sqlString,res);
}

// Helper Functions
function makeQuery(query,res){
  query = query.join(" ");
  connection.query(query, function(err, dbResult) {
    if(err)
      writeResult(res, {error: err.message});
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result: snippets});
    }
  });
}
//User creation functions
function whoIsLoggedIn(req, res) {
  if(req.session.user == undefined)
    writeResult(res, {user: undefined});
  else
    writeResult(res, {user: req.session.user});
}

function register(req, res){
  if(!validateEmail(req.query.email)) {
    writeResult(res, {error: "Email is not valid!"})
    return;
  }
  if(!validatePassword(req.query.password)){
    writeResult(res, {error: "Password is invalid: Must be at least eight characters and must contain at least one Uppercase letter, one Lowercase letter, and a number!"})
    return;
  }

  let email = getEmail(req);
  let password = bcrypt.hashSync(req.query.password, 12);
  let userName = req.query.userName;

  connection.query("INSERT INTO Users (Email, Password,UserName) VALUES (?,?,?)", [email, password, userName], function(err, dbResult){
    if(err){
      writeResult(res, {error: "Error creating user: " + err.message});
    }
    else {
      connection.query("SELECT * FROM Users ORDER BY ID DESC LIMIT 1;",function(err, dbResult) {
        if(err) {
          writeResult(res, {error: "Error loading user: " + err.message});
        }
        else {
          writeResult(res, {result: dbResult[0]});
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
  connection.query("SELECT Id, Email, Password, UserName FROM Users WHERE Email = ?", [email], function(err, dbResult) {
    if(err)
      writeResult(res, {error: err.message});
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

function getEmail(req){
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

function buildUser(dbObject) {
  return {Id: dbObject.Id, Email: dbObject.Email, UserName: dbObject.UserName};
}
