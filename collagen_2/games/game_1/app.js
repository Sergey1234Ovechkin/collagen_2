const http = require('http');
const fs = require("fs");
const path = require("path");
////////////////////////////////////////
const server = http.createServer((req, res) => { 

   var parsUrl  = path.parse(req.url);	
   if(req.url === '/' && req.method.toLowerCase() === 'get'){	  
	  
            readFile(req, res, "./index.html");			
  } 
  else if(parsUrl.dir.split("/")[1] == "img" ||  parsUrl.dir.split("/")[1] == "js" ||  parsUrl.dir.split("/")[1] == "css"){	  
	  var dir = parsUrl.dir;	  
	  var nameFile = "../../.."+dir+"/"+parsUrl.base;	  
	  readFile(req, res, nameFile);		
  } 
  else if( parsUrl.dir.split("/")[1] == "collagen_2" ){	  
	  var dir = parsUrl.dir;	  
	  var nameFile = "../"+parsUrl.base;
	  if(parsUrl.dir.split("/")[3]== "game_1")nameFile = "../game_1/"+parsUrl.base;
      //console.log( nameFile);	  
	  readFile(req, res, nameFile);
		
  } 
  else {	                  
                console.log(req.url+"not found");
                res.statusCode = 404;
                res.end("Resourse not found!");
  }
});
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/ ...');
});

//функция читает и отправляет файл
function readFile(req, res, nameFile){
		 fs.readFile(nameFile, function(error, data){                
            if(error){
                     
                res.statusCode = 404;
                res.end("Resourse not found!");
            }   
            else{
                res.end(data);
            }			
        });		
}
///////тестирование соккет соединения
/*
var socketjs = require('socket.js');

socketjs(server, function(socket, reconnectData) {
  // if we get disconnected and subsequently reconnect, the client can pass data here
  if (reconnectData === null) {
    console.log('A user connected.');
  } else {
    console.log('A user reconnected with: ', reconnectData);
  }

  // log messages as they arrive
  socket.receive('greeting', function(message) {
    console.log('Received:', message);
  });

  // periodically send messages to the client
  var interval = setInterval(function() {
    socket.send('greeting', 'Hello from the server!');
  }, 1000);

  // if the client disconnects, stop sending messages to it
  socket.close(function() {
    console.log('A user disconnected.');

    clearInterval(interval);
  });
});
*/