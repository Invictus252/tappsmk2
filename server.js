const fs = require('fs');
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const app = new express();

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const usernameRegEx = /^[a-zA-Z\s]*$/;

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
app.get("/login", login);
app.get("/logout", logout);
app.get("/resetPassword", resetPassword);
app.get("/whoIsLoggedIn", whoIsLoggedIn);
app.get("/retrieveUserSecurityQuestions", retrieveUserSecurityQuestions);
app.get("/getSecurityQuestions", getSecurityQuestions);
app.listen(3000, process.env.IP, startHandler());

connection.connect(function(err) {
  if(err) throw err;
});

function startHandler() {
  console.log("Server listening at http://localhost:3000")
  console.log("\x1b[31m", " FUNCTION JUNCTION is Aware");
  console.log("\x1b[37m", "\x1b[41m","    ̿' ̿'\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿     ", "\x1b[0m");
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
          Email: dbObject.Email,
          Creator: dbObject.UserName,
          Language: dbObject.Language,
          Description: dbObject.Description,
          Snippet: dbObject.Code};
}

function findSnippets(req, res) {

  let sql= "SELECT Snippets.Id, Users.Email, Users.UserName, Snippets.Language, Snippets.Description, Snippets.Code FROM Snippets INNER JOIN Users ON Snippets.UserId = Users.Id";
  let sqlString = [sql];
  if(req.query.filterOn && req.query.filter) {
    if(req.query.filterOn == "Creator") {
      if(req.query.filter.search("%40") || req.query.filter.search(".") >= 0)
        req.query.filterOn = "Email";
      else
        req.query.filterOn = "UserName";
    }
    sqlString.push(" WHERE " + req.query.filterOn + " LIKE '%" + req.query.filter + "%'");
  }
  if(req.query.sortOn && req.query.order) {
    sqlString.push(" ORDER BY " + req.query.sortOn + " " + req.query.order);
  }
  makeQuery(sqlString,res);
}

function makeQuery(query,res) {
  query = query.join(" ");
  connection.query(query, function(err, dbResult) {
    if(err) {
      writeResult(res, {error: err.message});
    }
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result: snippets});
    }
  });
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

  connection.query("INSERT INTO Users (Email, Password, UserName, SecurityQuestion1Id, SecurityQuestion2Id,SecurityAnswer1, SecurityAnswer2) VALUES (?, ?, ?, ?, ?, ?, ?)", [email, password, userName, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2], function(err, dbResult) {
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
  connection.query("SELECT Id, Email, Password, UserName FROM Users WHERE Email = ?", [email], function(err, dbResult) {
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
  return {Id: dbObject.Id, Email: dbObject.Email, UserName: dbObject.UserName};
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

function buildUserQuestions(dbObject) {
  return {SecurityQuestion1Id: dbObject.SecurityQuestion1Id, SecurityQuestion2Id: dbObject.SecurityQuestion2Id};
}
