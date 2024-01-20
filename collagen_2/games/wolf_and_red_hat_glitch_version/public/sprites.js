
function CollageSprite(img, area, id, rotate){
	var imgBox = getBox(area);
    this.type = "sprite";	
	
	this.id = id;
	this.frame = img;
	this.frame_collection = [];///варианты изображения спрайта
	this.frame_index = 0;
	this.point = imgBox[0]; //верхяя левая точка спрайта на канвас
	this.point2 = imgBox[1];
	this.controlPoint = false; //контрольная точка размещения центра спрайта на канвас
	this.controlSpritePoint = false; //контрольная точка в спрайт листе
	this.area_1 = area;
	this.area_2 = area.slice(0);
	this.cursorOver = false;
	this.currentOperation = false;  //"move" - движение всего спрайта 	
	//this.isMove = false; //движение всего спрайта
	this.moveStart = false; //начало движения "move" координаты
	//this.isMovePoint = false; //движение одной точки - ее индекс i	
	this.rotate = 0; //вращение относительно начального при создании спрайта
	if(rotate != undefined)this.rotate = rotate;
	this.show = true;
	this.stamp_cursor = false;//рисование спрайтом
	this.scale_x = 1; //масштаб относительно изначального при создании спрайта
	this.scale_y = 1;
	this.width = this.point2[0] - this.point[0];
	this.height = this.point2[1] - this.point[1];
	
	//this.inSegment = true; ///[]
	this.border = false;/* {
		size: 20,
		color: "red"		
	},*/
	this.textParam = false; /* {
		text: "", 
		lineHeight: 30, высота строки
		font: "30px Balsamiq Sans",
		fillStyle: "red",
		padding_x_l: 0, отступ слева
		padding_x_r: 0,	отступ справа	
		padding_x: false, 
	    padding_y: 0, отступ с верху
        max_width: false, максимальная ширина: ширина спрайта - отступы
        textArr: false,		
	}*/	
}
//включает следующюю картинку из колекции 
CollageSprite.prototype.nextFrame = function(index){
	this.frame_index +=1;
	if(index || index ===  0)this.frame_index = index;
	if(this.frame_index > this.frame_collection.length -1 ){
		this.frame_index = 0;
	}
	this.frame = this.frame_collection[this.frame_index];	
}
CollageSprite.prototype.prevFrame = function(index){	
	this.frame_index -=1;
	if(index || index ===  0)this.frame_index = index;
	if(this.frame_index < 0  ){
		this.frame_index = this.frame_collection.length -1;
	}
	this.frame = this.frame_collection[this.frame_index];	
}

//при масштабировании и вращении спрайта, сначала считается масштабирование относительно начального размера,
// затем поворот относительно центра уже отмасштабированого спрайта
//поворот также считается относительно начального, при создании спрайта
//масштабирование идет от центра в обоих направлениях
//при отражении спрайта убирается вращение затем производится отражение, затем вращается сново уже отраженным 
CollageSprite.prototype.render = function(sprite_id , operationName, option){
	if(option == undefined)option = {};
	if(!this.show || this.id == sprite_id  &&   option.not_render == true)return;
	
    var area = this.area_1;
		if(operationName == "move" && this.id == sprite_id ){
		area = this.area_2;
	}	
	var point = this.point;
	var width = this.width;
	var height = this.height;

	if(this.stamp_cursor == true && this.stamp_cursor_point){	//штам курсор - координаты мыши
		point = this.stamp_cursor_point ;
	}		
	if(this.rotate !== 0){ //вращение спрайта
		var halfW = width/2;
		var halfH = height/2;
		
		
	    area = rotationArea(this.area_1, this.rotate);	
		
		if(operationName == "move" && this.id == sprite_id ){	//перемещение при вращении							
			area = rotationArea(this.area_2, this.rotate);									
		}	
			var move = [this.point[0]+  halfW, this.point[1] + halfH]; //translate в точку move для вращения canvas
			
            if(this.stamp_cursor == true){			
				move = [point[0]+  halfW , point[1] + halfH ]; //translate в точку move для вращения canvas при операции штам курсор
			}
			ctx.save();
			ctx.translate(move[0],   move[1]);				
			ctx.rotate(this.rotate); 		
			ctx.drawImage(this.frame, -halfW, -halfH, width, height);
						
			if(this.border && this.border.size > 0){ //рисование границы спрайта при ее наличии
				ctx.restore();
				if(this.stamp_cursor == true){ //рисование граници при операции штам курсор
					var move = [point[0]+  halfW , point[1] + halfH ];
					var imgBox = getBox(this.area_1);						
					var area = getCutSize(this.area_1, imgBox[0][0]-move[0]+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-move[1]+(imgBox[1][1]-imgBox[0][1])/2 );
                    area = rotationArea(area, this.rotate);						
				}
				drawArea(area, true, this.border.size, this.border.color);
				ctx.save();
				ctx.translate(move[0],   move[1]);				
				ctx.rotate(this.rotate); 
			}			
			if(this.textParam && this.textParam.text != "")this.fillText(-halfW, -halfH); //добавление текста 			
			ctx.restore();
			
	}else{//без вращения
		
		ctx.drawImage(this.frame, point[0], point[1], width, height);
		if(this.border){
			if(this.stamp_cursor == true){
					var imgBox = getBox(area);						
					area = getCutSize(area, imgBox[0][0]-point[0]- width/2+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-point[1]- height/2+(imgBox[1][1]-imgBox[0][1])/2 );				
			}
			drawArea(area, true, this.border.size, this.border.color);
		}
		if(this.textParam)this.fillText(point[0], point[1]);
	}
	if(this.id == sprite_id && this.stamp_cursor == false){
		
		if(option.showPoints == true){
			drawAreaPoints(area);
		}else{
			drawArea(area, true);
		}		
		if( option.showBox == true){
			drawBox(this.point, this.point2, "yellow", 1);
		}	
	}
}
///более быстрый рендер спрайта, не рисует контур, границу и текст
CollageSprite.prototype.render_ = function(){
	if(!this.show)return;		
	//var point = this.point;
	//var width = this.point2[0] - this.point[0];
	//var height = this.point2[1] - this.point[1];
	
	if(this.rotate !== 0){ //вращение спрайта
		var halfW = this.width/2;
		var halfH = this.height/2;		
	    var area = rotationArea(this.area_1, this.rotate);		
			var move = [this.point[0]+  halfW, this.point[1] + halfH]; //translate в точку move для вращения canvas
			ctx.save();
			ctx.translate(move[0],   move[1]);				
			ctx.rotate(this.rotate); 		
			ctx.drawImage(this.frame, -halfW, -halfH, this.width, this.height);		
			ctx.restore();			
	}else{//без вращения		
		ctx.drawImage(this.frame, this.point[0], this.point[1], this.width, this.height);
	}
}

///сдвигает спрайт 
CollageSprite.prototype.move = function(x, y/*, isRender*/){					
						var area_1 = getCutSize(this.area_1, x*-1, y*-1);
						this.setAreas(area_1);
						//if(isRender === undefined && isRender !== false)this.render_();
}
CollageSprite.prototype.moveConer = function(x, y/*, isRender*/, bottom){	//перемещает спрайт в указанные координаты	
                        var h= 0;
                        if(bottom)h = this.height;						
						var area_1 = this.area_1;
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y+h);
						this.setAreas(area_1);
						//if(isRender === undefined && isRender !== false)this.render_();
}
CollageSprite.prototype.moveCenter= function(x,y/*, isRender*/){
						var area_1 = this.area_1;
						var imgBox = getBox(area_1);
						area_1 = getCutSize(area_1, imgBox[0][0]-x+this.width/2, imgBox[0][1]-y+this.height/2 );
						this.setAreas(area_1);
						//if(isRender === undefined && isRender !== false)this.render_();		
}

CollageSprite.prototype.rotateFi = function(fi/*, isRender*/){
	this.rotate =  parseInt(fi)* Math.PI / 180;
	//if(isRender === undefined && isRender !== false)this.render_();
}

//масштабирование спрайта isRender -false отменить рисование
CollageSprite.prototype.scale = function(coeff_x, coeff_y/*, isRender*/){
	if(coeff_x == this.scale_x && coeff_y == this.scale_y)return;
	
	var current_scale_x = coeff_x/this.scale_x; var current_scale_y = coeff_y/this.scale_y;
	var area = scaleArea(this.area_1, current_scale_x, current_scale_y, false);
	this.area_1 = area.slice(0);
	//this.area_2 = area.slice(0);

	var imgBox = getBox(area);
	this.point = imgBox[0];
	this.point2 = imgBox[1];
	////////////
	this.width = this.point2[0] - this.point[0];
	this.height = this.point2[1] - this.point[1];
	/////////////
	this.scale_x = coeff_x;
	this.scale_y = coeff_y;
	if(this.textParam != false){
		this.textParam.max_width = false;
		this.textParam.textArr = false;
	}	
	if(coeff_x == coeff_y && this.scale_x !==1 && this.scale_y !==1 ||  coeff_x == coeff_y & this.round_scale == undefined){
        var sc = current_scale_x;
        if(this.round_scale == undefined)sc = coeff_x;		
		for(var i=0; i< this.area_1.length; i++){		
			if(this.area_1[i][2]){
                this.round_scale = true;				
				this.area_1[i][2] = this.area_1[i][2]*sc;
			}		
		}
	}
   // if(isRender === undefined && isRender !== false)this.render_();	
}
//событие клика 
CollageSprite.prototype.click = function(point){

}
//событие нажатия кнопки клавиатуры
CollageSprite.prototype.keydown = function(key){

}	
//цикл для анимации спрайтов
//sprites - объект спрайтов, в том числе скелетных спрайтов, speed - количество перерисовок в секунду,
//sprites_ - объект спрайтов, не включающий сегментные спрайты
function animationLop(sprites, speed, sprites_){                
 // var pos = "moveCenter";
  var off = {isOff: false};
  let prev = performance.now();
  function lop() {
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){		    
		    prev = lt;			
	        // ctx.putImageData(saveImg, 0, 0);
			  ctx.clearRect(0, 0, srcWidth , srcHeight);
			 for(var key in sprites){
				if(sprites[key].type == "sprite"){sprites[key].render_();}else{
				   sprites[key].render_(sprites_);
				}
			 }
	} 
	if(!off.isOff)requestAnimationFrame(lop);
  }
  lop();
 return  off;
}


//position - center, coner
CollageSprite.prototype.moveByLine = function(lineArray, speed, position, callb, option){

   var linePos = 0; ///точка на линии                
  var sprite =this;  
  var pos = "moveCenter";
  if(position){ 
     if(position == 1)pos = "moveConer";
  }  
  let prev = performance.now();
  function lop() {
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){	    
		    prev = lt;			

				sprite.nextFrame(lineArray[linePos][2]);
				sprite[""+pos](lineArray[linePos][0],lineArray[linePos][1], true);

			 linePos++;
	} 
	if(linePos > lineArray.length-1){
		if(callb)callb(option);
		return;
	}
	requestAnimationFrame(lop);
  }
  lop();		
}
				
//событие canvas mousedown
CollageSprite.prototype.mousedown = function(point, e, context){	
	if(this.cursorOver){     //move движение всего спрайта
        //var click = this.click(point);	
		if(/*click &&*/ this.moveStart === false /*&& this.isMovePoint === false*/&& this.currentOperation === false){
			this.moveStart = point;
			this.currentOperation = "move";
			this.savePoints = {point: this.point.slice(0), point2: this.point2.slice(0),}
            return ;								
		}							
	}
    if(this.stamp_cursor === true){ //рисование спрайтом
		var point = getCanvasPoint(e, canvas, context);
		this.stamp_cursor_point = [ point[0] - this.getHalfW(),   point[1] - this.getHalfH(),];
		ctx.putImageData(saveImg, 0, 0);
		saveStep(saveImg, context.$props().commonProps.area_1);
		this.render();
		saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
		context.$methods().renderAll();		
	}
}
//событие canvas mousemove 
CollageSprite.prototype.mousemove  = function(point, context, e){	
	if(this.currentOperation === "move"){					      //move движение всего спрайта					
		var distance = [this.moveStart[0] - point[0], this.moveStart[1] -  point[1] ];		
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1]];
		context.$methods().renderAll("move");
	}
	if(this.stamp_cursor === true){ //премещение спрайта курсором при рисовании
		var point = getCanvasPoint(e, canvas, context);
		this.stamp_cursor_point = [ point[0] - this.getHalfW(),   point[1] - this.getHalfH(),];
		//ctx.putImageData(saveImg, 0, 0);
		//this.render();
		//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
		context.$methods().renderAll();		
	}	
}
//событие canvas mouseup
CollageSprite.prototype.mouseup  = function(context, movePointEnd){ 
	if(this.currentOperation == "move"){ 													
		//var movePointEnd = getCanvasPoint(event, canvas);
		this.currentOperation = false;
		var distance = [this.moveStart[0] - movePointEnd[0], this.moveStart[1] -  movePointEnd[1] ];
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.area_1 = this.area_2.slice(0);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1],  ];
		context.$methods().renderAll();
		this.moveStart =false;
	}
}
//проверяет попадаеют ли координаты точки в контур спрайта, учитывает поворот и масштаб спрайта
CollageSprite.prototype.cursorOver_ = function(point, cursorChange){
	var area = this.area_1;
	if(this.rotate !== 0){
		area = rotationArea(this.area_1, this.rotate);
	}	
	var pathArea = getPathArea(area);						 
	var isOver = ctx.isPointInPath(pathArea, point[0], point[1]);	
	if(isOver){							
		if(cursorChange === undefined || cursorChange === true)document.body.style.cursor = "pointer";
		this.cursorOver = true;
	}else{
		document.body.style.cursor = "auto";
		this.cursorOver = false;
	}	
}

//обновляет точки контура и крайние точки изображения
CollageSprite.prototype.setAreas = function(area){
	this.area_1 = area.slice(0);
	//this.area_2 = area.slice(0);
	var imgBox = getBox(area);	
	this.point = imgBox[0];
	this.point2 = imgBox[1];	
}

//отражает спрайт 
CollageSprite.prototype.flip = function(x, y, context){
	ctx.clearRect(0, 0, srcWidth , srcHeight);
			var width = this.point2[0] - this.point[0];
			var height = this.point2[1] - this.point[1];
			var halfW = width/2;
			var halfH = height/2;	
			var move = [this.point[0]+  halfW, this.point[1] + halfH];
			ctx.save();
			ctx.translate(move[0],   move[1]);     			
				if(x)ctx.scale( -1, 1);
				if(y)ctx.scale( 1, -1);           			           				
			ctx.drawImage(this.frame, -halfW, -halfH, width, height);
			ctx.restore();	
	var area = flipArea(this.area_1, x, y);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
	var imgMapArr = getCutImg(ctx, area, false);
	context.$methods().renderAll(false, {not_render: true});
	getImgToSprite(imgMapArr, this, true, false);
}
//добавление текста при рендере спрайта
CollageSprite.prototype.fillText = function(x, y){
	
	        if(!this.textParam.max_width){
				this.textParam.max_width = this.point2[0] - this.point[0];
				if(this.textParam.padding_x_l)this.textParam.max_width -= this.textParam.padding_x_l;
				if(this.textParam.padding_x_r != undefined){
					this.textParam.max_width -= this.textParam.padding_x_r;
					this.textParam.padding_x = this.textParam.padding_x_r;
				}
				if(!this.textParam.padding_x_r && !this.textParam.padding_x_l && this.textParam.padding_x)this.textParam.max_width -= this.textParam.padding_x*2;				
			}	
		    ctx.fillStyle = this.textParam.fillStyle;
			ctx.font = this.textParam.font;
			if(!this.textParam.textArr)this.textParam.textArr = getLines(ctx, this.textParam.text, this.textParam.max_width);
			for(var i=0; i<this.textParam.textArr.length; i++){			
				ctx.fillText(this.textParam.textArr[i], x+this.textParam.padding_x, y+this.textParam.padding_y+(this.textParam.lineHeight*(i+1)));				
			}	
}
//сохраняет спрайт в локальном хранилище
CollageSprite.prototype.saveOnPC = function(){ 
				var name = this.id;
                var state = get_from_storage("spritesState");				
				if(state == null)state = {};			
				state[name] = this.getToSave();
                try{				
					save_in_storage(state, "spritesState");
                }catch(e){
					alert(e);
					return;
				}
				console.log("спрайт "+name+" сохранен");
}
//возвращает объект с данными для сохранения спрайта
CollageSprite.prototype.getToSave = function(){ 				
				var img = this.frame;				
				//var imgAsURL = getBase64Image(img);
                var imgAsURL_collection  = [];				
                for(var i=0; i< this.frame_collection.length; i++){
					imgAsURL_collection.push(getBase64Image(this.frame_collection[i]));
				}
               // console.log(imgAsURL_collection);				
				var area = this.area_1.slice(0);
	            
				var sprite = {
					area: area,
					//imgAsURL: imgAsURL,
					imgAsURL_collection: imgAsURL_collection,
					//this.frame_index
                    rotate: this.rotate,
					scale_x: this.scale_x,
					scale_y: this.scale_y,
                    controlSpritePoint: this.controlSpritePoint,
                    controlPoint: this.controlPoint,
                    textParam: this.textParam,	
                    border: this.border,
                    type: "sprite",
                    show: this.show,					
				}				
				return sprite;
}

//восстановить спрайт из локального хранилища
function createFromPC(spr_id, context, to_beginning, fromProject){ 
	var sprite_;
	if(fromProject == undefined){
		sprite_ = get_from_storage ("spritesState", spr_id);
	}else{
		sprite_ = fromProject;
	}
	if(sprite_["type"] == undefined)sprite_.type = "sprite";
	var area;
   if(sprite_.type == "sprite_bone"){
		area = sprite_.points;
   }else{		
		area = sprite_.area;
		if(!area)area = sprite_.cut_area;
   }
	if(to_beginning === true){
		var imgBox_ = getBox(area);				
	    area = getCutSize(area, imgBox_[0][0], imgBox_[0][1]);
	}	
    if(sprite_.type == "sprite"){
		var imgAsURL_collection = [];
	if(sprite_.imgAsURL){
		sprite_.imgAsURL_collection = [sprite_.imgAsURL];
	}
    	for(var i=0; i < sprite_.imgAsURL_collection.length; i++){
		var dataURL = 'data:image/png;base64,' + sprite_.imgAsURL_collection[i];
		var img_ = new Image();
		img_.src = dataURL;
		imgAsURL_collection.push(img_);
	   }	   
	var imgBox = getBox(area);
   // var img = new Image();
	var sprite = new CollageSprite( imgAsURL_collection[0], area, spr_id, sprite_.rotate);
	if(sprite_.scale_x == undefined){sprite.scale_x = 1;}else{sprite.scale_x = sprite_.scale_x;}
	if(sprite_.scale_y == undefined){sprite.scale_y = 1;}else{sprite.scale_y = sprite_.scale_y;}	
	if(sprite_.controlSpritePoint != undefined)sprite.controlSpritePoint = sprite_.controlSpritePoint;
	if(sprite_.controlPoint != undefined)sprite.controlPoint = sprite_.controlPoint;
	if(sprite_.textParam != undefined)sprite.textParam = sprite_.textParam;
	if(sprite_.border != undefined)sprite.border = sprite_.border;
	if(sprite_.show != undefined)sprite.show = sprite_.show;
	sprite.type = "sprite";	
	context.$props("sprites")[spr_id] = sprite;
       sprite.frame_collection = imgAsURL_collection;
	   sprite.frame_collection[0].onload = function(){ 		
		   context.$methods().renderAll();		
	   }
	   return sprite;
    }	
	return sprite_;	
}
 //удалить спрайт из локального хранилища
function removeFromPC(spr_id){
	var sprites = get_from_storage ("spritesState");
	delete sprites [spr_id];	
	save_in_storage (sprites, "spritesState");
}

CollageSprite.prototype.getHalfW = function(){
	return 	(this.point2[0]-this.point[0])/2;
}
CollageSprite.prototype.getHalfH = function(){
	return 	(this.point2[1]-this.point[1])/2;
}

/**
CollageSprite.prototype.rotateArea = function(){	
	var area = rotationArea(this.area_1, this.rotate);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
}
**/

/*
//перемещает центр спрайта в указанную точку
CollageSprite.prototype.moveCenterTo  = function(point){
	    var h_w = this.getHalfW();
		var h_h = this.getHalfH();			
		this.area_1 = getCutSize(this.area_1, this.point[0], this.point[1]);
		this.area_1 = getCutSize(this.area_1, -point[0]+h_w, -point[1]+h_h);
		//this.area_2 = this.area_1.slice(0);
		var imgBox = getBox(this.area_1);		
		this.point = imgBox[0];
		this.point2 = imgBox[1];		
}
*/

/*
function moveByLineGroup(sprites, lineArrays, speed, position, callb, option){

	 var linePos = 0;
	  var pos = "moveCenter";
     if(position){ if(position == 1)pos = "moveConer";
     }
	 var maxPoints = 0;	 
	 for(var t= 0; t< lineArrays.length; t++){ 
	     if(lineArrays[t].length >  maxPoints)maxPoints = lineArrays[t].length-1;	 
	 }	 	 
   let prev = performance.now();
  function lop() {
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){		    
		    prev = lt;		
					 for(var i= 0; i< lineArrays.length; i++){
						if(linePos > lineArrays[i].length -1 ) continue;
						sprites[i].nextFrame(lineArrays[i][linePos][2]);
						sprites[i][""+pos](lineArrays[i][linePos][0],lineArrays[i][linePos][1], true); 
					}			 		
			 linePos++;
	} 
	if(linePos > maxPoints){
		if(callb)callb(option);
		return;
	}
	requestAnimationFrame(lop);
  }
  lop(); 
}
	*/	


















