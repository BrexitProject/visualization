var express = require('express');
var app = express();
var path = require('path');

app.get('/bubble', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/2_hashtag.html'));
});

app.get('/stream', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/hashtag_stream.html'));
});

app.get('/liner', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/liner.html'));
});

app.get('/block', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/block.html'));
});

app.get('/wordProbability', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/wordProbability.html'));
});

app.use('/static',express.static(__dirname+'/public'));

app.listen(3000);