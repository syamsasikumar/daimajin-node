var request = require('request');
var http = require('http');
var port = process.env.PORT || 8000;

request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
	var server = http.createServer(function (req, res) {
	  res.writeHead(200);
	  res.end(body);
	});
	server.listen(port);
  }
});




