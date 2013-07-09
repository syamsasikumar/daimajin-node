/**
* Movie related api calls
*/
var conf = require('../helpers/conf'),
    database = require('../helpers/database').database,
    client = require('../helpers/client'),
    headers = { 
      accept: 'application/json' 
    },
    movieCollection = 'movie';

var db = new database();

//Response callback
var send = function(res, body){
  res.send(body);
}

//Insert callback
var insert = function(res, body){
  var movie = JSON.parse(body);
  if(movie.id){
    db.getCollection(movieCollection, function(collection){
      if(collection){
        collection.update( { id : movie.id }, { $set: movie }, { upsert: true } );
      }
    });
  }
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

exports.add = function(id){
  client.call(conf.urls.movie.replace('<resource>', id), headers, {}, insert);
}