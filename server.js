'use strict';

/* Zero-dependency static server for TicketTray.
 * Usage: node server.js  (PORT env var, default 4173)
 */

var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var PORT = Number(process.env.PORT || 4173);

var TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

var server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') { urlPath = '/index.html'; }
  var filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath.indexOf(ROOT) !== 0) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, function () {
  console.log('TicketTray running at http://localhost:' + PORT + '/');
});
