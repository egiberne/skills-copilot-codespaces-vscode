//create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
//create server
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var mysql = require('mysql');
//connect to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
//get comment from database
app.get('/getComment', function(req, res) {
  var sql = "SELECT * FROM comment";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});
//post comment to database
app.post('/postComment', urlencodedParser, function(req, res) {
  var sql = "INSERT INTO comment (name, comment) VALUES ('" + req.body.name + "','" + req.body.comment + "')";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  res.send('Comment posted');
});
//delete comment from database
app.post('/deleteComment', urlencodedParser, function(req, res) {
  var sql = "DELETE FROM comment WHERE name = '" + req.body.name + "' AND comment = '" + req.body.comment + "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("1 record deleted");
  });
  res.send('Comment deleted');
});
//get comment from database
app.get('/getComment', function(req, res) {
  var sql = "SELECT * FROM comment";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});
//send comments to client
io.on('connection', function(socket) {
  socket.on('getComment', function() {
    var sql = "SELECT * FROM comment";
    con.query(sql, function(err, result) {
      if (err) throw err
