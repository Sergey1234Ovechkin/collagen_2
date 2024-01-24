	 var canvas = document.getElementById("canvas");
	 var ctx = canvas.getContext('2d');
	 var srcWidth, srcHeight; //высота и ширина области рисования
	
	
	 var colorSpriteArea = "#0fec42"; //цвет обводки контура спрайтов
	 var colorCommonArea = "red"; //..фоновой картинки
	 var colorAdditionalArea = "violet"; //..фоновой картинки
	 var img = new Image();
	 img.src="./public/town.png";
	 var saveImg = false; //предыдущее преобразование картинки фона
	 var restoreImg = false; //сохраненная картинка
	 var stepBack = []; //шаг назад для приобразований фоновой картинки
	 var backStepCounts = 6; //максимальное количество шагов
	 var halfPointSize = 5; //размер половины квадрата точки на площади выделения
	 var lineColor = colorCommonArea; //цвет линии выделения
	 var lineWidth = 3; //толщина линии выделения
	 var mainImgScale_x = 1; //множитель размера картинки(масштаб)
     var mainImgScale_y = 1; //множитель размера картинки(масштаб)
	 var mirror_x = 1; //отражение фона
	 var mirror_y = 1;
	 var littleCanvas = false; //true - если холст больше размера картинки уменьшает размер холста, false - рисует картинку в левом верхнем углу
	 var showLogs = true;
	 var modules = {}; //подключаемые cdn функции
	 var onloadModules = {}; ///список загруженых модулей и скриптов
	 var HM; //htmlix state
	 var grid_color = "green"; //цвет сетки
	 var grid_weight = 0.5;    //толщина сетки спрайтов
	 var areaDistanceStep = 1; //дистанция перемещения области выделения стрелками клавиатуры
	 
	 //////////////смещение координат
     var maxTranslate = [-2000, -2000];	 
	 var ctxTranslate = [0, 0];
	 var isMoveCamera = true;
	 
	 var mode  = "edit"; //редактирование "animation" -анимация
	 var tiles_common = []; ///массив спрайтов для анимации
	 var tiles_bg = [];   //массив спрайтов фона
	 var tiles_collision = [];///непроходимые участки карты
	 
	 var tiles_common_save = []; 
	 var tiles_bg_save = [];
     var tiles_collision_save = [];///непроходимая область на карте	 

	///события клавиатуры и клика мыши
	modules.mousedown =  function (point){}
	modules.mouseup =  function (point){}
	modules.keydown  = function (key){}	 
	modules.keyup  = function (key){}	
	 
	 

window.onload = function(){ 
	///добавление кода с url параметров
	var query = window.location.search;
	var urlParams = new URLSearchParams(query);
	var code = urlParams.get("code");
	
	
	HM = new HTMLixState(StateMap);
   // HM.state.sprites.props.code.setProp(code);
    HM.eventProps["emiter-operation-with"].emit();
	
	document.addEventListener('keydown', function(event) {
		 // event.preventDefault();
		 //console.log(event.key);
		 if(event.key == "Control" || event.key == "Shift" )return;
		  HM.eventProps["emiter-keydown"].setEventProp(event.code);
    });
	
	document.addEventListener('keyup', function(event) {
		 // event.preventDefault();
		 //console.log(event.key);
		 if(event.key == "Control" || event.key == "Shift" )return;
		  HM.eventProps["emiter-keyup"].setEventProp(event.code);
    });	 
	console.log(HM);
	   img.onload = function(){ 
		  startImg();			
	   }
	    startImg();	
	//HM.state.form_load_module.props.colagen_settings.setProp( JSON.stringify(collagenSettings, null, ' ') );
}











