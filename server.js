//Variables
var pathname = 'oldtodos.json';
var port = 3000;

var express = require("express");
var bodyParser = require('body-parser');
var url = require("url");
var http = require("http");
var app = express();
var jsonfile = require('jsonfile');

app.use(express.static(__dirname + "/Client"));
app.use(bodyParser.urlencoded({ extended: false }));


var fs = require('fs');
var tasks = JSON.parse(fs.readFileSync(pathname, 'utf8'));

http.createServer(app).listen(port);

app.get("/todos.json", function (req, res) {
    res.json(tasks);
});

app.post("/addtodo", function (req, res) {
    var newTodo = req.body;

/*
    if(newTodo === undefined || newTodo == undefined) {
        res.json({"message": "败北"});
    } else {
        res.json({"message": "胜利"});
    }
*/
   
   
    fs.writeFile("newtodo.json", newTodo[0], function(err) {
        if(err) {
            res.json({"message":"Storing data failed"});
        } else {
            res.json({"message":"Data stored successfully"});
       }
    });
    
});
