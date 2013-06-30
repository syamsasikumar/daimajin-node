/**
* Movie related api calls
*/
var app_global = require('../helpers/app_global');
var database = require('../helpers/database').database;
var client = require('../helpers/client');
var headers = { 
  accept: 'application/json' 
};
var db = new database();
var userCollection = db.getCollection('test');


//Response callback
var send = function(res, body){
  res.send(body);
}

exports.conf = function(req, res){
  userCollection.insert({'1': 'blah'}, {safe: true}, function(er,rs) {
    console.log(er);
  });
  userCollection.insert({'2': 'blah'}, {safe: true}, function(er,rs) {
    console.log(er);
  });
  client.call(app_global.urls.conf, headers, res, send);
}

exports.casts = function(req, res){
  client.call(app_global.urls.person.replace('<resource>', req.params.id), headers, res, send);
}

exports.popular = function(req, res){
  client.call(app_global.urls.popular, headers, res, send);
}

exports.search = function(req, res){
  client.call(app_global.urls.search + '&query=' + req.query.q.split(' ').join('+') + '&page=' + (req.query.page != undefined ? req.query.page: 1), 
             headers, 
             res, 
             send);
}

exports.movie = function(req, res){
  client.call(app_global.urls.movie.replace('<resource>', req.params.id), headers, res, send);
}
