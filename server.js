var request = require('request');
var http = require('http');
var port = process.env.PORT || 8080;
var api_key = '8j6p4xyu8mrkfsf65tzeyktn'; // @TODO: hide me !
var movie_url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+ api_key; //RT movie query api
var resource_url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/<resource>.json?apikey=' + api_key; //RT movie resource api
var url = require('url');


var server = http.createServer(function (req, res) {
  var parts = url.parse(req.url, true).query;
  var q = parts.q;
  var page_limit = parts.total == undefined? 5: parts.total;
  var page = parts.page == undefined? 1: parts.page;
  var id = parts.movie;

  res.writeHead(200);
  res.writeHead(200, {"Content-Type": "application/json"});

  if(q == undefined && id == undefined){
    res.end(JSON.stringify({}));
  }else{
    var api_url = '';
    if(id != undefined){
      api_url = resource_url.replace('<resource>',id);
    }else{
      api_url = movie_url + '&q=' + q.split(' ').join('+') + '&page=' + page + '&page_limit=' + page_limit;
    }
    request(api_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.end(body);
      }
    });
  }
});

server.listen(port);


