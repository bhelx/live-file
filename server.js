#!/usr/bin/env node

var argv = require('optimist')
  .usage('Usage: live-file --file <filename>')
  .demand(['file'])
  .default('port', 8888)
  .default('backlog', 8000)
  .argv;

var http    = require('http'),
    io      = require('socket.io'),
    fs      = require('fs'),
    url     = require('url');

var filename    = argv.file,
    port        = argv.port,
    backlogSize = argv.backlog;

var server = http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;

  if (query['pivot']) {
    console.log(query);
    var pivot = query['pivot'],
        start = (pivot > backlogSize) ? (pivot - backlogSize) : 0;
    console.log('Reading from ' + start + ' to ' + pivot);
    streamData(start, pivot, function (lines) {
      res.writeHead(200, {'Conent-Type': 'application/json'});
      res.end(JSON.stringify({tail: lines, topByte: start}));
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(__dirname + '/index.html', function (err, data) {
      res.end(data, 'utf8');
    });
  }
});

server.listen(port, null);

function streamData(start, end, callback) {
  var stream = fs.createReadStream(filename, {start: start, end: end});
  stream.addListener("data", function (lines) {
    lines = lines.toString('utf-8');
    lines = lines.slice(lines.indexOf("\n") + 1).split("\n"); // cutoff first probably garbled line
    callback(lines);
  });
}

io = io.listen(server);
io.sockets.on('connection', function (client){
  console.log('connected');
  fs.stat(filename, function (err, stats) {
    if (err) throw err;
    var start = (stats.size > backlogSize) ? (stats.size - backlogSize) : 0;
    streamData(start, stats.size, function (lines) {
      client.emit('message', {filename: filename, tail: lines, topByte: start});
    });
  });
});

// watch the file now
fs.watchFile(filename, function (curr, prev) {
  if(prev.size > curr.size) return {clear: true};
  var stream = fs.createReadStream(filename, {start: prev.size, end: curr.size});
  stream.addListener("data", function (lines) {
    io.sockets.emit('message', {tail: lines.toString('utf-8').split("\n")});
  });
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

io.configure(function () {
  io.disable('log');
});

console.log('Server Running :)');

