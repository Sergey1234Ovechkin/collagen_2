
//адрес json файла спрайтов
var gameUrl = window.location.origin + "/public/sprites.json";
console.log(gameUrl);
var personageId = "personage";
//уникальное id для передачи данных на сервер (т.к. персонажи одинаковые для всех)
var userId = "user_" + Math.floor(Math.random() * 1000);

///изначальное количество объектов сцены
var numTiles = 0;

///количество игроков
var numUsers = 1;

///тип спрайта персонажа (название)
var pesonageType = null;
var typeP1 = "men_wolf";
var typeP2 = "women_1";


///интервал анимации движения персонажа
var interval  = 100;
var timerId  = 0;



//движение персонажа кнопками клавиатуры (изначально)
///флаг клика по кнопкам клавиатуры
var click  = false;	
///обработка событий нажатия стрелок
modules.keydown = movePersonage;
//обработка события отжатия кнопок-стрелок
modules.keyup = stopPersonage;
//console.log(tiles_common);				


//движение персонажа кнопками клавиатуры
function movePersonage (key){
if(key == "ArrowUp"){				 
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, 15, 12, 0, -10);			
}else if(key == "ArrowDown"){
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval,  3, 0, 0, 10);
}else if(key == "ArrowRight"){			 
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval,11, 8, 10, 0);
		
}else if(key == "ArrowLeft"){
	if (click == true)return;
	click = true;
	clearInterval(timerId);
    timerId = setInterval(move, interval, 7, 4, -10, 0);
}
}
function stopPersonage(key){
      //  console.log(key);
		clearInterval(timerId);
		click = false;
}
  
  
  
  
 //движение персонажа кликом мышы - переменные
 ///будующее нахождение камеры вида после окончания движения персонажа
 //var ctxTranslate_2 = ctxTranslate.slice(0);
 var smothStepX = 1; var smothStepY = 1;
 ///isMoveCamera = false;///отключение движения камеры кнопками 
 var moveStep = 5;//шаг движения камеры и персонажа
 var dx; var dy; ///шаг с учетом пропорций разницы длинны по x и y направлениям
 var direction_ = false;
 var distance = [0,0]; //дистанция движения
var mapPoint; ///точка на карте 

 
 
 ///движение персонажа кликом мышы
// modules.mousedown =  moveMouse;
 function  moveMouse(point){
	 ///console.log(point);
	   mapPoint = point.slice(0);
	 //направление движения персонажа
	 direction_ = directionMove(modules.personage.point, point);
	    
	 //дистанция движения
	  distance= [ point[0] - modules.personage.point[0]-40 , point[1] - modules.personage.point[1]-60 ];
	 //console.log(direction);
	// ctxTranslate_2[0]-=distance[0]; ctxTranslate_2[1]-=distance[1];
	 //определение относительной скорости движения в долях по X и Y напрвлениям
	 smothStep =  Math.abs(distance[0]/distance[1]);
	 		if(smothStep < 1){smothStepX = smothStep; smothStepY = 1; }else{
			smothStepX = 1; smothStepY = Math.abs(distance[1]/distance[0]);
		}
	  //пропорциональное изменение шага координат персонажа и камеры вида	
       dy = moveStep*smothStepY*( distance[1]/Math.abs(distance[1]) );
	   dx =  moveStep*smothStepX*( distance[0]/Math.abs(distance[0]) );	

	  clearInterval(timerId);
      timerId = setInterval(movePersonage_2, interval);	 	
 }
/// движение персонажа кликами мыши
 function movePersonage_2(){

	 
	  var stop = false;
	  
	  ///определение позиции камеры вида - камера следует за движением персонажа
	   ctxTranslate[0] = modules.personage.point[0]*-1+(srcWidth/2); ctxTranslate[1] = modules.personage.point[1]*-1+(srcHeight/2);
	   
	   ///определение окончания движения персонажа
	   var dstopx = modules.personage.point[0] - mapPoint[0];
	   var dstopy = modules.personage.point[1] - mapPoint[1]; 
	   if( Math.abs(dstopx) <=  moveStep*15 &&Math.abs(dstopy) <= moveStep*15 
	    ){
		  // console.log("stop");
		  stop = true;
	   }
	  /* ///определение выхода персонажа за пределы карты
	   if(modules.personage.point[0] <= 0)modules.personage.point[0] = 2;
	   if(modules.personage.point[1] <= 0)modules.personage.point[1] = 2;
	   if(modules.personage.point[0] >= srcWidth + (maxTranslate[0]*-1))modules.personage.point[0] = srcWidth + (maxTranslate[0]*-1);
	   if(modules.personage.point[1] >= srcHeight + (maxTranslate[1]*-1))modules.personage.point[1] = srcHeight + (maxTranslate[1]*-1);
	   */
	  ///
     if(direction_ == "right")nextStep(11, 8);
     if(direction_ == "left")nextStep(7, 4);
     if(direction_ == 'bottom')nextStep(3, 0); 
     if(direction_ == 'top')nextStep(15, 12); 
     if(direction_ == "left-top")nextStep(27, 24);
     if(direction_ == "left-bottom")nextStep(19, 16);
     if(direction_ == 'right-top') nextStep(31, 28);
     if(direction_ == 'right-bottom')nextStep(23, 20);
     ///следующий шаг анимации персонажа
	 function nextStep(arg2,arg3){
		     move(arg2, arg3, dx, dy);
	         if(stop){
				clearInterval(timerId);
				modules.personage.nextFrame(arg2);
			 }		 
	 }
 }

    ///определение направления движения
 function directionMove(point1, point2){ ////////////определение угла поворота точки

	           var distance = [ point1[0] - point2[0] , point1[1] - point2[1] ];
			   var dxy = Math.abs(distance[0])/Math.abs(distance[1]);
			   
			   if(distance[0]>0 && distance[1] >0){				   
				   if( dxy > 0.5 &&  dxy < 1.5 )return "left-top";
				   if( dxy > 1 )return "left";
				   if( dxy < 1 )return "top";				   
			   }
			   else if(distance[0]>0 && distance[1] < 0){
				   if( dxy > 0.5 && dxy < 1.5 )return "left-bottom";
				   if( dxy > 1 )return "left";
				   if( dxy < 1 )return "bottom";
			   }
			  else  if(distance[0]<0 && distance[1] < 0){
				   if( dxy > 0.5 && dxy < 1.5 )return "right-bottom";
				   if( dxy > 1 )return "right";
				   if( dxy < 1 )return "bottom";
			   }
			   else if(distance[0]<0 && distance[1] > 0){
				   if( dxy > 0.5 && dxy < 1.5 )return "right-top";
				   if( dxy > 1 )return "right";
				   if( dxy < 1 )return "top";
			   }
 }


///общая функция анимации движения персонажа и смены кадров;
///arg2,arg3  последний и первый кадры направления анимации, arg4, arg5 шаг движения по x и y осям
function move(/*arg1,*/arg2,arg3, arg4, arg5) {
	     if(modules.personage.frame_index > arg3-1 &&  modules.personage.frame_index < arg2){ 
            modules.personage.nextFrame();//следующий кадр
		}else{
            modules.personage.nextFrame(arg3);///устанавливаем первый кадр
		}
		modules.personage.move(arg4, arg5);//перемещаем объект
		
		///определение столкновений
		var collision = collisionDetection(tiles_collision, modules.personage,  0.4, 0.2);
		///console.log(collision);
        if(collision){
			modules.personage.move(-arg4, -arg5);		
		}		
}


///устанавливаем параметры анимации, включаем анимацию сцены 
function animation(){
	             ///обновляем количество объектов сцены				
				numTiles = tiles_common.length;
				///включение анимации
			    //обновляем переменные для вколючения анимации
	  			mode = "animation";
				if (modules.animation)modules.animation.isOff = true;
				
				//режим code чтобы обновлять только Tiles
				HM.$$("emiter-operation-with").set("code");
				
				 //запуск цикла анимации обновления фоновых и основных спрайтов, в том числе персонажа
                 modules.animation=animationLopLayer(tiles_bg,tiles_common, 40);
				 
				 //отображаем панель выбора персонажа
				 HM.state.chose_personage.htmlLink.style.display = "block";
				 //////удаляем надпись load game
                 HM.state.user_message.props.user_msg.setProp("");
				 //////////////переопределяем размер карты
                 maxTranslate = [-1000, -1000];
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
						
				//console.log(tiles_common_save);	
				tiles_bg = [];
                ///создание объектов фоновой подложки				
				for(var i=0; i<tiles_bg_save.length; i++){					
					if(context.$props().sprites[tiles_bg_save[i].parent])tiles_bg.push(new Tile(tiles_bg_save[i].id, context.$props().sprites[tiles_bg_save[i].parent], tiles_bg_save[i].point));					
				}
				tiles_common = [];
				//создание основных обьектов сцены и персонажа
				for(var i=0; i<tiles_common_save.length; i++){	
					if(context.$props().sprites[tiles_common_save[i].parent]){					
					    addTileCommon(tiles_common_save[i].id, context.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point);
					}
				}
				if(json.tiles_collision_save)tiles_collision = JSON.parse(json.tiles_collision_save);
			    //console.log(tiles_collision);
				///staticTales = tiles_common.slice(0);
			    ///анимация сцены
				animation();
				//цвет залифки окружающего фона
				ctx.fillStyle = "black";
	  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));
		
function createSocket(){			
///соединение с другими игроками
  if (socketjs.isSupported()) {
  // connect to the server
  var socket = socketjs.connect();
  
  ///первое сообщение   на сервер с координатами при загрузке 
  socket.send('newuser', {id: userId, point: modules.personage.point, frame_index: modules.personage.frame_index, pType: pesonageType});

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
		// console.log(Object.keys(data).length);
		//удаляем все объекты сцены
		tiles_common.splice(0, tiles_common.length);
		//создаем исходные обекты
				for(var i=0; i<tiles_common_save.length; i++){	
					if(HM.$props().sprites[tiles_common_save[i].parent]){					
						addTileCommon(tiles_common_save[i].id, HM.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point);
					}	
				}
		///создаем новых игроков		
		 for(var key in data){		 
			 if(data[key].id != userId){
				 //console.log( modules.personage.parent );
				/// console.log(HM.$props().sprites[modules.personage.parent] );
				addTileCommon(data[key].id, HM.$props().sprites[data[key].pType], data[key].point);                				 
			 }else{
				 addTileCommon(personageId, HM.$props().sprites[data[key].pType], data[key].point);
                 			 
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
                                                                                                                  ///добавляем сообщение игрокам
    socket.send('coord', {id: userId, point: modules.personage.point, 
	                       frame_index: modules.personage.frame_index, msg: 
						   modules.personage.message,
						   pType: pesonageType});
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
}
///функция обновления координат и текущего кадра персонажа
 function updateUsers(users){
	/// console.log(users);
	 for(var i=0; i< tiles_common.length; i++ ){
		   
		 if(users[tiles_common[i].id] && tiles_common[i].id != userId ){
			var user = users[tiles_common[i].id]			
			tiles_common[i].point[0] = user.point[0];
			tiles_common[i].point[1] = user.point[1];
			tiles_common[i].nextFrame(user.frame_index);
			tiles_common[i].message = user.msg;
		 }		 
	 }	
}
///функция создает и добавляет объект сцены, добавляет новое свойство с текстом сообщения
function addTileCommon(id, sprite, point){	
	var tile = new Tile(id, sprite, point);
	tile.message = false;	
	tiles_common.push(tile);
	//if(id == "fire_1")modules.fire_1 = tile;
    return tile;	
}	
/////////////////////////////////////Сообщения игороков
///Переопределяем метод pender из файла /test/tiles.js
Tile.prototype.render_ = function(){
	if(!this.show)return;				
    ctx.drawImage(this.frame, this.point[0], this.point[1], this.width, this.height);
	
	//отображаем спрайт с сообщением
    if(this.message){
		var spiteMsg = HM.$props().sprites["message"];
		spiteMsg.show = true;
		///отображаем сообщение справа вверху от персонажа
		spiteMsg.point[0] = this.point[0]+40; 
		spiteMsg.point[1] = this.point[1]-90;
		///нижняя правая точка спрайта
		spiteMsg.point2[0] = spiteMsg.point[0]+spiteMsg.width;
		spiteMsg.point2[1] = spiteMsg.point[1]+spiteMsg.height;
	    //настраиваем параметры текстового сообщения - отступы, шрифт, размер	
		spiteMsg.textParam = {
			text: this.message, 
			lineHeight: 15, 
			font: "15px Balsamiq Sans",
			fillStyle: "black",
			padding_x_l: 5, 
			padding_x_r: 5,		
			padding_x: false, 
			padding_y: 5, 
			max_width: false, 
			textArr: false,		
		}
	    spiteMsg.render_();
	}	
}
///переопределяем метод render_ спрайта для отрисовки сообщений /js/sprites
///убираем все лишнее для более быстрой работы, добаляем функцию для отображения текста.
CollageSprite.prototype.render_ = function(){
	if(!this.show)return;			
	ctx.drawImage(this.frame, this.point[0], this.point[1], this.width, this.height);
	if(this.textParam)this.fillText(this.point[0], this.point[1]);	
}

///добавляем контейнер с формой в для отправки сообщений в объект StateMap  /js/games/inteface_games.js
 StateMap.user_message = { 
		container: "user_message",
		props: [["user_msg_btn", "mousedown", "[name='user_msg_btn']"], ["user_msg", "inputvalue", "[name='user_msg']"],
                ["move_type_btn", "mousedown", "[name='move_type']"], ["move_type", "checkbox", "[name='move_type']"],		
		         ],
		methods: {
			user_msg_btn: function(){
				//проверка шрифта
			    var text  = this.props("user_msg").getProp(); 
                var isKyr = function (str) {
                   return /[а-я]/i.test(str);
                 }
                if(isKyr(text)){alert("чат не поддерживает кирилицу"); return};
				////тестовое сообщение
                modules.personage.message = text;
            },
			///выбор способа управления персонажем
			move_type_btn: function(){ 
				var mType = this.parent.props.move_type.getProp();
				if(mType){
					///кнопками
					isMoveCamera = true;
					modules.keydown = movePersonage;
                    modules.keyup = stopPersonage;
					modules.mousedown = function(){};
				}else{
					//мышью
					 isMoveCamera = false;
					modules.mousedown =  moveMouse;
					modules.keydown = function(){};
                    modules.keyup = function(){};
				}				
			}
		}				
 }
 ///форма выбора типа персонажа
 StateMap.chose_personage = { 	
		container: "chose_personage",
		props: [["personage_1", "mousedown", "[name='personage_1']"], ["personage_2", "mousedown", "[name='personage_2']"],				 
		         ],
		methods: {
			personage_1: function(){
				this.parent.htmlLink.style.display = "none";///скрываем панель выбора персонажа
				modules.personage =  addTileCommon(personageId, this.$props().sprites[typeP1], [250, 300]);
				pesonageType = typeP1;
				createSocket();
            },
			personage_2: function(){
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites[typeP2], [250, 300]);
				pesonageType = typeP2;
                createSocket();				
            }			
		}			
		
 }
