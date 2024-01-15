//////////////переопределяем размер карты
 var maxTranslate = [-1000, -0];
//адрес json файла спрайтов
var gameUrl = "http://localhost:3000/collagen_2/games/game_1/game_1.json";
var personageId = "personage";


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

///флаг лика по кнопкам клавиатуры
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
	    var context  = HM;
	                    tiles_common_save = JSON.parse(json.tiles_common_save);				
				        tiles_bg_save = JSON.parse(json.tiles_bg_save); 						
						mainImgScale_x = 1;
						mainImgScale_y = 1; 
						img.src = dataURL;
						img.onload = function(){ 		
							startImg();	
						}	
						for(var key in  json.sprites){
							   var sprite = createFromPC(key, context, false, json.sprites[key]);
							   if(sprite)context.$$("emiter-create-sprite").set(key);									
						}
				tiles_bg = [];		
				for(var i=0; i<tiles_bg_save.length; i++){					
					if(context.$props().sprites[tiles_bg_save[i].parent])tiles_bg.push(new Tile(tiles_bg_save[i].id, context.$props().sprites[tiles_bg_save[i].parent], tiles_bg_save[i].point));					
				}
				tiles_common = [];
				for(var i=0; i<tiles_common_save.length; i++){	
						if(context.$props().sprites[tiles_common_save[i].parent])tiles_common.push(new Tile(tiles_common_save[i].id, context.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point));					
				}
				///включение анимации
				apply_code();
				//console.log(tiles_bg, tiles_common);
	  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));
		
			
///тестирование сокет соединения

/*	
  if (socketjs.isSupported()) {
  // connect to the server
  var socket = socketjs.connect();

  // log messages as they arrive
  socket.receive('greeting', function(data) {
    console.log('Received:', data);
  });

  // log a message if we get disconnected
  socket.disconnect(function() {
    console.log('Temporarily disconnected.');
  });

  // log a message when we reconnect
  socket.reconnect(function() {
    console.log('Reconnected.');

    // whatever we return here is sent back to the server
    return 'reconnected';
  });

  // periodically send messages the server
  var interval = setInterval(function() {
    socket.send('greeting', 'Hello from the client!');
  }, 1000);

  // if the server disconnects, stop sending messages to it
  socket.close(function() {
    console.log('Connection closed.');

    clearInterval(interval);
  });
} else {
  // let the user know that socket.js is not supported
  console.log('Your browser does not support WebSockets.');
}			
*/

		