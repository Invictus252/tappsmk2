const mysql = require("mysql");

class Database {
  constructor(dbConfig) {
    this.connection = mysql.createConnection(dbConfig)
    this.connection.connect(function(err){
      if(err) throw new Error("Error connecting to database: " + err.message);
    })
  }

  query(sql, args, req, res) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, function(err, dbResult) {
        if(err) return reject({req: req, res: res, err: err});
        resolve({req: req, res: res, dbResult: dbResult});
      });
    });
  }
}

module.exports = Database;


