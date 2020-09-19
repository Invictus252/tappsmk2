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
  secret: "Yoyoyoyo",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 600000}
};

app.use(session(sessionOptions));
app.use(express.static('public'))

app.all("/", serveIndex);
app.get("/snippets", listSnippets);
app.get("/filterCreator" , filterSnippetsByCreator);
app.get("/filterLanguage", filterSnippetsByLanguage);
app.get("/filterLanguageOrderCreatorAsc", filterSnippetsByLanguageOrderCreatorAsc);
app.get("/filterLanguageOrderCreatorDesc", filterSnippetsByLanguageOrderCreatorDesc);
app.get("/filterSnippetOrderCreatorAsc", filterSnippetsBySnippetOrderCreatorAsc);
app.get("/filterSnippetOrderCreatorDesc", filterSnippetsBySnippetOrderCreatorDesc);
app.get("/filterSnippetOrderLanguageAsc", filterSnippetsBySnippetOrderLanguageAsc);
app.get("/filterSnippetOrderLanguageDesc", filterSnippetsBySnippetOrderLanguageDesc);
app.get("/filterSnippetOrderDescriptionAsc", filterSnippetsBySnippetOrderDescriptionAsc);
app.get("/filterSnippetOrderDescriptionDesc", filterSnippetsBySnippetOrderDescriptionDesc);
app.get("/filterDescriptionOrderCreatorAsc", filterSnippetsByDescriptionOrderCreatorAsc);
app.get("/filterDescriptionOrderCreatorDesc", filterSnippetsByDescriptionOrderCreatorDesc);
app.get("/filterLanguageOrderDescriptionAsc", filterSnippetsByLanguageOrderDescriptionAsc);
app.get("/filterLanguageOrderDescriptionDesc", filterSnippetsByLanguageOrderDescriptionDesc);
app.get("/filterCreatorOrderLanguageAsc", filterSnippetsByCreatorOrderLanguageAsc);
app.get("/filterCreatorOrderLanguageDesc", filterSnippetsByCreatorOrderLanguageDesc);
app.get("/filterCreatorOrderDescriptionAsc", filterSnippetsByCreatorOrderDescriptionAsc);
app.get("/filterCreatorOrderDescriptionDesc", filterSnippetsByCreatorOrderDescriptionDesc);
app.get("/filterDescriptionOrderLanguageAsc", filterSnippetsByDescriptionOrderLanguageAsc);
app.get("/filterDescriptionOrderLanguageDesc", filterSnippetsByDescriptionOrderLanguageDesc);
app.get("/filterDescription", filterSnippetsByDescription);
app.get("/filterSnippet", filterSnippetsBySnippet);
app.get("/SortByCreator", sortSnippetsByCreator);
app.get("/SortByLanguage", sortSnippetsByLanguage);
app.get("/SortByDescription", sortSnippetsByDescription);
app.get("/SortByCreatorByDesc", sortSnippetsByCreatorByDesc);
app.get("/SortByLanguageByDesc", sortSnippetsByLanguageByDesc);
app.get("/sortByDescriptionByDesc", sortSnippetsByDescriptionByDesc);
app.listen(3000, process.env.IP, startHandler());

const connection = mysql.createConnection(dbInfo);
connection.connect(function(err) {
  if(err) throw err;
});

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

/// APP FUNCTIONS BELOW
function writeResult(res, object) {
  res.writeHead(200, {"Content-Type" : "application/json"});
  res.end(JSON.stringify(object));
}

/// Initial Page Load
function buildSnippet(dbObject) {
  return {Id: dbObject.Id,
          Creator: dbObject.Creator,
          Language: dbObject.Lang,
          Description: dbObject.Description,
          Snippet: dbObject.Code};
}

function listSnippets(req, res) {
  let ip = req.ip;
  console.log(ip," is connecting");
  getAndListSnippets(req, res);
}

function getAndListSnippets(req, res) {
  connection.query("SELECT * FROM Snippets;", function(err, dbResult) {
    if(err)
      writeResult(res, {error: err.message});
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result: snippets});
    }
  });
}

/// Filtering
function filterSnippetsByCreator(req, res) {
  let ip = req.ip;
  if (req.query.creator == undefined) {
    writeResult(res, {'error' : "Need to enter a Creator"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Creator LIKE ?", "%" + [req.query.creator] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      	writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByLanguage(req, res) {
  let ip = req.ip;
  if (req.query.language == undefined) {
    writeResult(res, {'error' : "Need to enter a Language"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Lang LIKE ?", "%" + [req.query.language] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      	writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByDescription(req, res) {
  let ip = req.ip;
  if (req.query.description == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Description LIKE ?", "%" + [req.query.description] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippet(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ?", "%" + [req.query.snippet] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

/// Sorting
function sortSnippetsByCreator(req, res) {
  let ip = req.ip;
  let filter = '';
  connection.query("SELECT * FROM Snippets ORDER BY Creator", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message});
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

function sortSnippetsByLanguage(req, res) {
  let ip = req.ip;
  connection.query("SELECT * FROM Snippets ORDER BY Lang", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message})
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

function sortSnippetsByDescription(req, res) {
  let ip = req.ip;
  connection.query("SELECT * FROM Snippets ORDER BY CAST(Description AS UNSIGNED), Description ASC", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message})
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

function sortSnippetsByCreatorByDesc(req, res) {
  let ip = req.ip;
  connection.query("SELECT * FROM Snippets ORDER BY Creator DESC", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message})
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

function sortSnippetsByLanguageByDesc(req, res) {
  let ip = req.ip;
  connection.query("SELECT * FROM Snippets ORDER BY Lang DESC", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message})
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

function sortSnippetsByDescriptionByDesc(req, res) {
  let ip = req.ip;
  connection.query("SELECT * FROM Snippets ORDER BY Description DESC", function(err, dbResult){
    if(err)
      writeResult(res, {error : err.message})
    else {
      let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
      writeResult(res, {result : snippets});
    }
  });
}

/// Filter and Sort
function filterSnippetsByLanguageOrderCreatorAsc(req, res) {
  let ip = req.ip;
  if (req.query.language == undefined) {
    writeResult(res, {'error' : "Need to enter a Language"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Lang LIKE ? ORDER BY Creator ASC", "%" + [req.query.language] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByLanguageOrderCreatorDesc(req, res) {
  let ip = req.ip;
  if (req.query.language == undefined) {
    writeResult(res, {'error' : "Need to enter a Language"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Lang LIKE ? ORDER BY Creator DESC", "%" + [req.query.language] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByLanguageOrderDescriptionAsc(req, res) {
  let ip = req.ip;
  if (req.query.language == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    console.log(ip," is filtering by Language");
    connection.query("SELECT * FROM Snippets WHERE Lang LIKE ? ORDER BY Description ASC", "%" + [req.query.language] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByLanguageOrderDescriptionDesc(req, res) {
  let ip = req.ip;
  if (req.query.language == undefined) {
    writeResult(res, {'error' : "Need to enter a Language"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Lang LIKE ? ORDER BY Description DESC", "%" + [req.query.language] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByCreatorOrderLanguageAsc(req, res) {
  let ip = req.ip;
  if (req.query.creator == undefined) {
    writeResult(res, {'error' : "Need to enter a Creator"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Creator LIKE ? ORDER BY Lang ASC", "%" + [req.query.creator] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByCreatorOrderLanguageDesc(req, res) {
  let ip = req.ip;
  if (req.query.creator == undefined) {
    writeResult(res, {'error' : "Need to enter a Creator"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Creator LIKE ? ORDER BY Lang DESC", "%" + [req.query.creator] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByCreatorOrderDescriptionAsc(req, res) {
  let ip = req.ip;
  if (req.query.creator == undefined) {
    writeResult(res, {'error' : "Need to enter a Creator"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Creator LIKE ? ORDER BY Description ASC", "%" + [req.query.creator] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByCreatorOrderDescriptionDesc(req, res) {
  let ip = req.ip;
  if (req.query.creator == undefined) {
    writeResult(res, {'error' : "Need to enter a Creator"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Creator LIKE ? ORDER BY Description DESC", "%" + [req.query.creator] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByDescriptionOrderCreatorAsc(req, res) {
  let ip = req.ip;
  if (req.query.description == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Description LIKE ? ORDER BY Creator ASC", "%" + [req.query.description] + "%",  function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByDescriptionOrderCreatorDesc(req, res) {
  let ip = req.ip;
  if (req.query.description == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Description LIKE ? ORDER BY Creator DESC", "%" + [req.query.description] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByDescriptionOrderLanguageAsc(req, res) {
  let ip = req.ip;
  if (req.query.description == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Description LIKE ? ORDER BY Lang ASC", "%" + [req.query.description] + "%",  function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsByDescriptionOrderLanguageDesc(req, res) {
  let ip = req.ip;
  if (req.query.description == undefined) {
    writeResult(res, {'error' : "Need to enter a Description"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Description LIKE ? ORDER BY Lang DESC", "%" + [req.query.description] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderCreatorAsc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Creator ASC", "%" + [req.query.snippet] + "%",  function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderCreatorDesc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Creator DESC", "%" + [req.query.snippet] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderLanguageAsc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Lang ASC", "%" + [req.query.snippet] + "%",  function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderLanguageDesc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Lang DESC", "%" + [req.query.snippet] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderDescriptionAsc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Description ASC", "%" + [req.query.snippet] + "%",  function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}

function filterSnippetsBySnippetOrderDescriptionDesc(req, res) {
  let ip = req.ip;
  if (req.query.snippet == undefined) {
    writeResult(res, {'error' : "Need to enter a Snippet"});
  }
  else {
    connection.query("SELECT * FROM Snippets WHERE Code LIKE ? ORDER BY Description DESC", "%" + [req.query.snippet] + "%", function (err, dbResult) {
      if (err)
        writeResult(res, {error : err.message});
      else {
        let snippets = dbResult.map(function(snippet) {return buildSnippet(snippet)});
        writeResult(res, {result: snippets});
      }
    });
  }
}
