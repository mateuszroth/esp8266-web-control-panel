var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require("johnny-five");
var board, led;

var board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.1.113",
    port: 3030
  }),
  timeout: 1e5,
  repl: false
});

board.on("ready", function() {
  console.log("READY!");

  // init a led on pin 2, strobe every 1000ms
  led = new five.Led(2).strobe(1000);

  // setup a standard servo, center at start
  servo = new five.Servo({
    pin:6,
    range: [0,180],
    type: "standard",
    center:true
  });

  // poll this sensor every second
  sensor = new five.Sensor({
    pin: "A0",
    freq: 1000
  });
});

var socket = require('socket.io-client')('http://192.168.1.102:8080'); // #TODO update server ip
socket.on('news', function (data) {
  console.log(data);
});

socket.on('ledSignal', function (data) {
  console.log(data);
  if(board.isReady) {
    led.strobe(data.delay);
  }
});
