var sys = require("sys"),
    ws = require("./ws");
var fs = require('fs');

var spawn = require('child_process').spawn,
  vhosts = spawn('tail', ['-f', '/var/log/apache2/other_vhosts_access.log']);

var spawn2 = require('child_process').spawn,
  error = spawn('tail', ['-f', '/var/log/apache2/error.log']);

function doit(ws) {
  var outd = '';

  vhosts.stdout.on("data", function (data) {
    ws.write("{\"vhosts\" : \"" + escape(data) + "\"}");
    sys.puts(data);
  });

  error.stdout.on("data", function (data) {
    ws.write("{\"error\" : \"" + escape(data) + "\"}");
    sys.puts(data);
  });

}

  ws.createServer(function (websocket) {
    websocket.addListener("connect", function (resource) { 
      // emitted after handshake
      sys.debug("connect: " + resource);

      // server closes connection after 10s, will also get "close" event
      setInterval(doit(websocket), 1000); 
    }).addListener("data", function (data) { 
      // handle incoming data
      sys.debug(data);

      // send data to client
      websocket.write("Thanks!");
    }).addListener("close", function () { 
      // emitted when server or client closes connection
      sys.debug("close");
    });
  }).listen(8081);
