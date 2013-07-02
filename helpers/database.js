/**
* Common db class
*/
var mongodb = require('mongodb');

var database = function(){
  this.conn = undefined;
}

database.prototype.getCollection = function(collectionName, callback){
  var conf = require('./conf');
  if(this.conn == undefined){
    var server = new mongodb.Server(conf.mongo_config.url, conf.mongo_config.port, {
      auto_reconnect: true
    });
    var that = this;
    this.conn = new mongodb.Db(conf.mongo_config.db_name, server);
    this.conn.open(function(err, conn) {
      if( err ) {
        console.log(err);
        return;
      }
      that.conn = conn;
      that.conn.authenticate(conf.mongo_config.user, conf.mongo_config.pass, function(err) {
        if (err) {
        console.log(err);
        return;
        }
        that._fetch(that.conn, collectionName, callback);
      });
    });
  }else{
    this._fetch(this.conn, collectionName, callback);
  }
  this._fetch(this.conn, collectionName, callback);
}

database.prototype._fetch = function(conn, collectionName, callback){
  if(conn){
    callback(new mongodb.Collection(conn, collectionName));
  }else{
    callback(false);
  }
}

exports.database = database;