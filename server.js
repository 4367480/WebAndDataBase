var express = require("express"),
http = require("http"),
app = express();

app.use(express.static(__dirname + "/Client"));
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('oldtodos.json', 'utf8'));

http.createServer(app).listen(3000);

app.get("/todos.json", function (req, res) {
res.json(obj);
});

app.post("/todos", function (req, res) {
console.log("data has been posted to the server!");
// send back a simple object
res.json({"message":"You posted to the server!"});
});
