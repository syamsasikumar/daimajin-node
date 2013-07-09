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
  ratingsCollection = 'rating';

var db = new database();

exports.get = function(req, res){
  var id = req.params.id;
  if(id){
    db.getCollection(ratingsCollection, function(collection){
      if(collection){
        collection.findOne({userId: id}, {ratings:1}, function(err, item){
          if(err){
            res.send({ code:1, user:id, ratings:{}});
          }
          if(item){
            res.send({code:0, user:id, ratings:item.ratings});
          }else{
            res.send({code:0, user:id, ratings:{}});
          }
        });
      }else{
        res.send({code:1, user:id, ratings:{}});
      }
    });
  }else{
    res.send({code:1, user:id, ratings:{}});
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

