
/*
Модуль  - добавляет панель создания сегментных спрайтов 
В активном состоянии устанавливает свойство operationWith = "sprite-bones"
*/
(function(){

   if(onloadModules.spriteBones  != undefined)return;
	
  var html = `
  								 <div data-sprite_bones_panel="array"  class="form-group" name="sprite_bones_panel" style="margin: 0px; padding: 0px; ">
                                    <p name="form_show" class="clicker"  >Сегментные спрайты <span>+</span></p>
									<div class="form-row d-none">
									    <div class="form-group col-12">								
											<button type="button"  style="" name="reset" class="btn btn-success btn-sm" title="начать рисовать сегменты заново">reset</button>
																	
											<button type="button"  style="" name="edd_move_bone" class="btn btn-danger btn-sm" title="переключатель - добавлять сегменты, двигать сегменты мышью">add</button>
										            										
											<input style="width: 50px;" name="index_bone" type="text" class=""  placeholder="index" title="индекс контрольной точки сегмента, дистанция движения спрайта стрелками клавиатуры" value="0">										
																		
											<button type="button"  style="" name="remove_btn" class="btn btn-warning btn-sm" title="удалить точку по индексу">remove</button>
										</div>											
										<div class="form-group col-12">              										
											<input style="width: 50px;" name="size" type="text" class=""  placeholder="size" title="толщина контура" value="3">										
										              										
											<input style="width: 50px;" name="color" type="text" class=""  placeholder="color" title="цвет контура" value="red">										
								
											<button type="button"  style="" name="font_weight" class="btn btn-info btn-sm" title="применить толщину и цвет">apply</button>
																		
											<button type="button"  style="" name="copy_contur" class="btn btn-success btn-sm" title="нарисовать отпечаток сегменов на фоновом изображениии">draw_sg</button>
										</div>
									    <div class="form-group col-12">								
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="copy_sprites" class="btn btn-success btn-sm" title="нарисовать отпечаток спрайтов на фоновом изображениии">draw_spr</button>
										
												<input style="width: 50px;" name="rotate" type="text" class=""  placeholder="градус" title="Вращать сегменты градус">
										
												<input style="width: 50px;" name="segment_up" type="text" class=""  placeholder="index" title="Поднять сегмент на верхний слой">
										        <button type="button"  style="padding-left: 4px; padding-right: 4px;" name="segment_up_button" class="btn btn-success btn-sm" title="Поднять сегмент на верхний слой">segment up</button>
										
										</div>										
										
										<div class="form-group col-12">
												<input style="width: 80px;" name="sprite_id" type="text" class=""  placeholder="spriteId" title="sprite id">
												<input style="width: 40px;" name="index_segment" type="text" class=""  placeholder="index segment" title="segment index" value="1">
												<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="add_sprite" class="btn btn-info btn-sm" title="добавить сегменту спрайт">add sprite</button>
                                                <button type="button"  style="padding-left: 4px; padding-right: 4px;" name="remove_sprite" class="btn btn-danger btn-sm" title="удалить спрайт из сегмента">rm sprite</button>												
										</div>
										<div class="form-group col-12">
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="add_position" class="btn btn-info btn-sm" title="Добавить позицию спрайту">add pos</button>
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="prev_frame_bone" class="btn btn-info btn-sm" title="Отобразить предыдущий кадр"><<</button>
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="next_frame_bone" class="btn btn-info btn-sm" title="Отобразить следующий кадр">>></button>
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="change_position" class="btn btn-warning btn-sm" title="сменить позицию контрольных точек текущего кадра">change</button>
											<button type="button"  style="padding-left: 4px; padding-right: 4px;" name="remove_position" class="btn btn-danger btn-sm" title="удалить последний кадр">rm back</button>
										</div>
						<ul class="list-group" style="border:  1px solid black; margin-top: 10px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
							<div  class="sprites-settings">
							  <div class="form-row">
							     <div class="form-group col-12" >
								 <button type="button"   name="add_sprite_group" style="padding: 2px; margin-top: 2px; margin-left: 2px;" class="btn btn-success btn-sm" title="Добавить сегментый спрайт">Добавить спрайт</button>
									<button  name="form_show_group" type="button" style="margin-left: 2px; margin-right: 2px; padding: 0px; float: right; position: relative; top: 3px; padding-right: 2px; padding-left: 2px;"  class="btn btn-info btn-sm" title="Скрыть, отобразить список спрайтов">—</button>
								</div>	
							   </div>	
							</div>
							<div name="form_show_group_class" class="sprites" style="margin-top: 2px;">	
								<li data-sprites_group="template" class="list-group-item">
									<input style="width: 95px;" name="id" type="text"  placeholder="" title="Изменить id спрайта">
									<button type="button" name="rm_sprite_group" class="btn btn-danger btn-sm">remove</button>
									<button type="button" name="show_sprite_group" class="btn btn-secondary btn-sm" title="скрыть">hide</button>
									<button type="button" name="layer_up_group" class="btn btn-info btn-sm" title="Поднять спрайт на верхний слой">Слой up</button>
									<button type="button" name="save_sprite_group" class="btn  btn-success btn-sm" title="Сохранить спрайт на компьютере в локальном хранилище">Save</button>
								</li>
							</div>							
						</ul>





										
									</div>
									</p>
									
								 </div>
								 
  `;
  
  var div = document.createElement("div");
  div.innerHTML = html;
  div = div.querySelector("div");
  //console.log(div);
  var parent = document.querySelector("[data-main_form]");
  var insert_before = document.querySelector("[name='common_btns_class']")
  var insertedElement = parent.insertBefore(div, insert_before);
  
  
  var sprite_bones_panel = {
	  
	  selector: ".sprites",
	  arrayProps: [

        ["color_width", "click", "[name='font_weight']"],
		["start_module", "click", "[name='reset']"],
        ["edd_move_bone_btn", "click", "[name='edd_move_bone']"],
		["remove_btn", "click", "[name='remove_btn']"],	
		["copy_contur_btn", "click", "[name='copy_contur']"],	
        ["edd_move_text_btn", "text", "[name='edd_move_bone']"],		
		["index_bone", "inputvalue", "[name='index_bone']"],
         ["size", "inputvalue", "[name='size']"],
		 ["color", "inputvalue", "[name='color']"],
		["canvas_click", "emiter-mousedown-canvas", ""],
		["canvas_click_done", "emiter-mouseup-canvas", ""],
		["canvas_move", "emiter-mousemove-canvas", ""],
		//["mousewheel", "emiter-mousewheel-canvas", ""],
        ["form_show", "click", "[name='form_show']"],["form_style", "class", "div.d-none"],				
		["operation_with", "emiter-operation-with", ""],
		["keydown", "emiter-keydown", ""],
		//["sqvare_circle", 'checkbox', "[name='sqvare_circle']"],
		["rotate", 'inputvalue', "[name='rotate']"], ["rotate_btn", 'change', "[name='rotate']"],
		
		["sprite_id", 'inputvalue', "[name='sprite_id']"], ["index_segment", 'inputvalue', "[name='index_segment']"],
		["remove_sprite", 'click', "[name='remove_sprite']"], ["add_sprite", 'click', "[name='add_sprite']"],
		["copy_sprites", 'click', "[name='copy_sprites']"],
		
		["form_show_group", 'click', "[name='form_show_group']"], ["form_show_group_class", 'class', "[name='form_show_group_class']"],
		["add_sprite_group", 'click', "[name='add_sprite_group']"],
		
		
		["add_position", 'click', "[name='add_position']"], ["next_frame_bone", 'click', "[name='next_frame_bone']"],
		["prev_frame_bone", 'click', "[name='prev_frame_bone']"],
		["change_position", 'click', "[name='change_position']"], ["remove_position", 'click', "[name='remove_position']"],
		["change_position_text", 'text', "[name='change_position']"],
		["segment_up", 'inputvalue', "[name='segment_up']"], ["segment_up_button", 'click', "[name='segment_up_button']"], 
		
		
	  ],
	  arrayMethods: {
			segment_up_button: function(){
				
				var index = parseInt(this.parent.props.segment_up.getProp());
				var sprite = this.parent.props.start_module.prop;
				if(!sprite.points[index] || index === 0){
					alert("неверно указан индекс");
					return;
				}

				for(var i=0; i< sprite.order.length; i++){
					if(sprite.order[i] == index)sprite.order.splice(i, 1);
					
				}
				
				sprite.order.push(index);
				
				
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();				
				
			},
			 remove_position: function(){
			  	 var sprite = this.parent.props.start_module.prop;
				 if(!sprite.id || sprite.frame_collection.length < 2)return;
			     sprite.frame_collection.pop();
				 var index = sprite.frame_collection.length-1; 
				 sprite.nextFrame(index);
					 //////////////////////////////////////////////////////
				 ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }			
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();			 
				 
			 },
		     change_position: function(){
				 var sprite = this.parent.props.start_module.prop;
				 if(!sprite.id)return;
				 var newArray = sprite.points.map(function(arr) {
                                              return arr.slice(0);
                  });
				  sprite.frame_collection[sprite.frame_index] = newArray;
				 
			 },
			 prev_frame_bone: function(){
				 var sprite = this.parent.props.start_module.prop;
				 if(!sprite.id)return;
				 sprite.prevFrame();
				this.parent.props.change_position_text.setProp("change "+sprite.frame_index);
				 //////////////////////////////////////////////////////
				 ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();
				 
			 },
		     next_frame_bone: function(){
				 
				 var sprite = this.parent.props.start_module.prop;
				 if(!sprite.id)return;
				 sprite.nextFrame();
				 this.parent.props.change_position_text.setProp("change "+sprite.frame_index);
				 //////////////////////////////////////////////////////
				 ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();
				 
			 },
		     add_position: function(){
				 var sprite = this.parent.props.start_module.prop;
				 if(!sprite.id){ alert("сперва необходимо добавить спрайт");return;}				 
				 var newArray = sprite.points.map(function(arr) {
                                              return arr.slice(0);
                  });
				  sprite.frame_collection.push(newArray);				 
				 sprite.frame_index +=1;
				 //console.log(sprite.frame_collection);
				 ////[x, y, parent segment, fi, sprite_id, frame ]
			 },
			add_sprite: function(){ //добавить спрайт к контрольной точке
			  var id = this.parent.props.sprite_id.getProp();
			  if(!this.$props().sprites[id])return;
			  var index_segment = parseInt(this.parent.props.index_segment.getProp()); 
			  if(index_segment <1 )index_segment = 1;		
			  var sprite = this.parent.props.start_module.prop;
			  sprite.points[index_segment][4] = id;
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();
			  
			},
			remove_sprite: function(){//удалить спрайт из сегмента
			  var id = this.parent.props.sprite_id.getProp();
			  if(!this.$props().sprites[id])return;
			  var index_segment = parseInt(this.parent.props.index_segment.getProp());
			  var sprite = this.parent.props.start_module.prop;
              if(index_segment <1 || index_segment > sprite.points.length-1 )return;
			 // var sprite = this.parent.props.start_module.prop;
			  sprite.points[index_segment][4] = false;	
               //this.$methods().renderAll(false, {drawAreaPoints: false});
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();				
			},
		    color_width: function(){	//изменить толщину цвет контура			
				var color = this.parent.props.color.getProp(); 
				var width = this.parent.props.size.getProp();
				var sprite = this.parent.props.start_module.prop;
				sprite.colorLine = color;
				sprite.weightLine = width;
				
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active"); 
				this.rootLink.stateMethods.drawGrid();
			},
			form_show_group: function(){ //отобразит, скрыть список спрайтов
				var props = this.parent.props;
				if(this.prop == null){				
					this.prop = true;
					this.props("form_show_group_class").removeProp("d-none");				
				}else{
					this.prop = null;
					this.props("form_show_group_class").setProp("d-none");
					
					//this.$$("emiter-operation-with").set("common");
				}				
			},
		  	form_show: function(){ //отобразить скрыть форму          		
				if(this.prop == null){				
					this.prop = true;
					this.props("form_style").removeProp("d-none");
					this.htmlLink.querySelector("span").innerText="-";
					this.$$("emiter-operation-with").set("sprite-bones");
                    if(this.parent.props.start_module.prop == null){
						this.parent.props.start_module.prop = new BoneSprite;
						ctx.putImageData(saveImg, 0, 0);
						this.$methods().renderAll(false, {drawAreaPoints: false});		   
					}
                     this.parent.props.start_module.prop.render(this);					
				}else{
					this.prop = null;
					this.props("form_style").setProp("d-none");
					this.htmlLink.querySelector("span").innerText="+";
					//this.$$("emiter-operation-with").set("common");
				}				
			},
			add_sprite_group: function(){ //создать сегментный спрайт
			    var sprite = this.parent.props.start_module.prop;
								 
				/* var newArray = sprite.points.map(function(arr) {
                                              return arr.slice(0);
                  });
				sprite.frame_collection.push(newArray);*/
				var id; 
                if(sprite.id){id = sprite.id;}else{
					id = "group_"+Math.floor(Math.random()*10000);
					sprite.id = id;
				}
				if(this.$props()["sprites_group"] != undefined && this.$props().sprites_group[id]){					
					alert("спрайт с таким именем уже загружен, для создания нового нажать reset");
					return;
				}				
			    for(var i=0; i < this.parent.data.length; i++){					
					this.parent.data[i].props.class.removeProp("active");					
				}				
				var container = this.parent.add({id: id, class: "active"}, 0);	
                container.props.id.prop = id;
				if(this.$props()["sprites_group"] == undefined)this.$props()["sprites_group"] = {}; //добавляем массив спрайтов в общие перременные 
				this.$props("sprites_group")[id] = sprite;
				//console.log(this.$props()["sprites_group"]);
			},
		  start_module: function(){ //rest btn
                  this.prop = new BoneSprite;
				  ctx.putImageData(saveImg, 0, 0);
                  //this.$methods().renderAll(false, {drawAreaPoints: false});
                  this.parent.props.index_bone.setProp(0);				  
                  //this.parent.props.edd_move_bone_btn.prop = "move";			  
				  //this.$$("emiter-operation-with").set("sprite-bones");			 		  		  
		  }	,
		  operation_with: function(){ //отключает слушателей canvas событий ( mousedown) если модуль находится в пассивном состоянии	  
			  if(this.emiter.prop != "sprite-bones"){
                    var window_ = this.parent.props.form_show;
                    window_.prop = null;
					window_.props("form_style").setProp("d-none");
					window_.htmlLink.querySelector("span").innerText="+";				  
				  this.parent.props.canvas_click.disableEvent();	
                  this.parent.props.canvas_click_done.disableEvent();
                  this.parent.props.canvas_move.disableEvent();
                  this.parent.props.keydown.disableEvent();				  
			  }else{				  			
				  this.parent.props.canvas_click.enableEvent();	
				  this.parent.props.canvas_click_done.enableEvent();				  
				  this.parent.props.canvas_move.enableEvent();
                  this.parent.props.keydown.enableEvent();				  
		      }			  
		  },
          keydown: function(){ //движение спрайта стрелками клавиатуры 
		      var isDraw = false;
			  var distance = parseInt(this.parent.props.index_bone.getProp());
			  if(distance < 1)distance = 3;
			  var k = this.$$("emiter-keydown").prop;
			  var sprite = this.parent.props.start_module.prop;
			  if(sprite == null)return;
			 // console.log(this.$$("emiter-keydown").prop);
			 if(k == "ArrowUp"){					
				sprite.move(0, distance*-1);
				isDraw = true;
			 }else if(k == "ArrowDown"){
				sprite.move(0, distance);
				isDraw = true;
			 }else if(k == "ArrowRight"){			 
				 sprite.move(distance, 0);
				 isDraw = true;
			 }else if(k == "ArrowLeft"){
				sprite.move( distance*-1, 0);
                isDraw = true;				
			 }else{
				 return;
			 }
			  if(isDraw){
              //console.log(sprite);			 
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();
			  }				
		  },
          rotate_btn: function(){			  
			  var gradus = parseInt(this.parent.props.rotate.getProp())* Math.PI / 180;;
			  var sprite = this.parent.props.start_module.prop;
			  
			  sprite.points =  rotationArea(sprite.points, gradus);
			  sprite.setFi();
			    /*for(var i=1; i<sprite.points.length; i++){				  
					var point2 = sprite.points[i];
					var point1 = sprite.points[ sprite.points[i][2] ];
					sprite.points[i][3] = getFi(point1, point2);				
			     }	*/		  
			 // this.$methods().renderAll(false, {drawAreaPoints: false});
			 // ctx.putImageData(saveImg, 0, 0);
			  //sprite.render(this);
			  //console.log(gradus);
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active"); 
				this.rootLink.stateMethods.drawGrid();
		  },		  
		  edd_move_bone_btn: function(){ //переключает режим добавления перетаскивания контрольных точек
			  if(this.prop === null || this.prop === "add" ){			  
				  this.prop =  "move";
				  this.parent.props.edd_move_text_btn.setProp("move");
			  }else{
				  this.prop = "add";
				  this.parent.props.edd_move_text_btn.setProp("add");  
			  }			  
		  },
          remove_btn: function(){//удаляет контрольную точку по индексу
			  var index = parseInt(this.parent.props.index_bone.getProp());
			  var sprite = this.parent.props.start_module.prop;
			  
			  if(sprite.points.length - 1 < index || index < 0){
				 this.parent.props.index_bone.setProp(sprite.points.length - 1);
				 return 
			  }		  
			  if(sprite.points.length - 1 == index ){
				  sprite.points.splice(index, 1);			  
			  }else{
                  sprite.points.splice(index,1);
				  sprite.points[index][2] -=1;
                 for(var i = index+1; i< sprite.points.length; i++){
                      if(sprite.points[i][2] > index)sprite.points[i][2] -=1;
                      if(sprite.points[i][2] < 0)sprite.points[i][2];					  
				 }
                 //console.log(sprite.points);			 
			  }
			    for(var i=0; i< sprite.order.length; i++){
					if(sprite.order[i] == index)sprite.order.splice(i, 1);
				}
              	this.parent.props.index_bone.setProp(index -1);
               // this.$methods().renderAll(false, {drawAreaPoints: false});
			    //sprite.render(this);
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
                this.rootLink.stateMethods.drawGrid();				
		  },
          copy_contur_btn: function(){//копирует контур спрайта на фоновую картинку
			  saveStep(saveImg, this.$props().commonProps.area_1);
			  this.parent.props.start_module.prop.copyContur();
		  },
          copy_sprites: function(){
			  saveStep(saveImg, this.$props().commonProps.area_1);
			  ctx.putImageData(saveImg, 0, 0);
			  var sprite_segment = this.parent.props.start_module.prop;
			  var sprites = this.$props().sprites;		
			  for (var key in sprites){				
				for(var i=1; i< sprite_segment.points.length; i++){
					if(sprite_segment.points[i][4] == key){
						sprites[key].render("common");
					}
				}
			 }
			  saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);		  
		  },		  
		  canvas_click: function(){
			var canvas_point = this.$$("emiter-mousedown-canvas").prop;
			var sprite = this.parent.props.start_module.prop; 
			if(this.parent.props.edd_move_bone_btn.prop == "move" ){
				
				sprite.isMovePoint =  isClickOnPoint(sprite.points ,canvas_point);
								
			}else{
				var index = parseInt(this.parent.props.index_bone.getProp()); //индекс родительской точки
				if(index > sprite.points.length -1 && index > 0 )index = sprite.points.length - 1;
			   this.parent.props.index_bone.setProp(sprite.points.length);
               var	x= canvas_point[0];	var y= 	canvas_point[1];   
			    sprite.points.push([x, y, index /**sprite.points.length - 1*/, 0, false, 0]);
                var point1 = sprite.points[index];				
				var point2 = [x, y];
				sprite.points[sprite.points.length-1][3] = getFi(point1, point2);
				
				sprite.order.push(sprite.points.length-1);
				//console.log(sprite.order);           			  
			    
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
                this.rootLink.stateMethods.drawGrid();				
				
            }
			  
		  }	,
		  canvas_move: function(){
			  var sprite = this.parent.props.start_module.prop; 
			  var canvas_point = this.$$("emiter-mousemove-canvas").prop;
			  //console.log(sprite);
			  if(sprite.isMovePoint !== false){
				sprite.points[sprite.isMovePoint][0] =  canvas_point[0]; 
				sprite.points[sprite.isMovePoint][1] =  canvas_point[1];
				//var point2 = sprite.points[sprite.isMovePoint];
                //var point1 = sprite.points[sprite.points[sprite.isMovePoint][2]];
			    //sprite.points[sprite.isMovePoint][3] = getFi(point1, point2);
				sprite.setFi();				
                //this.$methods().renderAll(false, {drawAreaPoints: false});
				//sprite.render(this);

				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
                this.rootLink.stateMethods.drawGrid(); 				
			  }

		  },
		  canvas_click_done: function(){
			  var sprite = this.parent.props.start_module.prop;
			  //if(this.parent.props.edd_move_bone_btn.prop == "move" && sprite.isMovePoint !==false  ){
				// console.log(sprite.points[sprite.isMovePoint]);
				//var point2 = sprite.points[sprite.isMovePoint];
               // var point1 = sprite.points[sprite.points[sprite.isMovePoint][2]];
			    //sprite.points[sprite.isMovePoint][3] = getFi(point1, point2);
               // console.log(sprite.points);				
			 // }
              //sprite.setScaleSprite(this);			 
			  sprite.isMovePoint = false;		  
			  //this.$methods().renderAll(false, {drawAreaPoints: false});
			  //sprite.render(this, "active");
			  //this.rootLink.stateMethods.drawGrid();
		  
		  }	  
	  },
	container: "sprites_group",
	props: [ ["id", "inputvalue", "[name='id']"], ["click", "click", ""],["class", "class", ""], ["rm_sprite_group", "click", "[name='rm_sprite_group']"],
	         ["change_id", "change", "[name='id']"], ["show_sprite_group_click", "click", "[name='show_sprite_group']"], 
			 ["layer_up_group", "click", "[name='layer_up_group']"],
			 ["save_sprite_group", "click", "[name='save_sprite_group']"], ["show_sprite_group", "text", "[name='show_sprite_group']"],
			 ], 
    methods: {
			click: function(){
				var id = this.props("id").getProp();
				for(var i=0; i < this.component().data.length; i++){					
					this.component().data[i].props.class.removeProp("active");
                    this.component().data[i].props.class.prop = null;					
				}
				lineColor = colorSpriteArea;
                this.props("class").setProp("active");
				this.props("class").prop = "active";
				this.component().props.start_module.prop = this.$props("sprites_group")[id];
				//this.$methods().renderAll(false, {drawAreaPoints: false});
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.component().data.length-1; i>=0 ; i--){
					 var id = this.component().data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.component().data[i].props["class"].prop);
			    }
				this.rootLink.stateMethods.drawGrid();
				//sprite.render(this, "active"); 				
			    //this.$props("sprites_group")[id].render(this, "active");
				
			},
			rm_sprite_group: function(){
				var id = this.props("id").getProp();
				delete this.$props().sprites_group[id];
				//this.$methods().renderAll(false, {drawAreaPoints: false});
				this.parent.remove();
				
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.component().data.length-1; i>=0 ; i--){
					 var id = this.component().data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.component().data[i].props["class"].prop);
			    }
				this.rootLink.stateMethods.drawGrid();
			},
			change_id: function(){
				var id = this.props("id").getProp();
				if(this.$props().sprites_group[id] != undefined){					
					id = id + "_duble";
					this.props("id").setProp(id);
				}				
				var old_id = this.parent.props.id.prop;
				var sprites_group = this.$props().sprites_group[old_id];
				sprites_group.id = id;
				delete this.$props().sprites_group[old_id];
				this.$props().sprites_group[id] = sprites_group;	
				this.parent.remove();					
				var container = this.component().add({id: id, class: "active"}, 0);
				container.props.id.prop = id;
				this.component().props.start_module.prop = this.$props("sprites_group")[id];
				//this.$methods().renderAll(false, {drawAreaPoints: false});
			    //this.$props("sprites_group")[id].render(this);
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.component().data.length-1; i>=0 ; i--){
					 var id = this.component().data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.component().data[i].props["class"].prop);
			    }
                this.rootLink.stateMethods.drawGrid();				
                 //console.log(this.$props("sprites_group")[id]);				
			},
			show_sprite_group_click: function(){
				var text = this.props("show_sprite_group");
				var id = this.props("id").getProp();
				var sprites_group = this.$props().sprites_group[id];			
				if(sprites_group.show){
					sprites_group.show = false;
					text.setProp("Отобразить");
				}else{
					sprites_group.show = true;
					text.setProp("Скрыть");
					ctx.putImageData(saveImg, 0, 0);
				    for(var i = this.component().data.length-1; i>=0 ; i--){
					   var id = this.component().data[i].props["id"].getProp();
					   this.$props("sprites_group")[id].render(this.$props("sprites"), this.component().data[i].props["class"].prop);
			        }
                    this.rootLink.stateMethods.drawGrid();					
					
				}	
				
			},
			layer_up_group: function(){
				var id = this.props("id").getProp();
				var index = this.parent.index;
				var sprites_group = this.$props().sprites_group[id];
				delete this.$props().sprites_group[id];
				this.$props().sprites_group[id] = sprites_group;
				
				var newOrderArr = [];
				var length = this.component().data.length;
				for(var i=0; i<length; i++){
					newOrderArr.push(i);
				}
				var newIndex = newOrderArr.splice(index, 1);
				newOrderArr.unshift(newIndex);				
				this.component().order(newOrderArr);
			},
			save_sprite_group: function(){
				var id = this.props("id").getProp();
				var sprites_group = this.$props().sprites_group[id];
				sprites_group.id = id;
				sprites_group.saveOnPC();			
			}
	},		
  }

  HM.description.sprite_bones_panel  = sprite_bones_panel;
  HM.arrayInit(div , HM.description, "sprite_bones_panel"); ///создаем массив
  HM.eventProps["emiter-operation-with"].emit(); //вызываем чтобы отключить слушателей canvas событий при старте модуля
  onloadModules.spriteBones  = true;
  
  
  
  function getFi(point1, point2){	  
	            var an =  Math.atan2(point2[1]-point1[1], point2[0]-point1[0]); ////////////определение угла поворота точки
				return an*180/Math.PI -90 ;
  }
  
  
  
  
	
})()