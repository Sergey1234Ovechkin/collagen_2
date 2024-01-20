

var StateMap = {
	canvas: { //канвас	
		container: "canvas",
		props: [["mousedown", "mousedown", ""], ["mousemove", "mousemove", ""], ["mouseup", "mouseup", ""],
		                                            ///события кнопок клавиатуры
		         ["mousewheel", "mousewheel", ""], ["keydown", "emiter-keydown", ""], ["keyup", "emiter-keyup", ""],				 
		         ],
		methods: {
            mousewheel: function(){
                event.preventDefault();			 
				this.$$("emiter-mousewheel-canvas").set(event.deltaY);
			},
			keyup: function(){
				 var key = this.$$("emiter-keyup").prop;
				modules.keyup(key);
			},
            keydown: function(){ ///события кнопок клавиатуры
			 var key = this.$$("emiter-keydown").prop;
                modules.keydown(key);
					if(isMoveCamera){				
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
		["emiter-keyup"] : {prop: "key"}, //событие нажатия кнопки клавиатуры
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