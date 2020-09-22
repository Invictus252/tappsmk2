const http = require('http');
const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const app = new express();
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
