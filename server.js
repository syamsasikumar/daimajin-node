

var express = require('express'),
    conf = require('./helpers/conf'),
    movies = require('./routes/movies'),
    lists = require('./routes/lists'),
    users = require('./routes/users');

 
var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: conf.secret
}));

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

// global set response headers
app.get('/*',function(req,res,next){
    res.set({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'
    });
    next();
});

app.listen(conf.port);

//REST APIs
app.get('/movies/conf', movies.conf);
app.get('/movies/popular', movies.popular);
app.get('/movies/search', movies.search);
app.get('/movies/:id', movies.movie);
app.get('/movies/casts/:id', movies.casts);
app.get('/users/login', users.login); // @TODO: change to post
app.get('/users/register', users.register); // @TODO: change to post
app.get('/users/:id', users.user);
//TODO:

//app.get('/users/ratings', users.ratings);
//app.get('/users/lists', users.lists);
//app.get('/lists/:id', lists.movies);
//app.get('/users/friends', users.friends);