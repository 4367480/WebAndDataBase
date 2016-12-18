//Variables
var pathname = 'oldtodos.json';
var port = 3000;

var express = require("express");
var bodyParser = require('body-parser');
var url = require("url");
var http = require("http");
var app = express();
var jsonfile = require('jsonfile');
var mysql = require('mysql');

app.use(express.static(__dirname + "/Client"));
app.use(bodyParser.urlencoded({ extended: false }));

var mysqlconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'webdata',
    database: 'todos'
});
mysqlconnection.connect();

http.createServer(app).listen(port);

app.get("/todos.json", function (req, res) {
    mysqlconnection.query('select * from todos', function(err, result) {
        if(err){
            console.error(err);
        }
        res.json(result);
        return ;
    });

});

app.post("/addtodo", function (req, res) {
    var newTodo = req.body;
    newTodo.id = "";    //Remove id

    var query = mysqlconnection.query('insert into todos set ?', newTodo, function(err, result){
    if(err){
        res.json({"message":"An error has occurred"});
        console.error(err);
        return;
    } else {
        res.json({"message":"Entry has been saved"});
        console.log("User added entry to database");
    }
    });

});

app.post("/removetodo", function (req, res) {
    var removeTodo = req.body;
    var taskid = removeTodo.id;
    
    var query = mysqlconnection.query('delete from todos where todos.id = ?', taskid, function(err, result){
    if(err){
        res.json({"message":"An error has occurred"});
        console.error(err);
        return;
    }else {
        res.json({"message":"Entry has been saved"});
    }
    });

});

app.post("/edittodo", function (req, res) {
    var editTodo = req.body;

    var mysql_text = 'UPDATE todos set todos.taskname = :editTodo.taskname, todos.tasktag = :editTodo.tasktag, todos.taskpriority = :editTodo.taskpriority, todos.taskduedate = :editTodo.taskduedate, todos.reminder = :editTodo.reminder, todos.note = :editTodo.note, todos.taskactive = :editTodo.taskactive where todos.id = :editTodo.id';
    var query = mysqlconnection.query(mysql_text, editTodo, function(err, result){
    if(err){
        res.json({"message":"An error has occurred"});
        console.error(err);
        return;
    } else {
        res.json({"message":"Entry has been saved"});
        console.log("User has changed a todo");
    }
    });
});