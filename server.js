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
    tasks.push(newTodo);

    fs.writeFile("newtodo.json", JSON.stringify(tasks), function(err) {
        if(err) {
            res.json({"message":"Storing data failed"});
        } else {
            res.json({"message":"Data stored successfully"});
       }
    });

});

app.post("/removetodo", function (req, res) {
    var newTodo = req.body;
    
    for(var i = 0; i < tasks.length; i++) {
        console.log("We're still going" + i);
    }


});