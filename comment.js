//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

//create a server
app.listen(3000, function(){
    console.log('Server is running on port 3000');
});

//use body parser
app.use(bodyParser.json());

//get all comments
app.get('/comments', function(req, res){
    fs.readFile('comments.json', function(err, data){
        if(err){
            console.log(err);
            res.status(500).send('Server error');
        }
        res.send(JSON.parse(data));
    });
});

//get a single comment
app.get('/comments/:id', function(req, res){
    fs.readFile('comments.json', function(err, data){
        if(err){
            console.log(err);
            res.status(500).send('Server error');
        }
        let comments = JSON.parse(data);
        let comment = comments.find(comment => comment.id == req.params.id);
        if(comment){
            res.send(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    });
});

//add a comment
app.post('/comments', function(req, res){
    fs.readFile('comments.json', function(err, data){
        if(err){
            console.log(err);
            res.status(500).send('Server error');
        }
        let comments = JSON.parse(data);
        let newComment = {
            id: req.body.id,
            message: req.body.message,