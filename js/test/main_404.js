	 var canvas = document.getElementById("canvas");
	 var ctx = canvas.getContext('2d');
	 var srcWidth, srcHeight; //высота и ширина области рисования
	
	
	 var colorSpriteArea = "#0fec42"; //цвет обводки контура спрайтов
	 var colorCommonArea = "red"; //..фоновой картинки
	 var colorAdditionalArea = "violet"; //..фоновой картинки
	 var img = new Image();
	 img.src="../img/img.png";
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
	 var littleCanvas = true; //true - если холст больше размера картинки уменьшает размер холста, false - рисует картинку в левом верхнем углу
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
	 var mode  = "edit"; //редактирование "animation" -анимация
	 var tiles_common = []; ///массив спрайтов для анимации
	 var tiles_bg = [];   //массив спрайтов фона
	 var tiles_collision = [];///непроходимые участки карты
	 
	 var tiles_common_save = []; ///объекты сцены
	 var tiles_bg_save = []; //объекты бекгроунда
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
    HM.state.sprites.props.code.setProp(code);
    HM.eventProps["emiter-operation-with"].emit();
	
	document.addEventListener('keydown', function(event) {
		 // event.preventDefault();
		 //console.log(event.key);
		 if(event.key == "Control" || event.key == "Shift" )return;
		  HM.eventProps["emiter-keydown"].setEventProp(event.code);
    });
	
	
	 
	console.log(HM);
	
	//загрузка настроек модулей и стилей
	var collagenSettings = get_from_storage("collagenSettings_test");
	//console.log(collagenSettings);
	var collagenSettings_ ;
	
	if(collagenSettings == null || collagenSettings.common == undefined && collagenSettings.modules_test == undefined && collagenSettings.styles == undefined){		
		collagenSettings_ = {
		  common: {	
			backStepCounts: 6,
			halfPointSize: 5,
			colorCommonArea: "red",
			colorSpriteArea: "#0fec42",
			colorAdditionalArea: "violet",
			lineWidth: 3,
		    mainImgScale_x: 1,
            mainImgScale_y: 1,
			littleCanvas: true,
			showLogs: true,
			
			grid_color: "green",
            grid_weight: 0.5,
            areaDistanceStep: 1,			
		  },			
		  modules_test: {
							
		  },
		  styles: {}						
		}
	    if(collagenSettings != null){					
			for(var key in collagenSettings){
				collagenSettings_.modules_test[key] = collagenSettings[key];
				loadModul(collagenSettings[key], key);
			}
		}
        save_in_storage(collagenSettings_, "collagenSettings_test");		
		collagenSettings = collagenSettings_;
	}else{  
	        if(!collagenSettings.common)collagenSettings.common = {};
			if(!collagenSettings.modules_test)collagenSettings.modules_test = {};
			if(!collagenSettings.styles)collagenSettings.styles = {};
	       
			if(collagenSettings.common.showLogs != undefined)showLogs = collagenSettings.common.showLogs;
			for(var key in collagenSettings.modules_test){				
				loadModul(collagenSettings.modules_test[key], key, showLogs);
			}
			for(var key in collagenSettings.styles){				
				loadStyles(collagenSettings.styles[key]);
				preloadFonts(collagenSettings.styles[key]);
			}			
            if(collagenSettings.common.backStepCounts)backStepCounts = collagenSettings.common.backStepCounts;
			if(collagenSettings.common.halfPointSize)halfPointSize = collagenSettings.common.halfPointSize;
            if(collagenSettings.common.colorCommonArea)lineColor = colorCommonArea = collagenSettings.common.colorCommonArea;
			if(collagenSettings.common.colorAdditionalArea)colorAdditionalArea = collagenSettings.common.colorAdditionalArea;
			if(collagenSettings.common.colorSpriteArea)colorSpriteArea = collagenSettings.common.colorSpriteArea;
			if(collagenSettings.common.lineWidth)lineWidth = collagenSettings.common.lineWidth;
            if(collagenSettings.common.mainImgScale_x) mainImgScale_x = collagenSettings.common.mainImgScale_x;
			if(collagenSettings.common.mainImgScale_y)mainImgScale_y = collagenSettings.common.mainImgScale_y;
			if(collagenSettings.common.littleCanvas != undefined)littleCanvas = collagenSettings.common.littleCanvas;
            if(collagenSettings.common.grid_color) grid_color = collagenSettings.common.grid_color;
			if(collagenSettings.common.grid_weight)grid_weight = collagenSettings.common.grid_weight;
            if(collagenSettings.common.areaDistanceStep)areaDistanceStep = collagenSettings.common.areaDistanceStep;			
			
	}

	   img.onload = function(){ 
		  startImg();			
	   }
	    startImg();	
	HM.state.form_load_module.props.colagen_settings.setProp( JSON.stringify(collagenSettings, null, ' ') );
}










