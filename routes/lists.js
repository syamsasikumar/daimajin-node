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
  listsCollection = 'list',
  moviesCollection = 'movie';

var db = new database();

exports.get = function(req, res){
  var id = req.params.id;
  var lid = ('lid' in req.query)? req.query.lid: undefined;
  //single list + fetch movies
  if(id && lid){
    console.log('here');
    db.getCollection(listsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id, _id: db.getObjectId(lid)}, {_id:1, name:1, description:1, movies:1, color:1}, function(err, item){
          if(err){
            res.send({ code:1, user:id, list:{}});
          }
          if(item){
            var list = item;
            var movieIds = Object.keys(list.movies);
            if(movieIds.length){
              db.getCollection(moviesCollection, function(collection){
                if(collection){
                  var i=0;
                  for(; i<movieIds.length; i++) { movieIds[i] = parseInt(movieIds[i]); } // convert to array of ints
                  collection.find({'id': { $in: movieIds}}, {id:1, belongs_to_collection:1, backdrop_path:1, genres:1 , original_title:1, poster_path:1, release_date:1, title:1 }).toArray(function(err, movies){
                    res.send({ code:0, user:id, list:{ id:lid, name:list.name, description:list.description, color:list.color,  movies:movies}});
                  });
                }else{
                  res.send({ code:0, user:id, list:{ id:lid, name:list.name, description:list.description, color:list.color,  movies:list.movies}});
                }
              });
            }else{
              res.send({ code:0, user:id, list:{ id:lid, name:list.name, description:list.description, color:list.color,  movies:list.movies}});
            }
            
          }else{
            res.send({ code:1, user:id, list:{}});
          }
        });
      }else{
        res.send({ code:1, user:id, list:{}});
      }
    });
  }else if(id){
    //all lists
    db.getCollection(listsCollection, function(collection){
      if(collection){
        collection.find({userId: id}, {_id:1, name:1, description:1, movies:1, color:1}).toArray(function(err, lists){
          if(err){
            res.send({ code:1, user:id, lists:{} });
          }
          if(lists.length){
            var listsR = {};
            for(var key in lists){
              lists[key]._id = lists[key]._id.toString();
              listsR[lists[key]._id] = lists[key];
            }
            res.send({ code:0, user:id, lists:listsR });
          }else{
            res.send({ code:0, user:id, lists:{}});
          }
        });
      }
    });
  }else{
    //incomplete request
    res.send({ code:1, user:id, lists:{}});
  }
}

exports.add = function(req, res){
  var id = ('uid' in req.body)? req.body.uid: undefined;
  var mid = ('mid' in req.body)? req.body.mid: undefined;
  var list = ('list' in req.body)? req.body.list: undefined;
  var lid = list._id;
  if(id && lid){
    //If movie id is present, movie needs to be added to list
    if(mid){
      movie.add(mid);
      db.getCollection(listsCollection, function(collection){
        if(collection){
          collection.findOne({_id: db.getObjectId(lid)}, {movies:1}, function(err, item){
            if(err){
              res.send({code:1, message:'Operation failed'});
            }
            var movieList = item.movies;
            movieList[mid] = mid;
            collection.update({userId: id, _id: db.getObjectId(lid)}, {$set: {movies: movieList}}, {}, function(err, item){
              if(err){
                res.send({code:1, message:'Operation failed'});
              }else{
                res.send({code:0, message:'List updated'});
              }
            });
          });
        }
      });
    }else{
      //If no mid present the list data needs to be updated
      db.getCollection(listsCollection, function(collection){
        if(collection){
          collection.update({_id: db.getObjectId(lid)}, {$set: {name: list.name, description: list.description, color: list.color}}, {}, function(err, item){
            if(err){
              res.send({code:1, message:'Operation failed'});
            }else{
              res.send({code:0, message:'List updated'});
            }
          });
        }else{
          res.send({code:1, message:'Operation failed'});
        }
      });
    }
  }else if(id && !lid){
    //add a new list
    db.getCollection(listsCollection, function(collection){
      if(collection){
        var movies = (list.movies)?list.movies:{};
        collection.insert({userId: id, name: list.name, description: list.description, color: list.color, movies:movies, created: new Date()}, {}, function(err, item){
          if(err){
            res.send({code:1, message:'Operation failed'});
          }
          res.send({code:0, message:'List added', id: item[0]._id.toString()});
        });
      }
    });
  }else{
    //incomplete request
    res.send({code:1, message:'Operation failed'});
  }
}

exports.delete = function(req, res){
  var id = ('uid' in req.body)? req.body.uid: undefined;
  var mid = ('mid' in req.body)? req.body.mid: undefined;
  var lid = ('lid' in req.body)? req.body.lid: undefined;
  //single list - delete movie from list
  if(id && lid && mid){
    db.getCollection(listsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id, _id: db.getObjectId(lid)}, {movies:1}, function(err, item){
          if(err){
            res.send({code:1, message:'Operation failed'});
          }
          var movieList = item.movies;
          delete movieList[mid];
          collection.update({_id: db.getObjectId(lid)}, {$set: {movies: movieList}}, {}, function(err, item){
            if(err){
              res.send({code:1, message:'Operation failed'});
            }else{
              res.send({code:0, message:'List updated'});
            }
          });
        });
      }
    });
  }else if(id && lid){
    //delete an entire list
    db.getCollection(listsCollection, function(collection){
      if(collection){
        collection.remove({userId: id, _id:db.getObjectId(lid)}, {}, function(err, item){
          if(err){
            res.send({code:1, message:'Operation failed'});
          }
          res.send({code:0, message:'List Deleted'});
        });
      }
    });
  }else{
    //incomplete request

  }
}

