/**
* Global settings
*/
var conf = {
  port : (process.env.PORT || 8081),
  api_key : '2b8c09380433776e2676d7a7ef694d48', //@hide-me!
  secret: 'daimajin123'
}

conf.urls = {
  search : 'http://api.themoviedb.org/3/search/movie?api_key=' + conf.api_key + '&search_type=ngram',
  movie : 'http://api.themoviedb.org/3/movie/<resource>?api_key=' + conf.api_key + '&append_to_response=casts,trailers,similar_movies',
  conf : 'http://api.themoviedb.org/3/configuration?api_key=' + conf.api_key,
  popular : 'http://api.themoviedb.org/3/movie/popular?api_key=' + conf.api_key,
  person : 'http://api.themoviedb.org/3/person/<resource>?api_key=' + conf.api_key + '&append_to_response=credits'
};

conf.mongo_config = {
  url : 'ds033828.mongolab.com',
  port : 33828,
  user : 'daimajin',
  pass : 'daimajin123',
  db_name : 'daimajin'
}

module.exports = conf;