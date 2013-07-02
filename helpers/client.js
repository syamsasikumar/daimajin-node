/**
* Helper to make external API calls
*/
var request = require('request');
exports.call = function(uri, headers, res, send){
  request(
  {
    uri: uri,
    headers: headers
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      send(res, body);
    }
    else{
      send(res, JSON.stringify({}));
    }
  });
};