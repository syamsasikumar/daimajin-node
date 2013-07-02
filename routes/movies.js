/**
* Movie related api calls
*/
var conf = require('../helpers/conf');
var db = require('../helpers/database');
var client = require('../helpers/client');
var headers = { 
  accept: 'application/json' 
};

//Response callback
var send = function(res, body){
  res.send(body);
}

exports.conf = function(req, res){
  client.call(conf.urls.conf, headers, res, send);
}

exports.casts = function(req, res){
  client.call(conf.urls.person.replace('<resource>', req.params.id), headers, res, send);
}

exports.popular = function(req, res){
  client.call(conf.urls.popular, headers, res, send);
}

exports.search = function(req, res){
  client.call(conf.urls.search + '&query=' + req.query.q.split(' ').join('+') + '&page=' + (req.query.page != undefined ? req.query.page: 1), 
             headers, 
             res, 
             send);
}

exports.movie = function(req, res){
  client.call(conf.urls.movie.replace('<resource>', req.params.id), headers, res, send);
}
