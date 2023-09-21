
function BoneSprite(){
	
	this.points = []; /// компоненты массива - точки спрайта скординатами и параметрами 
	                 ////[x, y, parent segment, fi, sprite_id, frame ]
	this.frame_collection = [];
	this.order = []; //порядок отрисовки сегментов
	this.frame_index = 0;
	this.halfPointSize = halfPointSize; //размер квадратов контрольных точек
	this.isMovePoint = false; //перемещение контрольной точки
	this.colorLine = colorCommonArea; //цвет линий 
	this.weightLine = lineWidth; // толщина линий
	this.id = false;
	this.show = true;
	this.type = "sprite_bone";
	//this.active = true;
	//this.scaleSpites = true; ///
}

BoneSprite.prototype.getSize = function(){
	var imgBox = getBox(this.points);
	var point = imgBox[0]; //верхяя левая точка спрайта на канвас
	var point2 = imgBox[1];
	return [point2[0] - point[0],  point2[1] - point[1]];
	
}

BoneSprite.prototype.setFi = function(){ //определяет углы между точками	    
        for(var i=1; i< this.points.length; i++){			
			var point2 = this.points[i];
			var point1 = this.points[this.points[i][2]];
			var an =  Math.atan2(point2[1]-point1[1], point2[0]-point1[0]); ////////////определение угла поворота точки
			this.points[i][3] =  an*180/Math.PI -90 ;
		}
}

//включает следующюю картинку из колекции 
BoneSprite.prototype.nextFrame = function(index){
	this.frame_index +=1;
	if(index)this.frame_index = index;
	if(this.frame_index > this.frame_collection.length -1 ){
		this.frame_index = 0;
	}
	this.points = this.frame_collection[this.frame_index].map(function(arr) {
                                              return arr.slice(0);
                  });	
}

BoneSprite.prototype.prevFrame = function(index){	
	this.frame_index -=1;
	if(index)this.frame_index = index;
	if(this.frame_index < 0  ){
		this.frame_index = this.frame_collection.length -1;
	}
	this.points =this.frame_collection[this.frame_index].map(function(arr) {
                                              return arr.slice(0);
                  });	
}

BoneSprite.prototype.move = function(x, y){	///передвижение группы спрайтов
				this.points = getCutSize(this.points, x*-1, y*-1);
			    for(var i =0; i< this.frame_collection.length; i++){					
					this.frame_collection[i]= getCutSize(this.frame_collection[i], x*-1, y*-1);
				}
}


BoneSprite.prototype.moveConer = function(x, y,  /*isRender, sprites,*/ bootom){	//перемещает группу в указанные координаты 	
                        var h = 0;
                        				
						for(var i =0; i< this.frame_collection.length; i++){
							var area_1 = this.frame_collection[i].slice(0);
							var imgBox = getBox(area_1);
                            if(bootom)h  = 	imgBox[1][1] - imgBox[0][1];							
							this.frame_collection[i] = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y+ h );							
						}
                            var area_= this.points.slice(0);	
                            var imgBox_ = getBox(area_);
							if(bootom)h  = 	imgBox_[1][1] - imgBox_[0][1];
                            this.points = getCutSize(area_, imgBox_[0][0]-x, imgBox_[0][1]-y+ h);							
							//if(isRender !== undefined && isRender !== false)this.render_(sprites);
}

BoneSprite.prototype.moveCenter = function(x, y/*,  isRender, sprites*/){	//перемещает группу в указанные координаты 				
						for(var i =0; i< this.frame_collection.length; i++){
							var area_1 = this.frame_collection[i].slice(0);
							var imgBox = getBox(area_1);						
							this.frame_collection[i] = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );							
						}
                            var area_= this.points.slice(0);	
                            var imgBox_ = getBox(area_);
                            this.points = getCutSize(area_, imgBox_[0][0]-x+(imgBox_[1][0]-imgBox_[0][0])/2, imgBox_[0][1]-y+(imgBox_[1][1]-imgBox_[0][1])/2 );							
							//if(isRender !== undefined && isRender !== false)this.render_(sprites);
}

//position - center, coner
BoneSprite.prototype.animation = function(sprites ,speed, callb, option/*, isDrawSegments*/){

   var linePos = 0; ///точка на линии                
  var sprite =this;  
  let prev = performance.now();
  function lop() {
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){	    
		    prev = lt;				         
				//if(draw)ctx.putImageData(saveImg, 0, 0);
				 sprite.nextFrame();
				/*if(isDrawSegments !== undefined && isDrawSegments !== false){
					sprite.render_(sprites);
				}*/			 
			 linePos++;
	} 
	if(linePos > sprite.frame_collection.length-1){
		if(callb)callb(option);
		return;
	}
	requestAnimationFrame(lop);
  }
  lop();		
}

BoneSprite.prototype.hideShow = function(sprites, isShow){	 
			  for(var i=1; i< this.points.length; i++){
                  if(sprites[ this.points[i][4] ]){				  
                      var id  =  this.points[i][4];					  
				      if(id == false || !sprites[id])return
					  var sprite = sprites[id];
					  sprite.show = isShow;				  			  
			    }
			  }	
}
BoneSprite.prototype.render = function(sprites, isActive){
	              if(!this.show)return;
                if(isActive == "active"){				  
				  for(var i=1; i< this.points.length; i++){			  
				   drawLine(this.points[i], this.points[this.points[i][2]],  this.colorLine, this.weightLine);				  
			      }
				}				 
			  for(var i=1; i< this.points.length; i++){
				  var t = this.order[i];
                  if(sprites[this.points[t][4]] ){				  
                      var id  =  this.points[t][4];					  
				      if(id == false)continue;					  
					  var x = (this.points[t][0] - this.points[ this.points[t][2] ][0])/2 + this.points[ this.points[t][2] ][0];
					  var y = (this.points[t][1] - this.points[ this.points[t][2] ][1])/2 + this.points[ this.points[t][2] ][1];
					  var sprite = sprites[id];
					  sprite.rotate = this.points[t][3]* Math.PI / 180;;
					  var area_1 = sprite.area_1;
					  //var imgBox = getBox(area_1);
					  area_1 = getCutSize(area_1, sprite.point[0]-x+sprite.width/2, sprite.point[1]-y+sprite.height/2  );
					  sprite.setAreas(area_1);					 
					  sprites[this.points[t][4]].render_(/*"common"*/);                   					  				  
			    }
			  }  
             if( isActive == "active"){			 
			  drawAllSquares(this.points, this.halfPointSize);
	         }
}

///более быстрый метод отрисовки не рисует, контур и контрольные точки
BoneSprite.prototype.render_ = function(sprites){
	          
	          if(!this.show)return;				 
			  for(var i=1; i< this.points.length; i++){
				  var t = this.order[i];
                  if(sprites[this.points[t][4]] ){				  
                      var id  =  this.points[t][4];					  
				      if(id == false)continue;					  
					  var x = (this.points[t][0] - this.points[ this.points[t][2] ][0])/2 + this.points[ this.points[t][2] ][0];
					  var y = (this.points[t][1] - this.points[ this.points[t][2] ][1])/2 + this.points[ this.points[t][2] ][1];
					  var sprite = sprites[id];
					  sprite.rotate = this.points[t][3]* Math.PI / 180;;
					  var area_1 = sprite.area_1;
					  //var imgBox = getBox(area_1);
					  area_1 = getCutSize(area_1, sprite.point[0]-x+sprite.width/2, sprite.point[1]-y+sprite.height/2 );
					  sprite.setAreas(area_1);					 
					  sprites[this.points[t][4]].render_(/*"common"*/);                   					  				  
			    }
			  } 
}

BoneSprite.prototype.copyContur = function(){
	          ctx.putImageData(saveImg, 0, 0);
				  for(var i=1; i< this.points.length; i++){			  
				  drawLine(this.points[i], this.points[this.points[i][2]],  this.colorLine, this.weightLine);				  
			  }
              saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);			  
}

//сохраняет спрайт в локальном хранилище
BoneSprite.prototype.saveOnPC = function(){ 
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
				console.log("сегментный спрайт "+name+" сохранен");
}


//возвращает объект с данными для сохранения спрайта
BoneSprite.prototype.getToSave = function(){ 
				
				var group = { points: this.points.slice(0),
								type: "sprite_bone",
								frame_collection: this.frame_collection.map(function(arr) { return arr.slice(0) }),
	                            frame_index: this.frame_index,
	                            id: this.id,
								order: this.order, 
				}; 
			
				return group;
}

/*
BoneSprite.prototype.render = function(sprites, isActive){
	              if(!this.show)return;
                if(isActive == "active"){				  
				  for(var i=1; i< this.points.length; i++){			  
				   drawLine(this.points[i], this.points[this.points[i][2]],  this.colorLine, this.weightLine);				  
			      }
				}				 
			  for(var i=1; i< this.points.length; i++){
                  if(sprites[this.points[i][4]] ){				  
                      var id  =  this.points[i][4];					  
				      if(id == false)return;					  
					  var x = (this.points[i][0] - this.points[ this.points[i][2] ][0])/2 + this.points[ this.points[i][2] ][0];
					  var y = (this.points[i][1] - this.points[ this.points[i][2] ][1])/2 + this.points[ this.points[i][2] ][1];
					  var sprite = sprites[id];
					  sprite.rotate = this.points[i][3]* Math.PI / 180;;
					  var area_1 = sprite.area_1;
					  var imgBox = getBox(area_1);
					  area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
					  sprite.setAreas(area_1);					 
					  sprites[this.points[i][4]].render_();                   					  				  
			    }
			  } 
             if( isActive == "active"){			 
			  drawAllSquares(this.points, this.halfPointSize);
	         }
}
*/

/*
BoneSprite.prototype.getPositionSpites = function(context){
		    var sprites = context.$props().sprites;		
			// for (var key in sprites){	 
			  for(var i=1; i< this.points.length; i++){
                  if(sprites[ this.points[i][4] ]){				  
                  //if(this.points[i][4]){
                      var id  =  this.points[i][4];					  
				      if(id == false)return
					  
					  var x = (this.points[i][0] - this.points[ this.points[i][2] ][0])/2 + this.points[ this.points[i][2] ][0];
					  var y = (this.points[i][1] - this.points[ this.points[i][2] ][1])/2 + this.points[ this.points[i][2] ][1];
					  var sprite = context.$props().sprites[id];
					  sprite.rotate = this.points[i][3]* Math.PI / 180;
					 // console.log(sprite.rotate);
					  var area_1 = sprite.area_1;
					  var imgBox = getBox(area_1);
					  area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
					  sprite.setAreas(area_1);
					 // sprite.render("common");				  
                  //}				  
			    }
			  }
			// } 	
}
*/

/*
//position - center, coner
BoneSprite.prototype.getPositionCycle = function(context ,speed, callb, option){
	var linePos = 0; ///точка на линии                
	var sprite =this;  
  
  let prev = performance.now();
  function lop() {
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){	    
		    prev = lt;
            sprite.nextFrame();			
			sprite.getPositionSpites(context);							 
			linePos++;
	} 
	if(linePos > sprite.frame_collection.length-1){
		if(callb)callb(option);
		return;
	}
	requestAnimationFrame(lop);
  }
  lop();		
}
*/