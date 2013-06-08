Backend server running on node.js deployed on heroku. Acts as a wrapper for querying RT api. 

url: http://daimajin.herokuapp.com
response type: application/json

If movie id is provided, call RT movies/<id>.json
If query is provided (GET 'q') then queries movies.json api

Sample usage-
http://daimajin.herokuapp.com/?q=journey%20to%20the%20center

