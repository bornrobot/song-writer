const http = require('http');
const SongGenerator = require('./model/song-gen');
//const SongGenerator = require('./model/song-test');

let songGen = new SongGenerator();
songGen.create();

var songJson  = JSON.stringify(songGen.song);

console.log(songJson);

const options = {
  hostname: '192.168.20.12',
  port: 5003,
  path: '/perform',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': songJson.length
  }
};

let req = http.request(options, (res) => {

  //console.log('statusCode: ${res.statusCode}');

  res.on('data', (d) => {
    //Should be json containing UUID and status
    process.stdout.write(d);
    process.exit()
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(songJson);
req.end();
req.shouldKeepAlive = false
