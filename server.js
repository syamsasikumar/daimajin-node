

var express = require('express'),
    conf = require('./helpers/conf'),
    movies = require('./routes/movies'),
    lists = require('./routes/lists'),
    ratings = require('./routes/ratings'),
    users = require('./routes/users'),
    crypto = require("crypto");

 
var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: conf.secret
}));

var setHeaders = function(req, res){
    res.set({
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Max-Age': '1728000'
  });
}

function checkAuth(req, res, next) {
  var token = (req.body.uid != undefined)? crypto.createHash('md5').update(req.body.uid).digest("hex"): '';
  if (req.body.token != token) {
    res.send('You are not authorized to view this page');
  } else {
    //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

// global set response headers
app.options('/*',function(req,res,next){
  setHeaders(req, res);
  res.send('');
});

// global set response headers
app.get('/*',function(req,res,next){
  setHeaders(req, res);
  next();
});

// global set response headers
app.put('/*',function(req,res,next){
  setHeaders(req, res);
  next();
});

// global set response headers
app.post('/*',function(req,res,next){
  setHeaders(req, res);
  next();
});

// global set response headers
app.delete('/*',function(req,res,next){
  setHeaders(req, res);
  next();
});

app.listen(conf.port);

//REST APIs
app.get('/movies/conf', movies.conf);
app.get('/movies/popular', movies.popular);
app.get('/movies/search', movies.search);
app.get('/movies/:id', movies.movie);
app.get('/movies/casts/:id', movies.casts);
app.post('/users/login', users.login);
app.post('/users/register', users.register);
app.get('/users/:id', users.user);
app.get('/users/ratings/:id', ratings.getRatings);
app.put('/users/ratings', checkAuth, ratings.addRating);
app.delete('/users/ratings', checkAuth, ratings.deleteRating);
//TODO:

//app.get('/users/ratings', users.ratings);
//app.get('/users/lists', users.lists);
//app.get('/lists/:id', lists.movies);
//app.get('/users/friends', users.friends);