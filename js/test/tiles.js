



function Tile(id, sprite, point){
	
    this.type = "tile";		
	this.id = id;
	this.parent = sprite.id;
	this.frame = sprite.frame;
	this.frame_collection = sprite.frame_collection;///варианты изображения спрайта
	this.frame_index = sprite.frame_index;
	this.point = point.slice(0); //верхяя левая точка спрайта на канвас
	this.point2 = sprite.point2.slice(0);


	this.rotate = sprite.rotate; //вращение относительно начального при создании спрайта
	this.show = true;

	this.scale_x = sprite.scale_x; //масштаб относительно изначального при создании спрайта
	this.scale_y = sprite.scale_x;
	this.width = sprite.width;
	this.height = sprite.height;
}

///более быстрый рендер спрайта, не рисует контур, границу и текст
Tile.prototype.render_ = function(){
	if(!this.show)return;		
	if(this.rotate !== 0){ //вращение спрайта
		var halfW = this.width/2;
		var halfH = this.height/2;		
	    //var area = rotationArea(this.area_1, this.rotate);		
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

 function renderAllTiles(){
	 	      for(var i = 0; i< tiles_bg.length;  i++){
				tiles_bg[i].render_();
			  }
			  for(var i = 0; i< tiles_common.length;  i++){
				tiles_common[i].render_();
			  }	 
 }


//цикл для анимации спрайтов 
function animationLopLayer(spritesArrBg, spritesArr, speed, sprites){                
  //spritesArrBg.sort(compare);
  
  
  var off = {isOff: false};
  let prev = performance.now();
  function lop() {
	  spritesArr.sort(compare);
	              ctx.save();///////////////
            ctx.translate(ctxTranslate[0], ctxTranslate[1]);
    var lt = performance.now();
    var time = lt - prev;	
    if (time > speed ){		    
		    prev = lt;			
	        // ctx.putImageData(saveImg, 0, 0);
			  //ctx.clearRect(0, 0, srcWidth , srcHeight);
			  for(var i = 0; i< spritesArrBg.length;  i++){
				spritesArrBg[i].render_();
			  }
			  for(var i = 0; i< spritesArr.length;  i++){
				spritesArr[i].render_();
			  }
	} 
	ctx.restore();
	if(!off.isOff)requestAnimationFrame(lop);
  }
  lop();
 return  off;
 
	function compare(a, b) {
		if (a.point[1]+a.height > b.point[1]+b.height ) return 1; // если первое значение больше второго
		if (a.point[1]+a.height  == b.point[1]+b.height ) return 0; // если равны
		if (a.point[1]+a.height  < b.point[1]+b.height ) return -1; // если первое значение меньше второго
	}
}

//включает следующюю картинку из колекции 
Tile.prototype.nextFrame = function(index){
	this.frame_index +=1;
	if(index || index ===  0)this.frame_index = index;
	if(this.frame_index > this.frame_collection.length -1 ){
		this.frame_index = 0;
	}
	this.frame = this.frame_collection[this.frame_index];	
}
Tile.prototype.prevFrame = function(index){	
	this.frame_index -=1;
	if(index || index ===  0)this.frame_index = index;
	if(this.frame_index < 0  ){
		this.frame_index = this.frame_collection.length -1;
	}
	this.frame = this.frame_collection[this.frame_index];	
}

///сдвигает спрайт 
Tile.prototype.move = function(x, y){					
						this.point[0]+=x;
						this.point[1]+=y;
}
Tile.prototype.moveConer = function(x, y, bottom){	//перемещает спрайт в указанные координаты	                      						
                        this.point[0] = x;
						if(bottom){this.y = y-this.height; return;}
						this.point[1] = y;						
}


Tile.prototype.moveCenter= function(x,y){
		                this.point[0] = x-this.width/2;
						 this.point[1] = y-this.height/2;
}

Tile.prototype.rotateFi = function(fi){
	this.rotate =  parseInt(fi)* Math.PI / 180;
}
//масштабирование 
Tile.prototype.scale = function(coeff_x, coeff_y){
	if(coeff_x == this.scale_x && coeff_y == this.scale_y)return;
	
	var current_scale_x = coeff_x/this.scale_x; var current_scale_y = coeff_y/this.scale_y;
	var area = scaleArea([[this.point[0], this.point[1]], [this.point[0]+this.width, this.point[1]], 
	    [this.point[0]+this.width, this.point[1]+this.height], [this.point[0], this.point[1]+this.height]], current_scale_x, current_scale_y, false);
    
	var imgBox = getBox(area);
	this.point = imgBox[0];
	this.point2 = imgBox[1];
	////////////
	this.width = this.point2[0] - this.point[0];
	this.height = this.point2[1] - this.point[1];
	/////////////
	this.scale_x = coeff_x;
	this.scale_y = coeff_y;	
}

////обновляет порядок в массиве tiles_common согласно массиву tiles_common_save
function updateCommonTiles(sprites){
	tiles_common = [];
	for(var i=0; i<tiles_common_save.length; i++){
		if(sprites[tiles_common_save[i].parent])tiles_common.push(new Tile(tiles_common_save[i].id, sprites[tiles_common_save[i].parent], tiles_common_save[i].point));
	}
}
function updateBgTiles(sprites){ 
	tiles_bg = [];
	for(var i=0; i<tiles_bg_save.length; i++){
		if(sprites[tiles_bg_save[i].parent])tiles_bg.push(new Tile(tiles_bg_save[i].id, sprites[tiles_bg_save[i].parent], tiles_bg_save[i].point));
	}
}
