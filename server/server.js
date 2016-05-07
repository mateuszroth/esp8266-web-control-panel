var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

// make web server listen on port 8080
app.listen(8080);

// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',

  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error while loading index.html');
    }

    res.writeHead(200);
    res.end(data);

  });
}

// on a socket connection
io.sockets.on('connection', function (socket) {
  socket.emit('news', { connected: 'true' });

  // if led message received
  socket.on('ledWeb', function (data) {
    var delay = data.delay;
    console.log(delay);
    io.sockets.emit('ledSignal',{delay});
  });

});
