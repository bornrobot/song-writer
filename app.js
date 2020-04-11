const http = require('http');
const SongGenerator = require('./model/songGen-Brightonian');

let songGen = new SongGenerator();
songGen.create();

var songJson  = JSON.stringify(songGen.song);

console.log(songJson);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/perform',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': songJson.length
  }
};

let req = http.request(options, (res) => {
  console.log('statusCode: ${res.statusCode}');

  res.on('data', (d) => {
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
