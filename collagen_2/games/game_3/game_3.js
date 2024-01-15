//////////////переопределяем размер карты
 var maxTranslate = [-1000, -0];
//адрес json файла спрайтов
var gameUrl = "http://localhost:3000/collagen_2/games/game_3/game_3.json";
var personageId = "personage";
//уникальное id для передачи данных на сервер (т.к. персонажи одинаковые для всех)
var userId = "user_" + Math.floor(Math.random() * 1000);

///изначальное количество объектов сцены
var numTiles = 0;

///количество игроков
var numUsers = 1;


//анимация сцены
function apply_code(){
	        //обновляем переменные для вколючения анимации
	  			mode = "animation";
				if (modules.animation)modules.animation.isOff = true;
				updateCommonTiles(HM.$props().sprites);
				updateBgTiles(HM.$props().sprites);
				//режим code чтобы обновлять только Tiles
				HM.$$("emiter-operation-with").set("code");
				

///создаем анимацию персонажа
				
modules.personage = null;

//находим объект персонажа в массиве tiles_common созданном в test 
for(var i=0; i<tiles_common.length; i++){	
	if(tiles_common[i].id == personageId){
		modules.personage = tiles_common[i];
	}
}

///флаг клика по кнопкам клавиатуры
var click  = false;
///интервал анимации движения персонажа
var interval  = 100;
var timerId  = 0;

///обработка событий нажатия стрелок
modules.keydown = function(key){
if(key == "ArrowUp"){				 
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, 11, 15, 12, 0, -10);			
}else if(key == "ArrowDown"){
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, -1, 3, 0, 0, 10);
}else if(key == "ArrowRight"){			 
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, 7, 11, 8, 10, 0);
		
}else if(key == "ArrowLeft"){
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, 3, 7, 4, -10, 0);
}
}
//обработка события отжатия кнопок-стрелок
modules.keyup = function(key){
      //  console.log(key);
		clearInterval(timerId);
		click = false;
}

///функция анимации движения персонажа и смены кадров;
function move(arg1,arg2,arg3, arg4, arg5) {
	     if(modules.personage.frame_index > arg1 &&  modules.personage.frame_index < arg2){ 
            modules.personage.nextFrame();}else{
            modules.personage.nextFrame(arg3);
		}
		modules.personage.move(arg4, arg5);		
}
//запуск цикла анимации обновления фоновых и основных спрайтов, в том числе персонажа
modules.animation=animationLopLayer(tiles_bg,tiles_common, 40);
				
}
///функция загрузки json файла, создания спрайтов и объектов сцены - Tile
fetch(gameUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {	  
	  //console.log(json)
	    var dataURL = 'data:image/png;base64,' + json.backImg;
		
		//ссылка на корневой объект 
	    var context  = HM;
	                    tiles_common_save = JSON.parse(json.tiles_common_save);				
				        tiles_bg_save = JSON.parse(json.tiles_bg_save); 						
						mainImgScale_x = 1;
						mainImgScale_y = 1; 
						img.src = dataURL;
						img.onload = function(){ 		
							startImg();	
						}
                        //создание всех спрайтов на которые будут ссылаться объекты сцены tiles						
						for(var key in  json.sprites){
							   var sprite = createFromPC(key, context, false, json.sprites[key]);
							   if(sprite)context.$$("emiter-create-sprite").set(key);									
						}
				tiles_bg = [];
                ///создание объектов фоновой подложки				
				for(var i=0; i<tiles_bg_save.length; i++){					
					if(context.$props().sprites[tiles_bg_save[i].parent])tiles_bg.push(new Tile(tiles_bg_save[i].id, context.$props().sprites[tiles_bg_save[i].parent], tiles_bg_save[i].point));					
				}
				tiles_common = [];
				//создание основных обьектов сцены и персонажа
				for(var i=0; i<tiles_common_save.length; i++){	
						if(context.$props().sprites[tiles_common_save[i].parent])tiles_common.push(new Tile(tiles_common_save[i].id, context.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point));					
				 
				}
                ///обновляем количество объектов сцены				
				numTiles = tiles_common.length;
				///включение анимации
				apply_code();
				 createSocket();
				//console.log(tiles_bg, tiles_common);
	  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));
		
function createSocket(){			
///соединение с другими игроками
  if (socketjs.isSupported()) {
  // connect to the server
  var socket = socketjs.connect();
  
  ///первое сообщение   на сервер с координатами при загрузке 
  socket.send('newuser', {id: userId, point: modules.personage.point, frame_index: modules.personage.frame_index});

  // log a message if we get disconnected
  socket.disconnect(function(data) {
    console.log('Temporarily disconnected.');
  });

  // log a message when we reconnect
  socket.reconnect(function() {
    console.log('Reconnected.');

    // whatever we return here is sent back to the server
    return 'reconnected';
  });
  
 /////////////////////////////////////////////////////////////////////////////////////////// 
    // корординаты игроков с сервера 
  socket.receive('coord', function(data) {
	 //обновляем объекты сцены в случае добавления или выхода игрока 
	 if(Object.keys(data).length != numUsers){
		//удаляем все объекты сцены
		tiles_common.splice(0, tiles_common.length);
		//создаем исходные обекты
				for(var i=0; i<tiles_common_save.length; i++){	
						if(HM.$props().sprites[tiles_common_save[i].parent])tiles_common.push(new Tile(tiles_common_save[i].id, HM.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point));					
				}
		///создаем новых игроков		
		 for(var key in data){		 
			 if(data[key].id != userId){
				 //console.log( modules.personage.parent );
				/// console.log(HM.$props().sprites[modules.personage.parent] );
				var tile = new Tile(data[key].id, HM.$props().sprites[modules.personage.parent], data[key].point);
				 tiles_common.push(tile);	 
			 }			 
		 }
		 //обновляем ссылку на персонажа
		 for(var i=0; i<tiles_common.length; i++){	
	               if(tiles_common[i].id == personageId){
		           tiles_common[i] = modules.personage;
	            }
         }
    // console.log(tiles_common);
	 numUsers  = Object.keys(data).length;//обновляем количество игроков
	 };
	///включаем анимацию игроков 
	updateUsers(data);  
   // console.log('Received:', data);
  });

  //отправляем координаты и текущий кадр на сервер каждые  100ms
  var interval = setInterval(function() {
    socket.send('coord', {id: userId, point: modules.personage.point, frame_index: modules.personage.frame_index});
  }, 100);
  
  // if the server disconnects, stop sending messages to it
  socket.close(function() {
    console.log('Connection closed.');
    clearInterval(interval);
  });
} else {
  // let the user know that socket.js is not supported
  console.log('Your browser does not support WebSockets.');
}
///
}
///функция обновления координат и текущего кадра персонажа
 function updateUsers(users){
	/// console.log(users);
	 for(var i=0; i< tiles_common.length; i++ ){
		 if(users[tiles_common[i].id] && tiles_common[i].id != userId ){
			tiles_common[i].point[0] = users[tiles_common[i].id].point[0];
			tiles_common[i].point[1] = users[tiles_common[i].id].point[1];
			tiles_common[i].nextFrame(users[tiles_common[i].id].frame_index);
		 }		 
	 }	
}	



		