var app = require('http').createServer(handler);
var http = require('https');
var querystring = require('querystring');
var io = require('socket.io').listen(app);
var fs = require('fs');

// sms config
var appKey = ''; // #TODO appKey from SMSLabs.pl
var secretKEy = ''; // #TODO appKey from SMSLabs.pl
var auth = 'Basic ' + new Buffer(appKey + ':' + secretKEy).toString('base64');

// sms config
var smsData = querystring.stringify({
    'flash': '0',
    'expiration': '0',
    'phone_number': '+48512345678', // #TODO your phone number
    'sender_id': 'SMS INFO',
    'message': 'JESUS CHRIST! SOMEONE IS IN YOUR HOUSE!'
});

// sms config
var options = {
    port: 443,
    host: 'panel.smslabs.net.pl',
    path: '/apiSms/sendSms',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': smsData.length,
        'Authorization': auth
    }
};

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
  socket.on('arm', function (data) {
    var arm = data.arm;
    console.log('Arm: ' + arm);
    io.sockets.emit('armSignal',{arm});
  });

  socket.on('detected', function (data) {
    var detected = data.detected;
    console.log('Detected: ' + detected);
    io.sockets.emit('detected',{detected});

    // send SMS #TODO uncomment
    var sms = http.request(options, function(res){});
    sms.on( 'error', function(e){ console.log( e.message ); });
    sms.write(smsData);
    sms.end();
  });

});
