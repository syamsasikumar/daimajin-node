
var conf = require('../helpers/conf');
var database = require('../helpers/database').database;
var collectionName = 'user';
var crypto = require("crypto");

var headers = { 
  accept: 'application/json' 
};

var db = new database();

exports.login = function(req, res){
  //var name = req.body.name;
  //var pass = (req.body.pass != undefined)? crypto.createHash('md5').update(req.body.pass).digest("hex"): '';
  var name = req.query.name;
  var pass = ( req.query.pass != undefined )? crypto.createHash('md5').update(req.query.pass).digest("hex"): undefined;
  if(name != undefined && pass != undefined){
    db.getCollection(collectionName, function(collection){
      if(collection){
        collection.findOne({name:name, pass:pass}, {_id:1, name:1}, function(err, item){
          if(err){
            res.send({code:1, status:'error'});
          }
          if(item){
            req.session.user_id = item._id;
            res.send({code:0, status:'user logged in', '_id':item._id, 'name':item.name});
          }else{
            res.send({code:1, status:'error'});
          }
        });
      }else{
        res.send({code:1, status:'error'});
      }
    });
  }else{
    res.send({code:1, status:'error'});
  }
}

exports.register = function(req, res){
  //var name = req.body.name;
  //var pass = (req.body.pass != undefined)? crypto.createHash('md5').update(req.body.pass).digest("hex"): '';
  var name = req.query.name;
  var pass = ( req.query.pass != undefined )? crypto.createHash('md5').update(req.query.pass).digest("hex"): undefined;
  if(name != undefined && pass != undefined && req.query.pass == req.query.cpass){
    db.getCollection(collectionName, function(collection){
      if(collection){
        collection.findOne({name:name}, function(err, item){
          if(err){
            res.send({code:1, status:'error'});
          }
          if(item){
            res.send({code:1, status:'user already exists'});
          }else{
            collection.insert([{name:name, pass:pass}], function(err, rec){
              req.session.user_id = rec[0]._id;
              res.send({code:0, status:'user registered successfully', '_id':rec[0]._id, 'name':name });
            })
          }
          
        });
      }else{
        res.send({code:1, status:'error'});
      }
    });
  }else{
    res.send({code:1, status:'error'});
  }
}