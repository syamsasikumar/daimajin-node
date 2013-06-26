var request = require('request');
var http = require('http');
var port = process.env.PORT || 8081;
var api_key = '2b8c09380433776e2676d7a7ef694d48';// @TODO: hide me !
var movie_url = 'http://api.themoviedb.org/3/search/movie?api_key='+ api_key + '&search_type=ngram'; //TMDB movie query api
var resource_url = 'http://api.themoviedb.org/3/movie/<resource>?api_key=' + api_key + '&append_to_response=casts,trailers,similar_movies'; //TMDB movie resource api
var conf_url = 'http://api.themoviedb.org/3/configuration?api_key=' + api_key; //TMDB movie resource api
var pop_url = 'http://api.themoviedb.org/3/movie/popular?api_key=' + api_key;
var url = require('url');


var server = http.createServer(function (req, res) {
  var parts = url.parse(req.url, true).query;
  var q = parts.q;
  var page = parts.page == undefined? 1: parts.page;
  var id = parts.movie;
  var is_conf = parts.conf;
  var is_pop = parts.popular;

  res.writeHead(200);
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'});
  
  if(q == undefined && id == undefined && is_conf == undefined && is_pop == undefined){
    res.end(JSON.stringify({}));
  }else{
    var api_url = '';
    if(is_pop != undefined){
      api_url = pop_url;
    }else if(is_conf != undefined){
      api_url = conf_url;
    }else if(id != undefined){
      api_url = resource_url.replace('<resource>',id);
    }else{
      api_url = movie_url + '&query=' + q.split(' ').join('+') + '&page=' + page;
    }
    request(
      {
        uri:api_url,
        headers:{
          accept: 'application/json'
        }
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.end(body);
        }
        else{
          res.end(JSON.stringify({}));
        }
    });
  }
});

server.listen(port);