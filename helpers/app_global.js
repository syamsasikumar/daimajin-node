/**
* Global settings
*/
var app_global = {
  port : (process.env.PORT || 8081),
  api_key : '2b8c09380433776e2676d7a7ef694d48' //@hide-me!
}

app_global.urls = {
  search : 'http://api.themoviedb.org/3/search/movie?api_key=' + app_global.api_key + '&search_type=ngram',
  movie : 'http://api.themoviedb.org/3/movie/<resource>?api_key=' + app_global.api_key + '&append_to_response=casts,trailers,similar_movies',
  conf : 'http://api.themoviedb.org/3/configuration?api_key=' + app_global.api_key,
  popular : 'http://api.themoviedb.org/3/movie/popular?api_key=' + app_global.api_key
};

module.exports = app_global;