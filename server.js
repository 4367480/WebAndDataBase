//Import http module
var http = require("http"),
    server;

server = http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Sieg Heil\n");
});

server.listen(3000);

console.log("Server running on port 3000");
