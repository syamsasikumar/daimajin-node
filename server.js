

var express = require('express'),
    auth = require('./helpers/auth'),
    app_global = require('./helpers/app_global'),
    movies = require('./routes/movies'),
    lists = require('./routes/lists'),
    users = require('./routes/users');

 
var app = express();



// global set response headers
app.get('/*',function(req,res,next){
    res.set({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'
    });
    next();
});


var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://daimajin:daimajin123@ds033828.mongolab.com:33828/daimajin'; 

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('test', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
      console.log(er);
    });
  });
});

app.listen(app_global.port);

//REST APIs
app.get('/movies/conf', movies.conf);
app.get('/movies/popular', movies.popular);
app.get('/movies/search', movies.search);
app.get('/movies/:id', movies.movie);
app.get('/movies/casts/:id', movies.casts);

//TODO:
//app.post('/login', auth.login);
//app.post('/register', auth.login);
//app.get('/users/ratings', users.ratings);
//app.get('/users/lists', users.lists);
//app.get('/lists/:id', lists.movies);
//app.get('/users/friends', users.friends);