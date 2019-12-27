const mysql = require('mysql');
const SongGenerator = require('./model/songGen-Brightonian');

let config = require('./config.js');

const db = mysql.createConnection(config);

console.log('Connected to database');

let songGen = new SongGenerator();

songGen.create();

var songJson  = JSON.stringify(songGen.song);

let query = "INSERT INTO `tblSongs` (bandName, createdDate, json, liked, disliked, played)";
query += " VALUES (";
query += "'" + songGen.bandName + "'";
query += ", NOW()";
query += ", '" + songJson + "'";
query += ", 0, 0, 0)";

db.query(query, (err, result) => {
  if (err) {
    throw err;
  }
  console.log("Inserted new song.");
});

db.end();
