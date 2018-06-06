# WeMos D1 (ESP8266) Web Control Panel via WiFi
## using Firmata, Johnny Five and Socket.IO
* [WeMos D1](https://wiki.wemos.cc/products:d1:d1)
* [Johnny Five](http://johnny-five.io/)
* [Socket.IO](http://socket.io/) + [Socket.IO - Node.js Client](https://github.com/socketio/socket.io-client)

## Requirements
* make sure you have installed [Node.js](https://nodejs.org/) and Python in version 2.7
* you should have Arduino 1.6.8 or higher installed

## Installation
1. Follow [instructions](https://wiki.wemos.cc/tutorials:get_started:get_started_in_arduino) for installing the newest hardware package **using git** for [WeMos D1](https://wiki.wemos.cc/products:d1:d1).
	1. Install the required driver (CH340G or CP2104).
	2. Follow instructions from the `Using git version` section.
	3. While instaling the hardware package, make sure you have at least v2.2.0 of [ESP8266 Core](https://github.com/esp8266/Arduino) (on Mac, check in your terminal `cat ~/Documents/Arduino/hardware/esp8266com/esp8266/package.json`).
	4. After install hardware package, you will see WEMOS boards in the Tools→Board:xxx Choose your right board.
2. Then install newest Firmata from master branch from [git repository](https://github.com/firmata/arduino) (on Mac you have to delete existing Firmata directory `~/Documents/Arduino/libraries/Firmata` and then run `git clone git@github.com:firmata/arduino.git ~/Documents/Arduino/libraries/Firmata` in your terminal). Firmata is a protocol that will allow us to communicate with our microcontroller using languages like JavaScript.
3. Now you can use [StandardFirmataWiFi](https://github.com/firmata/arduino/tree/master/examples/StandardFirmataWiFi) (in Arduino, choose File -> Examples -> Firmata -> StandardFirmataWiFi) which enables the use of Firmata over a TCP connection and it can be configured as either a TCP server or TCP client.
	1. Configure `wifiConfig.h` (ESP8266 is enabled by default but follow all the 6 steps).
	2. You can skip step 2 and 4 but I prefer to have a static IP for both the computer and the board.
	2. Enable Serial debugging by uncommenting `//#define SERIAL_DEBUG` in StandardFirmataWiFi.
	3. Then upload the project to your WeMos D1 in Arduino IDE.
4. Check if the connection is configured properly by opening Serial Monitor (in Arduino, Tools -> Serial Monitor) at baud 9600. If the board is sending `WiFi connection failed` then try to reconfigure `wifiConfig.h` or try to use another WiFi point (your computer and the board should be in the same network).
	1. While I used hotspot on my mobile, it worked only for 2.4 GHz and not for 5 GHz.

*Yay, you board is configured and ready to communicate via Firmata with your JavaScript code on your computer!*

## Test Firmata.js with your board
Firmata.js is the base for Johnny Five so let's test it with our board which has StandardFirmataWiFi deployed. [Here's a simple Firmata.js client example with additional instructions](https://gist.github.com/soundanalogous/31a43d9c72ec6fbdf9631cfbe635d625) (remember to install dependencies by using command `npm install firmata etherport-client --save`).

## Test Johnny Five
If everything was done well, you can check simple J5 code (remember to install dependencies by using command `npm install johnny-five etherport-client --save`):
```javascript
var five = require("johnny-five");
var EtherPortClient = require("etherport-client").EtherPortClient;
// update host to the IP address for your ESP board
var board = new five.Board({
    port: new EtherPortClient({
        host: "10.0.0.17", // #TODO UPDATE!
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

## Build
Run `npm install` to install packages.

Start `server/server.js` on your server machine (command `node server/server.js`).

Update ESP device and server IP in `device/client.js` file and start client (command `node device/client.js`).

## Links
* [ESP8266 Firmata Issue on Github](https://github.com/firmata/arduino/issues/257)
* [etherport-client](https://github.com/mwittig/etherport-client) - Client-side virtual serial port for Rick Waldron's Etherport. Etherport-client is used to implement firmata-compatible boards and tethering hubs to control a board by a remote entity.
* [Arduino Uno Example](http://wifinodebot.blogspot.com.co/2016/02/blink-led-over-wifi-with-nodejs-johnny.html)
* [Javascript robotics and browser-based Arduino control](http://www.instructables.com/id/Javascript-robotics-and-browser-based-Arduino-cont/)
