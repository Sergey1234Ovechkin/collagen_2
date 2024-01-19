
//адрес json файла спрайтов
var gameUrl = window.location.origin + "/collagen_2/games/forest_2/sprites.json";
console.log(gameUrl);
var personageId = "personage";
//уникальное id для передачи данных на сервер (т.к. персонажи одинаковые для всех)
var userId = "user_" + Math.floor(Math.random() * 1000);

///изначальное количество объектов сцены
var numTiles = 0;

///количество игроков
var numUsers = 1;

///спрайт персонажа
var pesonageType = null;

//анимация сцены
function apply_code(){
	        //обновляем переменные для вколючения анимации
	  			mode = "animation";
				if (modules.animation)modules.animation.isOff = true;
				//updateCommonTiles(HM.$props().sprites);
				//updateBgTiles(HM.$props().sprites);
				
				//режим code чтобы обновлять только Tiles
				HM.$$("emiter-operation-with").set("code");
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
//console.log(tiles_common);
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
					if(context.$props().sprites[tiles_common_save[i].parent]){					
					    addTileCommon(tiles_common_save[i].id, context.$props().sprites[tiles_common_save[i].parent], tiles_common_save[i].point);
					}
				}
			    //console.log(tiles_common);
                ///обновляем количество объектов сцены				
				numTiles = tiles_common.length;
				///включение анимации
				
				 apply_code();
				 ///анимация костра
				 setInterval(function(){modules.fire_1.nextFrame();}, 350);
				 //console.log(tiles_common);
				// createSocket();
				 HM.state.chose_personage.htmlLink.style.display = "block";
				 //alert("игра загружена");
				 //////////////переопределяем размер карты
                  maxTranslate = [-1000, -1000];
				
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
///
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
	//if(id == "msg"){return;}///отменяем создание tile сообщений
	var tile = new Tile(id, sprite, point);
	tile.message = false;	
	tiles_common.push(tile);
	if(id == "fire_1")modules.fire_1 = tile;
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
		spiteMsg.point[0] = this.point[0]+50; 
		spiteMsg.point[1] = this.point[1]-70;
		///нижняя правая точка спрайта
		spiteMsg.point2[0] = spiteMsg.point[0]+spiteMsg.width;
		spiteMsg.point2[1] = spiteMsg.point[1]+spiteMsg.height;
		//console.log()
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
		         ],
		methods: {
			user_msg_btn: function(){
			    var text  = this.props("user_msg").getProp(); 
                var isKyr = function (str) {
                   return /[а-я]/i.test(str);
                 }
                if(isKyr(text)){alert("чат не поддерживает кирилицу"); return};

				////тестовое сообщение
                modules.personage.message = text;
				//console.log(text);
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
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites["personage_1"], [200, 200]);
				pesonageType = "personage_1";
				createSocket();
            },
			personage_2: function(){
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites["personage_2"], [200, 200]);
				pesonageType = "personage_2";
                createSocket();				
            }			
		}			
		
 }