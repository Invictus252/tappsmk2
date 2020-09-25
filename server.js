const http = require('http');
const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const app = new express();

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
app.get("/findSnippets", findSnippets);
app.get("/register", register);
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
  var index = fs.readFileSync('index.html');
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
  var sql= "SELECT * FROM Snippets";
  var sqlString = [sql];
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
function register(req, res){
  if(!validateEmail(req.query.email)) {

    writeResult(res, {error: "Email is not valid!"})
    return;
  }
  if(!validatePassword(req.query.password)){

    writeResult(res, {error: "Password is invalid: Must be at least eight characters and must contain at least one letter and number!"})
    return;
  }

  let email = getEmail(req);
  let password = bcrypt.hashSync(req.query.password, 12);

  connection.query("INSERT INTO Users (Email, Password) VALUES (?, ?)", [email, password], function(err, dbResult){
    if(err){
      writeResult(res, {error: "Error creating user: " + err.message});
    }
    else {
      connection.query("SELECT * FROM Users ORDER BY ID DESC LIMIT 1;",function(err, dbResult){
        if(err){
          writeResult(res, {error: "Error creating user: " + err.message});
        }
        else {
          writeResult(res, {Id: dbResult[0].Id, Email:dbResult[0].Email});
        }
    })
  }
})
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
  console.log(dbObject);
  return {Id: dbObject.Id, email: dbObject.Email};
}
