/**
* Common db class
*/
var mongodb = require('mongodb');

function database(){
  this.url = 'ds033828.mongolab.com';
  this.port = 33828;
  this.user='daimajin';
  this.pass='daimajin123';
  this.db_name = 'daimajin';
  this.db = undefined;

  this.init = function(){
    var server = new mongodb.Server(this.url, this.port, {
      auto_reconnect: true
    });
    var that = this;
    this.db = new mongodb.Db(this.db_name, server);
    this.db.open(function(err, db) {
      if( err ) {
        console.log(err);
        return false;
      }
      that.db = db;
      console.log('Database connected');
      that.db.authenticate(that.user, that.pass, function(err) {
        if (err) {
          console.log(err);
          return false;
        }
        console.log('Database user authenticated');
      });
    });
  }
}

database.prototype.getCollection = function(collectionName){
  if(this.db == undefined){
    this.init();
  }
  return new mongodb.Collection(this.db, collectionName);
}

exports.database = database;