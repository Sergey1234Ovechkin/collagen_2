

var StateMap = {
	form_load_module: { //загрузить модуль, сохранить настройки
		container: "form_load_module",
		props: [ 
		            ["module_url", "inputvalue", "[name='module_url']"],  ["load_module", "click", "[name='load_module']"], 
				["form_show", "click", "[name='form_show']"], ["form_style", "class", "div.d-none"],					
					["save_colagen_settings", "click", "[name='save_colagen_settings']"],  ["colagen_settings", "inputvalue", "[name='colagen_settings']"], 					
		],		 				
		methods: {
			form_show: function(){ //отобразить скрыть форму текста
				if(this.prop == null){                					
					this.prop = true;
					this.props("form_style").removeProp("d-none");
					this.htmlLink.querySelector("span").innerText="-";
				}else{
					this.prop = null;
					this.props("form_style").setProp("d-none");
					this.htmlLink.querySelector("span").innerText="+";
				}				
			},
			save_colagen_settings: function(){ //сохранить настройки в json файл в локальном хранилище
				
				var settings = this.props("colagen_settings").getProp();
                try{
                   // settings.replace(/(\s)/g, "$1");					
					settings = JSON.parse(settings);
				}catch(error){
					alert("ошибка json файла, убедитесь в корректности настроек: "+error);
					return
				}	
				save_in_storage(settings, "collagenSettings_test");	
			   	alert("настройки сохранены");			
			},
			load_module: function(){ //подключает загруженный скрипт, модуль
				var module_url  = this.props("module_url").getProp();           
				loadModul(module_url);
			},
		}	
	},
	main_form: { //основная форма
		container: "main_form",
		props: [ 
				 ["load_img_click", 'change', "[name='load_img']"], ["load_img", 'inputvalue', "[name='load_img']"], 				
				 ["step_back", "click", "[name='step_back']"], 
				 ["to_phone_img", 'click', "[name='operation_with']"], ["clear_phone", 'click', "[name='clear_phone']"],
				 ["save_img", 'click', "[name='save_img']"], ["restore_img", 'click', "[name='restore_img']"], 
				 ["restart_img", 'click', "[name='restart_img']"],				 			
				["add_rm_classes_on_change_operationWith", 'emiter-operation-with', ""], 
				 ["common_btns_class", 'class', "[name='common_btns_class']"],
                 ["to_phone_img_class", 'class', "[name='operation_with']"],
				["reset_area", 'click', "[name='reset_area']"],				 
				 ["start_video", 'click', "[name='start_video']"],
                  				  
		],			
		methods: {
				start_video: function(){
				if(this.prop === undefined || this.prop == null){
					this.htmlLink.style = "background-color: red;"
					        var stream = canvas.captureStream(25 /*fps*/);
					         this.prop = new MediaRecorder(stream, {
                                     mimeType: "video/webm; codecs=vp9"
                            }); 
							const recording = record(canvas, this.prop);
							var video$ = document.createElement('video')
							document.body.appendChild(video$)
							recording.then(url => video$.setAttribute('src', url) )
				}else{
					this.prop.stop();
					this.prop = null;
					this.htmlLink.style = "background-color: blue;"					
				}
			},
			add_rm_classes_on_change_operationWith: function(){ //скрывает кнопки при операции со спрайтами и фоновой картинкой
				var props = this.parent.props; 			
				if(this.emiter.prop == "common"){ //видимые кнопки при операциях с фоном
					props.common_btns_class.removeProp("d-none");
					props.to_phone_img_class.setProp("d-none");
				}else if(this.$props().sprites[this.$props("operationWith")]){ //со спрайтами
					props.common_btns_class.setProp("d-none");				
					props.to_phone_img_class.removeProp("d-none");
				}else{ //другими операциями
					props.common_btns_class.setProp("d-none");
					props.to_phone_img_class.removeProp("d-none");
				}				
			},
			step_back: function(){ //возвращает предыдущий шаг преобразования фоновой картинки
				if(stepBack.length > 0){
					var step = stepBack.pop();					
					saveImg = step[0];					
					this.$methods().setAreas(step[1]);
					this.$methods().renderAll();
				}	
			},
			load_img_click: function(event){ //загружает картинку с компьютера		
				var img_ = this.parent.props.load_img.htmlLink.files[0];
				var context = this;
				handleFiles___(img_); 			
				function handleFiles___(file) {
						img.file = file;
						var reader = new FileReader();					
						reader.onload = (function(aImg) { return function(e) { 
							aImg.src = e.target.result; 
							startImg();													
						}; })(img);						
						reader.readAsDataURL(file);					
				}			
			},
			save_img: function(){ //сохраняет текущий снимок фоновой картинки
				ctx.clearRect(0, 0, srcWidth, srcHeight);
				ctx.putImageData(saveImg, 0, 0);
				restoreImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},
			restore_img: function(){ //отображает предыдущий сохраненный снимок
				if(restoreImg){
					saveImg = restoreImg;
				}	
				this.$methods().renderAll();
			},
			restart_img: function(){ //перезагружает фоновую картинку
					startImg();	
					this.$methods().renderAll();
			},
			clear_phone: function(){ ///делает фон прозрачным
				saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.clearRect(0, 0, srcWidth , srcHeight);
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},
			to_phone_img: function(){ //работать с фоновой картинкой				
				var sprite = this.$props().sprites[this.$props("operationWith")];
				if(sprite != undefined){
					sprite.currentOperation = false; sprite.isMove = false; sprite.moveStart = false; sprite.isMovePoint = false; 
				}
				    lineColor = colorCommonArea;
					this.$props().operationWith = "common";
					this.$$("emiter-operation-with").set("common");
					this.$methods().renderAll();				
			},	
			reset_area: function(){ //сбросить область выделение
				if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}
				if( this.$props("operationWith") == "common"  ){ 
					this.$props("commonProps").area_1 = [];
					 this.$props("commonProps").isEndArea_1 = false;
					this.$methods().renderAll();				
				}				
			},
		},				
	},
	hide_panel: {//кнопка скрывает боковую панель
		container: "hide_panel",
		props: [ ["hide_panel", 'click', ""] ],
		methods: {
			hide_panel: function(){
				if(this.prop === undefined || this.prop == null){
					this.prop = true;
					document.getElementsByClassName("right_collagen_panel")[0].style.display = "none";
					document.getElementById("canvas_container").classList.remove("col-7", "col-sm-7", "col-md-8", "col-lg-9");
					document.getElementById("canvas_container").classList.add("col-12");
				}else{
					this.prop = null;
					document.getElementsByClassName("right_collagen_panel")[0].style.display = "block";	
                    document.getElementById("canvas_container").classList.add("col-7", "col-sm-7", "col-md-8", "col-lg-9");	
					document.getElementById("canvas_container").classList.remove("col-12");
				}
			},
		}
	},
	canvas: { //канвас	
		container: "canvas",
		props: [["mousedown", "mousedown", ""], ["mousemove", "mousemove", ""], ["mouseup", "mouseup", ""],
		         ["mousewheel", "mousewheel", ""], ["move_contur", "emiter-keydown", ""],				 
		         ],
		methods: {
            mousewheel: function(){
                event.preventDefault();			 
				this.$$("emiter-mousewheel-canvas").set(event.deltaY);
			},
            move_contur: function(){ ///события кнопок клавиатуры
			 var key = this.$$("emiter-keydown").prop;
                modules.keydown(key);			 
				if(key == "KeyW"){ // смещение экрана кнопками w a s d				
					ctxTranslate[1]+=5;
					if(ctxTranslate[1] > 0)ctxTranslate[1] = 0;
					
					if(mode == "edit")this.$methods().renderAll(false, {drawAreaPoints: false});
					
				}else if(key == "KeyS"){
					ctxTranslate[1]-=5;
					if(ctxTranslate[1] < maxTranslate[1])ctxTranslate[1] = maxTranslate[1];
					if(mode == "edit")this.$methods().renderAll(false, {drawAreaPoints: false});
				}
				else if(key == "KeyA"){
					ctxTranslate[0]+=5;
					if(ctxTranslate[0] > 0)ctxTranslate[0] = 0;
					if(mode == "edit")this.$methods().renderAll(false, {drawAreaPoints: false});
				}else if(key == "KeyD"){
					ctxTranslate[0]-=5;
					if(ctxTranslate[0] < maxTranslate[0])ctxTranslate[0] = maxTranslate[0];
					if(mode == "edit")this.$methods().renderAll(false, {drawAreaPoints: false});
				}
              if(this.$props("operationWith") != "common")return; ///движение контура стрелками клавиатуры				
              var isDraw = false;				
			  var distance = areaDistanceStep;
			 
			  var area_1 = this.$props("commonProps").area_1;
			  var isEndArea_1 = this.$props("commonProps").isEndArea_1;
			  
			 if(key == "ArrowUp"){				 
				area_1 = getCutSize(area_1, 0, distance);
				this.$props("commonProps").area_1 = area_1;
				this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
                isDraw = true;				
			 }else if(key == "ArrowDown"){
				area_1 = getCutSize(area_1, 0, distance*-1);
				this.$props("commonProps").area_1 = area_1;
				this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
				isDraw = true;
			 }else if(key == "ArrowRight"){			 
				area_1 = getCutSize(area_1, distance*-1, 0);
				this.$props("commonProps").area_1 = area_1;
				this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);	
                isDraw = true;				
			 }else if(key == "ArrowLeft"){
				area_1 = getCutSize(area_1, distance, 0);
				this.$props("commonProps").area_1 = area_1;
				this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
                isDraw = true;				
			 }
			 if(isDraw){
					    this.$methods().renderAll(false, {drawAreaPoints: false});
						ctx.save();///////////////
						ctx.translate(ctxTranslate[0], ctxTranslate[1]);
						drawAreaPoints(area_1, isEndArea_1);
						ctx.restore();	 
			 }		 
			},			
			mousedown: function(){
					var point = getCanvasPoint(event, this.parent.htmlLink);
					point[0]-=ctxTranslate[0]; point[1]-=ctxTranslate[1];
					modules.mousedown(point);
					this.$$("emiter-mousedown-canvas").set(point);			    
				    if(event.which !== 1)return;
				    var area_1 = this.$props("commonProps").area_1;
					var isEndArea_1 = this.$props("commonProps").isEndArea_1;				
					if(this.$props("operationWith") == "common"){
							
							if(isEndArea_1 === false){                           //добавляет точку к выделению либо замыкает контур								
									isEndArea_1 = endArea(area_1, point);								
									if(!isEndArea_1 ){
										area_1.push(point);
									}else{										
										this.$props("commonProps").isEndArea_1 = true;
									}
							}else{
								//saveStep(saveImg, this.$props().commonProps.area_1);
								 this.$props("commonProps").isMovePoint  = isClickOnPoint(area_1 ,point); ///индекс движемой точки
								 this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
							}
							ctx.save();///////////////
                            ctx.translate(ctxTranslate[0], ctxTranslate[1]);
							   drawAreaPoints(area_1, isEndArea_1);
							ctx.restore();

					}else if(this.$props().sprites[this.$props("operationWith")]){						
						var sprite = this.$props().sprites[this.$props("operationWith")];
						sprite.mousedown(point, event, this);						
					}					
			},
			mousemove: function(){
					var point = getCanvasPoint(event, canvas);
					point[0]-=ctxTranslate[0]; point[1]-=ctxTranslate[1];
					this.$$("emiter-mousemove-canvas").set(point);
					if(this.$props("operationWith") == "common"){
                        var indexPoint = this.$props("commonProps").isMovePoint;					
						if(indexPoint !== false){							
							if(this.$props("commonProps").scale_or_move == "move"){ //перемещение точки							    
								this.$methods().setPoint(point, indexPoint, "area_1");
								this.$methods().renderAll();
							}	
						}											
					}else if(this.$props().sprites[this.$props("operationWith")]){ //операция с конкретным спрайтом, если он не удален						
						 var sprite = this.$props().sprites[this.$props("operationWith")];												 	
						 sprite.cursorOver_(point);
						 sprite.mousemove(point, this, event);
					}				
			},
			mouseup: function(){
					var point = getCanvasPoint(event, canvas);
					point[0]-=ctxTranslate[0]; point[1]-=ctxTranslate[1];
					modules.mouseup(point);
					this.$$("emiter-mouseup-canvas").set(point);			    
					if(event.which !== 1)return;										
					if(this.$props("operationWith") == "common"){						
						if(this.$props("commonProps").isMovePoint !== false){						
							this.$props("commonProps").isMovePoint = false;							
						}						
					}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];	
						sprite.mouseup(this, point);
					}				
			}			
		}		
	},
	control_points: { //контрольные точки, координаты
		container: "control_points",
		props: [["control_point_x", "inputvalue", "[name='control_point_x']"], 
		        ["control_point_y", "inputvalue", "[name='control_point_y']"],
				["point_x", "text", "[name='point_x']"], 
		        ["point_y", "text", "[name='point_y']"],
				["move_coner_to_point", "click", "[name='move_coner_to_point']"], 
		        ["move_center_to_point", "click", "[name='move_center_to_point']"],
				["listen_change_points", "emiter-mousemove-canvas", ""],
				["current_operation", "text", "[name='current_operation']"],
				["listen_current_operation", 'emiter-operation-with', ""], 				
			 ],
		methods: {
			listen_current_operation: function(){ //текущяя опреация
				 			this.parent.props.current_operation.setProp(this.emiter.prop); 			
			},
			listen_change_points: function(){ //отображает координаты x,y при движении курсора мыши
				var props = this.parent.props;
				props.point_x.setProp(this.emiter.prop[0]);
				props.point_y.setProp(this.emiter.prop[1]);				
			},		
			move_coner_to_point: function(){ //перемещает угол контура либо спрайта к указанной точке на канвас
				var x = this.parent.props.control_point_x.getProp(); var y = this.parent.props.control_point_y.getProp();
				if(this.$props("operationWith") == "common"){ 
					if(this.$props("commonProps").isEndArea_1 !== false){ 
					    var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y);
						this.$methods().setAreas(area_1);
						this.$methods().renderAll();						
					}				
				}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];
						var area_1 = sprite.area_1;
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y);
						sprite.setAreas(area_1);
						this.$methods().renderAll();				
				}				
			},
			move_center_to_point: function(){  //перемещает цетр спрайта либо контура к указанной точке
				var x = this.parent.props.control_point_x.getProp(); var y = this.parent.props.control_point_y.getProp();
				if(this.$props("operationWith") == "common"){ 
					if(this.$props("commonProps").isEndArea_1 !== false){ 						
					    var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
						this.$methods().setAreas(area_1);
						this.$methods().renderAll();							
					}				
				}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];
						var area_1 = sprite.area_1;
						var imgBox = getBox(area_1);
						area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
						sprite.setAreas(area_1);
						this.$methods().renderAll();				
				}					
			},
		}
	},

	
	sprites: { //спрайты
		selector: ".sprites",
		arrayProps: [
			["listen_create_sprite", "emiter-create-sprite", ""],
			["show_box_click", "click",  "[name='show_box']"], 
			["show_box", "checkbox",  "[name='show_box']"],
			["show_points_click", "click",  "[name='show_points']"], 
			["show_points", "checkbox",  "[name='show_points']"], 
			["add_control_point", "click",  "[name='add_control_point']"], //контрольные точки-координаты центра спрайта на канвас
			["all_to_control_points", "click",  "[name='all_to_control_points']"],
			
			["add_control_sprite_point", "click",  "[name='add_control_sprite_point']"], //контрольные точки спрайтов на спрайт листах
			["all_to_control_sprite_points", "click",  "[name='all_to_control_sprite_points']"],
			
			["form_show", "click", "[name='form_show']"], ["form_style", "class", "div.sprites"],//отобразить скрыть список спрайтов
			
			["code_edition", "click", "[name='code_edition']"],//редактор кода
			["code_edition_panel_class" , "class",  "[name='code_edition_panel']"], ["apply_code", "click", "[name='apply_code']"],
			["code", "inputvalue", "[name='code']"], ["code_form", "click", "[name='code']"],
			["copy_line", "click", "[name='copy_line']"], ["click_spr", "emiter-mousedown-canvas", ""],
			["enable_sprite_events", "click", "[name='enable_sprite_events']"], ["sprite_events_checkbox", "checkbox", "[name='enable_sprite_events']"],
			["keydown", "emiter-keydown", ""],  
			["stop_code", "click", "[name='stop_code']"],
			//["click_spr_done", "emiter-mouseup-canvas", ""],
		],
		arrayMethods: {
			enable_sprite_events: function(){ //отключить, включить прослушивание событий клика мыши, клавиатуры
				var sprite_events_checkbox = this.props("sprite_events_checkbox").getProp();
				if(sprite_events_checkbox){
					this.props("click_spr").enableEvent();
					this.props("keydown").enableEvent();
				}else{
					this.props("click_spr").disableEvent();
					this.props("keydown").disableEvent();					
				}				
			},
			click_spr: function(){//собития кликов по спрайтам
				var sprites = this.$props().sprites;
				for(i in sprites){				 
					sprites[i].cursorOver_(this.emiter.prop, false);
					if(sprites[i].cursorOver)sprites[i].click(this.emiter.prop);					
				}				
			},
			keydown: function(){//событие клавиатуры для спрайтов
				var sprites = this.$props().sprites;
				var key  = this.emiter.prop;
				for(i in sprites){
					sprites[i].keydown(key);
				}
								
			},
			copy_line: function(){
				var area_1 = this.$props("commonProps").area_1.slice(0);
				for(var i=0; i<area_1.length; i++){
					area_1[i].push(0); 
				}
				
				this.props("code").setProp( JSON.stringify(area_1));
			},
			apply_code: function(){//включает анимацию, скрипт
				mode = "animation";
				if (modules.animation) modules.animation.isOff = true;
				updateCommonTiles(this.$props().sprites);
				updateBgTiles(this.$props().sprites);
				var script = this.props("code").getProp();
				createCode(script, this.rootLink, this.rootLink.stateProperties.sprites, this.rootLink.stateProperties.sprites_group);
				this.$$("emiter-operation-with").set("code");
				
			},
			stop_code: function(){
				mode = "edit";
				if (modules.animation) modules.animation.isOff = true;
				updateCommonTiles(this.$props().sprites);
				updateBgTiles(this.$props().sprites);				
			},						
			code_form: function(){
				this.$$("emiter-operation-with").set("code");
				
			},
			code_edition: function(){ //отобразить скыть редактор кода 
					if(this.prop == null){				
					this.prop = true;
					this.props("code_edition_panel_class").removeProp("d-none");
					this.htmlLink.innerText="—";
				}else{
					this.prop = null;
					this.props("code_edition_panel_class").setProp("d-none");
					this.htmlLink.innerText="code";
				}
			},
			form_show: function(){ //отобразить скрыть список спрайтов
				if(this.prop == null){				
					this.prop = true;
					this.props("form_style").setProp("d-none");
					this.htmlLink.innerText="+";
				}else{
					this.prop = null;
					this.props("form_style").removeProp("d-none");
					this.htmlLink.innerText="—";
				}				
			},
			all_to_control_sprite_points: function(){//переместить все спрайты на контрольные точки №2				
				var it = 0;
				for(var key in this.$props().sprites){
					var sprite = this.$props().sprites[key];
					if(sprite.controlSpritePoint)sprite.moveCenter(sprite.controlSpritePoint[0], sprite.controlSpritePoint[1], false);
                     console.log(sprite.controlSpritePoint);				
					it++;
				}
				if(it>0)this.$methods().renderAll();			
			},
			add_control_sprite_point: function(){			
					var sprite = this.$props().sprites[this.$props("operationWith")];
					if( sprite != undefined ){					
						var x = sprite.point[0]+sprite.getHalfW();
						var y = sprite.point[1]+sprite.getHalfH();
						sprite.controlSpritePoint = [x, y];						
					}												
			},
			all_to_control_points: function(){		//переместить все спрайты на контрольные точки №1	
				var it = 0;
				for(var key in this.$props().sprites){
					var sprite = this.$props().sprites[key];
					if(sprite.controlPoint)sprite.moveCenter(sprite.controlPoint[0], sprite.controlPoint[1], false);					
					it++;
				}
				if(it>0)this.$methods().renderAll();				
			},
			add_control_point: function(){			
					var sprite = this.$props().sprites[this.$props("operationWith")];
					if( sprite != undefined ){					
						var x = sprite.point[0]+sprite.getHalfW();
						var y = sprite.point[1]+sprite.getHalfH();
						sprite.controlPoint = [x, y];						
					}												
			},
			listen_create_sprite: function(){			
				var id = this.emiter.prop;				
				for(var i=0; i < this.parent.data.length; i++){					
					this.parent.data[i].props.class.removeProp("active");					
				}
                 var sprite = this.$props().sprites[id];  				
				var container = this.parent.add({id: id, class: "active", show_sprite: (sprite.show ? "hide" : "show") }, 0);	
                container.props.id.prop = id;				
			},
			show_box_click: function(){
				this.$props().showBox = this.parent.props.show_box.getProp();	
				this.$methods().renderAll();							
			},
			show_points_click: function(){
				this.$props().showPoints = this.parent.props.show_points.getProp();
				this.$methods().renderAll();			
			},
			
		},
		container: "sprite",
		props: [ ["id", "inputvalue", "[name='id']"], ["change_id", "change", "[name='id']"], ["class", "class", ""], ["click", "click", ""], ["rm_sprite", "click", "[name='rm_sprite']"],
		          ["show_sprite_click", "click", "[name='show_sprite']"], ["show_sprite", "text", "[name='show_sprite']"], 
				   ["layer_up", "click", "[name='layer_up']"], //["stamp", "click", "[name='stamp']"], //["stamp_cursor", "click", "[name='stamp_cursor']"],
				   ["save_sprite", "click", "[name='save_sprite']"], // ["copy_contur", "click", "[name='copy_contur']"],
				    ["to_control_point", "click", "[name='to_control_point']"], //["next_frame", "click", "[name='next_frame']"], ["prev_frame", "click", "[name='prev_frame']"],					
				  ],
		methods : {
			/*next_frame: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				//console.log(this);
				sprite.nextFrame();
			},
			prev_frame: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				sprite.prevFrame();
			},*/
			to_control_point: function(){ //переместить спрайт на контрольную точку n 1
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				//console.log(sprite);
				if(sprite && sprite.controlPoint){					
					sprite.moveCenter(sprite.controlPoint[0], sprite.controlPoint[1], false);
					this.$methods().renderAll();
				}				
			},
			change_id: function(){
				var id = this.props("id").getProp();
				if(this.$props().sprites[id] != undefined){					
					id = id + "_duble";
					this.props("id").setProp(id);
				}				
				var old_id = this.parent.props.id.prop;
				var sprite = this.$props().sprites[old_id];
				sprite.id = id;
				delete this.$props().sprites[old_id];
				this.$props().sprites[id] = sprite;	
				this.$props().operationWith = id;
				this.parent.remove();					
				var container = this.component().add({id: id, class: "active"}, 0);
				container.props.id.prop = id;	
			},
			save_sprite: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				sprite.saveOnPC();
			},
			layer_up: function(){
				var id = this.props("id").getProp();
				var index = this.parent.index;
				var sprite = this.$props().sprites[id];
				delete this.$props().sprites[id];
				this.$props().sprites[id] = sprite;
				
				var newOrderArr = [];
				var length = this.component().data.length;
				for(var i=0; i<length; i++){
					newOrderArr.push(i);
				}
				var newIndex = newOrderArr.splice(index, 1);
				newOrderArr.unshift(newIndex);				
				this.component().order(newOrderArr);			
			},
			show_sprite_click: function(){	//отображает либо скрывает спрайт			
				var text = this.props("show_sprite");
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];			
				if(sprite.show){
					sprite.show = false;
					text.setProp("Отобразить");
				}else{
					sprite.show = true;
					text.setProp("Скрыть");
				}				
			},
			click: function(){	//делает спрайт текущим			
				var id = this.props("id").getProp();
				for(var i=0; i < this.component().data.length; i++){					
					this.component().data[i].props.class.removeProp("active");					
				}
				 lineColor = colorSpriteArea;
                this.props("class").setProp("active");
				this.$props().operationWith = id;
				this.$$("emiter-operation-with").set(id);
				this.$methods().renderAll();				
			},
			rm_sprite: function(){ //удаляет спрайт
				var id = this.props("id").getProp();
				delete this.$props().sprites[id];
				this.$methods().renderAll();
				this.parent.remove();
				
			},			
		},		
	},
	tiles_form: {
		
		props: [ ["code_form", "inputvalue", "[name='code_form']",],  ["add_tile_bg", "click", "[name='add_tile_bg']",], 
				  ["add_tile_common", "click", "[name='add_tile_common']",],  ["create_scene", "click", "[name='create_scene']",],
			],
		methods: {
			add_tile_bg: function(){
									
			   var text = '[ "tile_bg"';
				if(this.$props().sprites[this.$props("operationWith")]){						
					var sprite = this.$props().sprites[this.$props("operationWith")];					
					var id = "tile_"+Math.floor(Math.random()*10000);					
									
					tiles_bg_save.push({id: id, point: sprite.point.slice(0), parent: sprite.id });
				}	
					for(var i=0; i<tiles_bg_save.length; i++){
						var text_tile = tiles_bg_save[i];
						text = text + "," + JSON.stringify(text_tile);
					}
					text = text +"]";					 
								
				this.parent.props.code_form.setProp(text);
				updateBgTiles(this.$props().sprites);
				//console.log()
				this.$methods().renderAll(false, {drawAreaPoints: false});
			},
		    add_tile_common: function(){
				var text = '[ "tile_common"';
				if(this.$props().sprites[this.$props("operationWith")]){						
					var sprite = this.$props().sprites[this.$props("operationWith")];					
					var id = "tile_"+Math.floor(Math.random()*10000);					
					
					tiles_common_save.push({id: id, point: sprite.point.slice(0), parent: sprite.id });
				}	
					for(var i=0; i<tiles_common_save.length; i++){
						var text_tile = tiles_common_save[i];
						text = text + "," + JSON.stringify(text_tile);
					}
					text = text +"]";					 
								
				this.parent.props.code_form.setProp(text);
				updateCommonTiles(this.$props().sprites);
				
                this.$methods().renderAll(false, {drawAreaPoints: false});				
			},
			create_scene: function(){
				var text = this.parent.props.code_form.getProp(text);
				try{
				   text = JSON.parse(text);
				}
				catch (err) {
						alert(err);
				}
				if(Array.isArray(text)){
                    if(text[0] == "tile_common"){
						tiles_common_save = text;
						tiles_common_save.shift();
						updateCommonTiles(this.$props().sprites);
						
					}
                    if(text[0] == "tile_bg"){
						tiles_bg_save = text;
						tiles_bg_save.shift();
						updateBgTiles(this.$props().sprites);						
					}				
				this.$methods().renderAll(false, {drawAreaPoints: false});				
			  }
			}         			
		},		
	},
	save_sprites: {//панель сохранения загрузки спрайтов, проектов
		selector: "ul:first-of-type",
		arrayProps: [ 	
			["load_save_sprites", "click", "[name='load_save_sprites']",],			
			["project_name", "inputvalue", "[name='project_name']",],
			["save_project", "click", "[name='save_project']",],
			["load_project_click", "change", "[name='load_project']",],
			["load_project", "inputvalue", "[name='load_project']"], 
		],
		arrayMethods: {
			load_project_click: function(){
				//console.log(1111);
				var json_ = this.parent.props.load_project.htmlLink.files[0];
				handleFiles__(json_);
				var context = this;
				function handleFiles__(file) {
						json = file;
						var reader = new FileReader();					
						reader.onload = (function(aJson) { return function(e) { 
						aJson = e.target.result;							
						var project = JSON.parse(aJson);
						var dataURL = 'data:image/png;base64,' + project.backImg;
					    context.rootLink.state.sprites.props.code.setProp(project.code);
                        tiles_common_save = JSON.parse(project.tiles_common_save);				
				        tiles_bg_save = JSON.parse(project.tiles_bg_save);
						
						mainImgScale_x = 1;
						mainImgScale_y = 1; 
						img.src = dataURL;
						img.onload = function(){ 		
							startImg();	
						}	
						for(var key in  project.sprites){
							   var sprite = createFromPC(key, context, false, project.sprites[key]);
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
				//console.log(tiles_bg, tiles_common);
						if(context.$("sprite_bones_panel") != undefined && project["sprites_group"] != undefined){
								
								for(var key in project.sprites_group){
									    var sprites_group = createFromPC(key, context, false, project.sprites_group[key]);
										if(sprites_group){										
																var spr = new BoneSprite;
																spr.points = sprites_group.points;
																spr.id = key;
																
																
																if(sprites_group.frame_collection){					
					                                              spr.frame_collection = sprites_group.frame_collection.map(function(arr) { return arr.slice(0) });
	                                                              spr.frame_index = sprites_group.frame_index;
																 
																  if(sprites_group.order){
																	 spr.order = sprites_group.order; 
																  }else{
																	  var order  = []
																	  for(var i=0; i< sprites_group.frame_collection[0].length; i++){
																		  order.push(i);
																	  }
																	  spr.order = order;
																  }
															      
				                                                }
																context.$("sprite_bones_panel").props.start_module.prop = spr;
																context.$("sprite_bones_panel").props.add_sprite_group.emitEvent("click");	
											
										}					
								}				
						}
						
						}; })(json);						
						reader.readAsText(file);					
				}				
			},
			save_project: function(){
				var project = {};
				var name = this.props("project_name").getProp();
				if(name == "")name = "colagen_project";
				ctx.putImageData(saveImg, 0, 0);
				project.backImg= canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
				project.sprites = {};
				project.code  = this.rootLink.state.sprites.props.code.getProp();				               
				var text = '[';
					for(var i=0; i<tiles_bg_save.length; i++){
						var text_tile = tiles_bg_save[i];
						text = text + (i == 0 ? " " : ",") + JSON.stringify(text_tile);
					}
					text = text +"]";
				project.tiles_bg_save = text;
				    text = '[';
					for(var i=0; i<tiles_common_save.length; i++){
						var text_tile = tiles_common_save[i];
						text = text + (i == 0 ? " " : ",") + JSON.stringify(text_tile);
					}
					text = text +"]";
				project.tiles_common_save = text;				
				var sprites = this.$props().sprites;
				for(var key in sprites){
					project.sprites[key] = sprites[key].getToSave();					
				}
				if(this.$props()["sprites_group"] != undefined){
					project.sprites_group = {};
					var sprites_group = this.$props().sprites_group;
					for(var key in sprites_group){
						project.sprites_group[key] = sprites_group[key].getToSave();					
					}				
				}
				var json = JSON.stringify(project);
			    download(name+".json", json);				
				this.$methods().renderAll();
				
			},
			load_save_sprites: function(){
               if(this.prop == null){				
					this.parent.removeAll();			
					var sprites_ = get_from_storage("spritesState");
					if(sprites_){					
						for(var key in sprites_){						
							this.parent.add({id: key});						
						}				
					}
					delete sprites_;
					this.prop = true;
					this.htmlLink.innerHTML = "Скрыть"
			   }else{
				   this.parent.removeAll();
				   this.prop = null;
				   this.htmlLink.innerHTML = "Показать сохраненные спрайты"
			   }
			}	
		},		
		container: "save_sprite",
		props: [ ["create_save_sprite", "click", "[name='create_save_sprite']"], ["id", "text", "[name='id']"],
				 ["rm_save_sprite", "click", "[name='rm_save_sprite']"], ["to_beginning_coordinats", "checkbox", "[name='to_beginning_coordinats']"],
		],
		methods: {
			create_save_sprite: function(){
				var id = this.props("id").getProp();
				if(this.$props().sprites[id]){					
					alert("спрайт с таким именем уже загружен");
					return;
				}
				 lineColor = colorSpriteArea;
				this.$$("emiter-operation-with").set(id);
				//this.$props().operationWith = id;
				var sprite = createFromPC(id, this, this.props("to_beginning_coordinats").getProp());
                if(sprite.type == "sprite"){
					this.$$("emiter-create-sprite").set(id);	
                }else{
					if(this.$("sprite_bones_panel") == undefined){
						alert("панель сегментных спрайтов не подключена sprite_bones_panel");
						return;
					}
					var spr = new BoneSprite;
					spr.points = sprite.points.slice(0);
					spr.id = id;
                   if(sprite.frame_collection){					
					spr.frame_collection = sprite.frame_collection.map(function(arr) { return arr.slice(0) });
	                spr.frame_index = sprite.frame_index;
																  if(sprite.order){
																	 spr.order = sprite.order; 
																  }else{
																	  var order  = []
																	  for(var i=0; i< sprite.frame_collection[0].length; i++){
																		  order.push(i);
																	  }
																	  spr.order = order;
																  }					
				   }				   
					this.$("sprite_bones_panel").props.start_module.prop = spr;
					this.$("sprite_bones_panel").props.add_sprite_group.emitEvent("click");				
				}												
			},
			rm_save_sprite: function(){
				var id = this.props("id").getProp();
				removeFromPC(id);
                this.component().props.load_save_sprites.emitEvent("click");			
			}			
		},
	},
	//общие переменные, свойства 
	stateProperties: {		
		operationWith: "common", ///"spriteID" операция с объектом - спрайтом или общей картинкой "common"
		commonProps: { 	//обект с переменными для операций с фоновой картинкой	
			area_1: [], //область выделения до смещения
			area_2: [], //область выделения после смещения
			isEndArea_1: false, //флаг показывает - закончено ли выделение первой области (замкнут контур выделения)
			isMovePoint : false, //индекс перемещаемой/искажаемой точки контура
			scale_or_move: "move", // scale масштаб(искажение) по точкам либо перемещение точки контура 
			scale_asix: "xy", //ось искажения
			sprite_grid: false, //сетка спрайтов [x, y]
		},
		sprites: {},	//спрайты
	    showBox: true, //показывать квадрат в который вписан спрайт
	    showPoints: false, //контрольные точки выделения спрайтов
        warper: false, //деформация изображения 		
	},
	//общие методы
	stateMethods: {		
		renderAll: function(operationName, option){	//отображает на экране все спрайты и фоновую картинку
            ctx.save();///////////////
            ctx.translate(ctxTranslate[0], ctxTranslate[1]);
			if(option == undefined){
				option = {
					showBox: this.stateProperties.showBox,
					showPoints:  this.stateProperties.showPoints,
                    drawAreaPoints: true,					
				}
			}else{
				option.showBox = this.stateProperties.showBox;
				option.showPoints = this.stateProperties.showPoints;
				if(option.drawAreaPoints == undefined)option.drawAreaPoints = true;
			}		
			ctx.putImageData(saveImg, 0, 0);
			var sprId_or_common = this.stateProperties.operationWith;
			var sprites = this.stateProperties.sprites;
			renderAllTiles();
           				
			for (var key in sprites){				
				sprites[key].render(sprId_or_common, operationName, option);
				//console.log(sprites);
			}
			if( this.stateProperties.operationWith == "common" && option.drawAreaPoints != false)drawAreaPoints(this.stateProperties.commonProps.area_1, this.stateProperties.commonProps.isEndArea_1);
			this.stateMethods.drawGrid();
			 ctx.restore();////////////////////////////
		},
		drawGrid: function(){
			if(this.stateProperties.commonProps.sprite_grid)drawSpriteGrid(this.stateProperties.commonProps.sprite_grid[0], this.stateProperties.commonProps.sprite_grid[1]);
		},
        setAreas: function(area){ //копирует масив с точками 
				this.stateProperties.commonProps.area_1 = area.slice(0);
				this.stateProperties.commonProps.area_2 = area.slice(0);					
		},
        setPoint : function(point, indexPoint, areaName){

			this.stateProperties.commonProps[areaName][indexPoint][0] = point[0];
			this.stateProperties.commonProps[areaName][indexPoint][1] = point[1];
			if(point[2])this.stateProperties.commonProps[areaName][indexPoint][2] = point[2];
		},
        startWarper: function(){
			                    var context = this;						
								var img = 	new Image();
							    ctx.putImageData(saveImg, 0, 0);
								var dataURL = canvas.toDataURL("image/png");
						        img.src = dataURL;
                                img.onload = function(){									
									if(modules.ImgWarper)context.$props().warper = new modules.ImgWarper.PointDefiner(canvas, img, saveImg, function(){ drawArea(context.stateProperties.commonProps.area_1, context.stateProperties.commonProps.isEndArea_1, 3, colorAdditionalArea)  });
								}
                         this.$methods().renderAll(false, {drawAreaPoints: false});
			
		},		
	},	
	eventEmiters: {		
		["emiter-create-sprite"] : {prop: ""}, //событие создания спрайта
		["emiter-keydown"] : {prop: "key"}, //событие нажатия кнопки клавиатуры
		["emiter-mousemove-canvas"] : {prop: ["x", "y"]}, //событие движения курсора по канвас и массив с координатами точки 
		["emiter-mousedown-canvas"] : {prop:  ["x", "y"]},
		["emiter-mouseup-canvas"] : {prop:  ["x", "y"]},
		["emiter-mousewheel-canvas"] : {prop:  0}, //событие прокрутки колесика мыши
		["emiter-operation-with"] : { //событие смены текущей операции (common, sprite_id, module_name ....)
			prop: "common",
			behavior: function(){				
				this.$props().operationWith = this.prop;
				
			}		
		}, 

	}	
}
/*window.onload= function(){	
	
}*/

  function getFi(point1, point2){	  
	            var an =  Math.atan2(point2[1]-point1[1], point2[0]-point1[0]); ////////////определение угла поворота точки
				return an*180/Math.PI -90 ;
  }