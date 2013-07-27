/**
* Movie related api calls
*/
var conf = require('../helpers/conf'),
  database = require('../helpers/database').database,
  movie = require('./movies'),
  client = require('../helpers/client'),
  headers = { 
    accept: 'application/json' 
  },
  ratingsCollection = 'rating',
  moviesCollection = 'movie';

var db = new database();

exports.get = function(req, res){
  var id = req.params.id;
  var getMovies = req.query.movies;
  if(id){
    db.getCollection(ratingsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id}, {ratings:1}, function(err, item){
          if(err){
            res.send({ code:1, user:id, ratings:{}, movies:{}});
          }
          if(item){
            var ratings = item.ratings;
            if(getMovies && ratings){
              var movies = [];
              var mids = Object.keys(JSON.parse(ratings));
              db.getCollection(moviesCollection, function(collection){
                if(collection){
                  var i=0;
                  for(; i<mids.length; i++) { mids[i] = parseInt(mids[i]); } // convert to array of ints
                  collection.find({'id': { $in: mids}}, {id:1, belongs_to_collection:1, backdrop_path:1, genres:1 , original_title:1, poster_path:1, release_date:1, title:1 }).toArray(function(err, movies){
                    res.send({code:0, user:id, ratings: ratings, movies: movies});
                  });
                }else{
                  res.send({code:0, user:id, ratings: ratings, movies:movies});
                }
              });
            }else{
              res.send({code:0, user:id, ratings:ratings, movies:{}});
            }
          }else{
            res.send({code:0, user:id, ratings:{}, movies:{}});
          }
        });
      }else{
        res.send({code:1, user:id, ratings:{}, movies:{}});
      }
    });
  }else{
    res.send({code:1, user:id, ratings:{}, movies:{}});
  }
}

exports.add = function(req, res){
  var id = req.body.uid;
  var rating = req.body.rating;
  movie.add(rating.mid);
  if(id){
    db.getCollection(ratingsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id}, {ratings:1}, function(err, item){
          if(err){
            res.send({code:1, message:'Operation failed'});
          }
          if(item){
            var ratings = JSON.parse(item.ratings);
            ratings[rating.mid] = rating.val;
            collection.update({userId: id}, {$set: {ratings:JSON.stringify(ratings)}}, {}, function(err, item){
              res.send({code:0, message:'Rating added'});
            });
          }else{
            var ratings = {};
            ratings[rating.mid] = rating.val;
            collection.insert({userId: id, ratings:JSON.stringify(ratings)}, function(err, item){
              res.send({code:0, message:'Rating added'});
            });
          }
        });
      }else{
        res.send({code:1, message:'Operation failed'});
      }
    });
  }else{
    res.send({code:1, message:'Operation failed'});
  }
}

exports.delete = function(req, res){
  var id = req.body.uid;
  var rating = JSON.parse(req.body.rating);
  if(id){
    db.getCollection(ratingsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id}, {ratings:1}, function(err, item){
          if(err){
            res.send({code:1, message:'Operation failed'});
          }
          if(item){
            var ratings = JSON.parse(item.ratings);
            delete ratings[rating.mid];
            console.log(ratings);
            collection.update({userId: id}, {$set: {ratings:JSON.stringify(ratings)}}, {}, function(err, item){
              res.send({code:0, message:'Rating deleted'});
            });
          }else{
            res.send({code:1, message:'Operation failed'});
          }
        });
      }else{
        res.send({code:1, message:'Operation failed'});
      }
    });
  }else{
    res.send({code:1, message:'Operation failed'});
  }
}

