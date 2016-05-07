# WeMos D1 Web Control Panel 
## using Johnny Five and Socket.IO
* [WeMos D1](http://www.wemos.cc/Products/d1.html)
* [Johnny Five](http://johnny-five.io/)
* [Socket.IO](http://socket.io/) + [Socket.IO - Node.js Client](https://github.com/socketio/socket.io-client)

## Requirements
First install [Node.js](https://nodejs.org/) and follow [instructions](http://www.wemos.cc/tutorial/get_started_in_arduino.html) for installing newest hardware package **using git** for WeMos D1. [Here](https://www.arduino.cc/en/Main/Software) you can download Arduino 1.6.8 or higher. [(PL) [tutaj](http://majsterkowo.pl/arduino-na-ubuntu-linux/) znajdziesz opis instalacji Arduino po polsku)]. You need at least v2.2.0 of [ESP8266 Core](https://github.com/esp8266/Arduino).

Then install newest Firmata from master branch from [git repository](https://github.com/firmata/arduino). Now you can configure `wifiConfig.h` and upload [StandardFirmataWiFi](https://github.com/firmata/arduino/tree/master/examples/StandardFirmataWiFi) to your WeMos D1.

[Here's a simple firmata.js client example with additional instructions](https://gist.github.com/soundanalogous/31a43d9c72ec6fbdf9631cfbe635d625) (remember to install dependencies by using command `npm install firmata etherport-client --save`).

If everything was done well, you can check simple J5 code (remember to install dependencies by using command `npm install johnny-five etherport-client --save`):
```javascript
var five = require("johnny-five");
var EtherPortClient = require("etherport-client").EtherPortClient;
// update host to the IP address for your ESP board
var board = new five.Board({
    port: new EtherPortClient({
        host: "10.0.0.17", // UPDATE!
        port: 3030
    }),
    timeout: 1e5,
    repl: false
});

board.on("ready", function() {
    console.log("READY!");
    var led = new five.Led(2);
    led.blink(500);
});
````

Now you can try [code examples for Johhny Five](http://johnny-five.io/examples/).

In opposite to Johhny Five, you can check [Breakout](https://github.com/soundanalogous/Breakout).

## Links
* [ESP8266 Firmata Issue on Github](https://github.com/firmata/arduino/issues/257)
* [etherport-client](https://github.com/mwittig/etherport-client) - Client-side virtual serial port for Rick Waldron's Etherport. Etherport-client is used to implement firmata-compatible boards and tethering hubs to control a board by a remote entity.
* [Arduino Uno Example](http://wifinodebot.blogspot.com.co/2016/02/blink-led-over-wifi-with-nodejs-johnny.html)
* [Javascript robotics and browser-based Arduino control](http://www.instructables.com/id/Javascript-robotics-and-browser-based-Arduino-cont/)
