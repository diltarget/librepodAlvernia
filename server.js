var app = require('express')();

var http = require('http').Server(app);

var io = require('socket.io')(http);
var librepod = require('librepod');
librepod.lib.load(function(){
	librepod.script.load(function(){});
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){  
  var interval = setInterval(function () {  
       	lib.call('datastore', "getStore", {store:"temp"}, function(out){  
			socket.emit("info", {info: out}); 
		});										
    }, 10000);    

    socket.on("disconnect", function () {  
        clearInterval(interval);
    });
});

http.listen(8000, function(){          
  console.log('listening on *:8000');  
});
