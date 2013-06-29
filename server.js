

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