//modules.personage = tiles_common[4];
modules.personage = null;

for(var i=0; i<tiles_common.length; i++){	
	if(tiles_common[i].id == "personage"){
		modules.personage = tiles_common[i];
	}
}

var click  = 0;
var interval  = 100;
var timerId  = 0;
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
modules.keyup = function(key){
      //  console.log(key);
		clearInterval(timerId);
		click = false;
}
modules.animation=animationLopLayer(tiles_bg,tiles_common, 40);
function move(arg1,arg2,arg3, arg4, arg5) {
	     if(modules.personage.frame_index > arg1 &&  modules.personage.frame_index < arg2){ 
            modules.personage.nextFrame();}else{
            modules.personage.nextFrame(arg3);
		}
		modules.personage.move(arg4, arg5);		
}

