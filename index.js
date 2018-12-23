var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/2_hashtag.html'));
});

app.get('/stream', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/hashtag_stream.html'));
});

app.use('/static',express.static(__dirname+'/public'));
app.listen(3000);