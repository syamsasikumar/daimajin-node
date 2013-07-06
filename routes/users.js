
var conf = require('../helpers/conf');
var database = require('../helpers/database').database;
var collectionName = 'user';
var crypto = require("crypto");

var headers = { 
  accept: 'application/json' 
};

var db = new database();

exports.login = function(req, res){
  var name = req.body.name;
  var pass = (req.body.pass != undefined)? crypto.createHash('md5').update(req.body.pass).digest("hex"): '';
  if(name != undefined && pass != undefined){
    db.getCollection(collectionName, function(collection){
      if(collection){
        collection.findOne({name:name, pass:pass}, {_id:1, name:1}, function(err, item){
          if(err){
            res.send({code:1, status:'Login error'});
          }
          if(item){
            req.session.user_id = item._id;
            res.send({code:0, status:'User logged in', _id:item._id, token: crypto.createHash('md5').update(db.getObjectId(item._id)).digest("hex"), name:item.name, lists: {}, ratings:{}});
          }else{
            res.send({code:1, status:'Wrong username / password'});
          }
        });
      }else{
        res.send({code:1, status:'Login error'});
      }
    });
  }else{
    res.send({code:1, status:'Login error'});
  }
}

exports.register = function(req, res){
  var name = req.body.name;
  var pass = (req.body.pass != undefined)? crypto.createHash('md5').update(req.body.pass).digest("hex"): '';
  if(name != undefined && pass != undefined && req.body.pass == req.body.cpass){
    db.getCollection(collectionName, function(collection){
      if(collection){
        collection.findOne({name:name}, function(err, item){
          if(err){
            res.send({code:1, status:'Registration error'});
          }
          if(item){
            res.send({code:1, status:'User already exists'});
          }else{
            collection.insert([{name:name, pass:pass}], function(err, rec){
              req.session.user_id = rec[0]._id;
              res.send({code:0, status:'User registered successfully', _id:rec[0]._id, token: crypto.createHash('md5').update(db.getObjectId(rec[0]._id)).digest("hex"), name:name, lists: {}, ratings:{} });
            })
          }
          
        });
      }else{
        res.send({code:1, status:'Registration error'});
      }
    });
  }else{
    if(req.body.pass != req.body.cpass){
      res.send({code:1, status:'Password and confirm password dont match'});
    }else{
      res.send({code:1, status:'Registration error'});
    }
  }
}

exports.user = function(req, res){
  var id = req.params.id;
  if(id){
    db.getCollection(collectionName, function(collection){
      if(collection){
        collection.findOne({_id: db.getObjectId(id)}, {_id:1, name:1}, function(err, item){
          if(err){
            res.send({code:1, status:'error'});
          }
          if(item){
            req.session.user_id = item._id;
            res.send({code:0, status:'user data found', '_id':item._id, 'name':item.name});
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