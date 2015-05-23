/**
 * Initialize sqlite and connect to database
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':gdopener:');

/**
 * Door ID Mapping
 * Garage Door = 0
 * Kitchen Door = 1
 * Patio Door = 2
 */

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='gd_statuses'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "gd_statuses" ' +
           '("ID" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"CREATED_AT" DATETIME DEFAULT CURRENT_TIMESTAMP, ' +
           '"DOOR_ID" INTEGER, ' +
           '"STATE" INTEGER)', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'gd_statuses' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'gd_statuses' already initialized.");
  }
});

module.exports = db;
