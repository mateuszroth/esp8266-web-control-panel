const five = require('johnny-five');
const EtherPortClient = require('etherport-client').EtherPortClient;
const socket = require('socket.io-client')('http://192.168.43.113:8080'); // #TODO update server ip

console.log('Preparing...');

const board = new five.Board({
  port: new EtherPortClient({
    host: '192.168.43.111', // #TODO update esp device ip
    port: 3030
  }),
  timeout: 1e5,
  repl: false
});

console.log('Almost done, please wait 5 seconds...');

let armored = 0;
let emitted = 0;

// differences between D1R1 and D1R2
// https://forum.wemos.cc/uploads/files/1460120067677-comparison-of-wemos-r2-vs-r1-pinouts.png

// differences between Arduino UNO and D1R2
// http://www.instructables.com/id/Programming-the-WeMos-Using-Arduino-SoftwareIDE/
// http://www.instructables.com/file/FNU5UQRIMTE9CWV/

board.on('connect', function() {

    board.log('Board', 'Connected...');

});

board.on('ready', function() {

  board.log('Board', 'Ready!');

  this.pinMode(2, this.MODES.OUTPUT);
  this.pinMode(12, this.MODES.OUTPUT); // GPIO12 is D6/D12
  this.pinMode(13, this.MODES.INPUT); // GPIO13 is D7/D11

  board.digitalWrite(2, 0);
  board.digitalWrite(12, 0);

  this.loop(150, function() {
  // Whatever the last value was, write the opposite

    if(armored) {

      board.digitalWrite(12, 0);

      board.digitalRead(13, function(detected) {

          if(detected && armored) {

              board.digitalWrite(12, 1);

              if(!emitted) {

                socket.emit('detected', { detected: 'true' });
                emitted = 1;

              }

          } else if(emitted) {

            board.digitalWrite(12, 1);

          } else {

            board.digitalWrite(12, 0);
            emitted = 0;

          }

      });

    } else {

      board.digitalWrite(12, 0);
      emitted = 0;

    }

  });

});

board.on('exit', function() {

  board.log('Board', 'Closing...');

  board.digitalWrite(2, 0);
  board.digitalWrite(12, 0);

});

// SOCKETS

socket.on('news', function (data) {

  console.log(data);

});

socket.on('armSignal', function (data) {

  console.log(data);

  if(board.isReady) {

    armored = data.arm;

  }

});
