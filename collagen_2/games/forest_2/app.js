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
	  
	  ///папка названия игры
	  if(parsUrl.dir.split("/")[3]== "forest_2")nameFile = "../forest_2/"+parsUrl.base;
      //console.log( nameFile);	  
	  readFile(req, res, nameFile);
		
  } 
  else {	                  
                console.log(req.url+"not found");
                res.statusCode = 404;
                res.end("Resourse not found!");
  }
  server.on('close', (req, clientSocket, head) => {console.log("close");})
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





//при выходе игрока сервер перезагружается 
/// для корректной работы использовать модуль forever.  Запуск сервера:   forever start app.js	

var users = {};
var socketjs = require('socket.js');

///////связь с другими клиентами
////данные анимации всех игроков
socketjs(server, function(socket, reconnectData) {
	
   console.log(reconnectData);
   
  //подключение нового пользователя
  if (reconnectData === null) {
    console.log('A user connected.');
  } else {
    console.log('A user reconnected with: ', reconnectData);
  }
 
  ///новый игрок обновляем users
   socket.receive('newuser', function(message) {
	users[message.id] = message;
	///console.log(users);
  });
  
  
  // сообщения с клиента
  socket.receive('coord', function(message) {
	users[message.id] = message;  
    //console.log('Received:', message);
  });

  //сообщения игрокам каждые 100ms
  var interval = setInterval(function() {
		socket.send('coord', users);
  }, 100);




  // if the client disconnects, stop sending messages to it
  socket.close(function(data) {
	console.log(data);  
    console.log('A user disconnected.');
    clearInterval(interval);
	return data;
  });
});
