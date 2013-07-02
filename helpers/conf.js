/**
* Global settings
*/
var conf = {
  port : (process.env.PORT || 8081),
  api_key : <api_key>, //@hide-me!
  secret: <secret>
}

conf.urls = {
  search : 'http://api.themoviedb.org/3/search/movie?api_key=' + conf.api_key + '&search_type=ngram',
  movie : 'http://api.themoviedb.org/3/movie/<resource>?api_key=' + conf.api_key + '&append_to_response=casts,trailers,similar_movies',
  conf : 'http://api.themoviedb.org/3/configuration?api_key=' + conf.api_key,
  popular : 'http://api.themoviedb.org/3/movie/popular?api_key=' + conf.api_key,
  person : 'http://api.themoviedb.org/3/person/<resource>?api_key=' + conf.api_key + '&append_to_response=credits'
};

conf.mongo_config = {
  url : <url>,
  port : <port>,
  user : <user>,
  pass : <pass>,
  db_name : <dbname>
}

module.exports = conf;