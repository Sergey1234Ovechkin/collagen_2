/*
Модуль  - добавляет панель рисования окружностей 
В активном состоянии устанавливает свойство operationWith = "draw-circle"
*/


(function(){

   if(onloadModules.addDrawcCirclePanel  != undefined)return;
	
  var html = `
  								 <div data-draw_circle_panel="container"  class="form-group" name="draw_circle_panel" style="margin: 0px; padding: 0px; ">
                                    <p name="form_show" class="clicker">Рисовать <span>+</span></p>
									<!--<label for="exampleFormControlInput1" style="font-size: 15px;">Рисовать окружность</label>-->
									<div class="form-row d-none">
									    <!-- <div class="form-group col-md-4">								
											<button type="button"  style="" name="draw_circle_btn" class="btn btn-success btn-sm" title="Для рисования нужно кликать по канвас после нажатия кнопки">Рисовать</button>
										</div> -->
										<div class="form-group col-md-4">
										
											<input name="draw_sircle_radius" type="text" class="form-control form-control-sm" title="радиус кисти (колесико мыши)" placeholder="радиус" title="" value="10">
										</div>
										<div class="form-group col-md-4">
										
											<input name="draw_sircle_color" style="width: 180px;" type="text" class="form-control form-control-sm"  placeholder="цвет" title="" value="#3399FF80" data-jscolor="{ format: 'rgba',required: false, palette: '#C00 #0C0 #00C', } ">
										</div>					
										<div class="form-check" style="display: inline-block;">
											<input type="checkbox" name="sqvare_circle"  class="form-check-input" >
											<label class="form-check-label" for="exampleCheck1">квадратная кисть</label>
										</div>	
										<div class="form-check" style="display: inline-block; margin-left: 5px;">
											<input type="checkbox" name="lastic"  class="form-check-input" >
											<label class="form-check-label" for="exampleCheck1">ластик</label>
										</div>
										<div class="form-check" style="display: inline-block; margin-left: 5px;">
											<input type="checkbox" title="узнать цвет пикселей на холсте" name="pipette"  class="form-check-input" >
											<label class="form-check-label"  for="exampleCheck1">пипетка</label>
										</div>										
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
  
  
  var draw_circle_panel = {
	  
	  container: "draw_circle_panel",
	  props: [

		//["draw_circle_btn", "click", "[name='draw_circle_btn']"], 
		["draw_sircle_radius", "inputvalue", "[name='draw_sircle_radius']"],
		["draw_sircle_color", "inputvalue", "[name='draw_sircle_color']"], 
		["canvas_click", "emiter-mousedown-canvas", ""],
		["canvas_click_done", "emiter-mouseup-canvas", ""],
		["canvas_move", "emiter-mousemove-canvas", ""],
		["mousewheel", "emiter-mousewheel-canvas", ""],
        ["form_show", "click", "[name='form_show']"],["form_style", "class", "div.d-none"],		
		
		["operation_with", "emiter-operation-with", ""],
		["sqvare_circle", 'checkbox', "[name='sqvare_circle']"],
		["lastic", 'checkbox', "[name='lastic']"],	["pipette", 'checkbox', "[name='pipette']"],	
	  ],
	  methods: {
		    mousewheel: function(){


				if(this.$$("emiter-operation-with").prop == "draw-circle" ){
					
					var radius = parseInt(this.parent.props.draw_sircle_radius.getProp());
						radius+= parseInt(this.$$("emiter-mousewheel-canvas").prop)/100;
						if(radius<1)radius=1;
						this.parent.props.draw_sircle_radius.setProp(radius);
					     
				}
				
			},
		  	form_show: function(){ //отобразить скрыть форму

                //if(this.parent.props.draw_circle_btn.prop === null)jscolor.install();			
				if(this.prop == null){				
					this.prop = true;
					jscolor.install();
					this.props("form_style").removeProp("d-none");
					this.htmlLink.querySelector("span").innerText="-";
					this.$$("emiter-operation-with").set("draw-circle");
				}else{
					this.prop = null;
					this.props("form_style").setProp("d-none");
					this.htmlLink.querySelector("span").innerText="+";
				}				
			},
		  operation_with: function(){ //отключает слушателей canvas событий ( mousedown) если модуль находится в пассивном состоянии
			  //console.log(this.emiter.prop);		  
			  if(this.emiter.prop != "draw-circle"){			  
				 
				  this.parent.props.canvas_click.disableEvent();
				  if(this.parent.props.form_show.prop == true){
					  this.props("form_style").setProp("d-none");
				      this.htmlLink.querySelector("span").innerText="+";
					  this.parent.props.form_show.prop = null;
				  }					  
			  }else{				  
				
				  this.parent.props.canvas_click.enableEvent();			  
			  }			  
		  },
		 /* draw_circle_btn: function(){
                  this.prop = true;
                 
				  this.$$("emiter-operation-with").set("draw-circle");
			 		  		  
		  }	,*/
		 canvas_move: function(){
			// return;
			if(this.$$("emiter-operation-with").prop == "draw-circle" ){
			  // && this.parent.props.canvas_click.prop === true
			  
			  var props = this.parent.props;
			   var lastic = props.lastic.getProp();
			   
			  var sqvare_circle = props.sqvare_circle.getProp();
			  var radius = props.draw_sircle_radius.getProp();
			  var color = props.draw_sircle_color.getProp();
			  var point = this.emiter.prop;
			  
              var pipette = props.pipette.getProp();			  
			  if(pipette){
				 // var color = console.log( (point[1]*srcWidth+point[0])*4 ); 
				  return;
			  }
			 // saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.save();
	            ctx.putImageData(saveImg, 0, 0);
				ctx.beginPath();
				if(sqvare_circle){
				   ctx.fillStyle =  color;
				   ctx.fillRect(point[0]-radius, point[1]-radius, radius*2, radius*2);
                  if(lastic)ctx.clearRect(point[0]-radius, point[1]-radius, radius*2, radius*2);					   
				  if(this.parent.props.canvas_click.prop === true) {
					  saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
					  
				  }	
                   if(this.$props().commonProps.sprite_grid)drawSpriteGrid(this.$props().commonProps.sprite_grid[0], this.$props().commonProps.sprite_grid[1]);				  
				   ctx.restore();
                  				   
				}else{
			    ctx.arc(point[0], point[1], radius, 0, 2*Math.PI, false);
				if(lastic){
					ctx.clip();
					ctx.clearRect(0, 0, srcWidth , srcHeight);
				}else{
				  ctx.fillStyle =  color;			
				  ctx.fill();
				 // ctx.lineWidth = 1;
				 // ctx.strokeStyle =  color;
				  //ctx.stroke();						
				}
			
				if(this.parent.props.canvas_click.prop === true){
					saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
					
				}
				if(this.$props().commonProps.sprite_grid)drawSpriteGrid(this.$props().commonProps.sprite_grid[0], this.$props().commonProps.sprite_grid[1]);
				ctx.restore();
                				
				}
			
			}
		},
		canvas_click_done: function(){
			
			this.parent.props.canvas_click.prop = null;
			
		},
		 canvas_click: function(){		 
			if(this.$$("emiter-operation-with").prop == "draw-circle"){
				saveStep(saveImg, this.$props().commonProps.area_1);
				var point = this.emiter.prop;
				
                				
		///////////////////////////////////////////////////////////
               /* var point_ = point.slice(0);		
				var point2 = (point_[1]*srcWidth+point_[0])*4; 
				var color = [255,0,0,255];
				var imgMap = ctx.getImageData(0,0, srcWidth, srcHeight);
				var color2 = [imgMap.data[ point2], imgMap.data[ point2+1], imgMap.data[ point2+2], imgMap.data[ point2+3]];
				var fill = true;
				//qconsole.log(color2);
				if(fill){
					    var t = color2[0]+color2[1]+color2[2]+color2[3];
                        var b = t;						
						while( t == b){
							imgMap.data[ point2]=color[0]; imgMap.data[ point2+1]=color[1]; imgMap.data[ point2+2]=color[2]; imgMap.data[ point2+3]=color[3];
							point_[1]-=1;
							point2 = (point_[1]*srcWidth+point_[0])*4;
							b = imgMap.data[ point2]+ imgMap.data[ point2+1]+ imgMap.data[ point2+2]+ imgMap.data[ point2+3];
							console.log(b);
						}								
					          //(tmpY*W+tmpX)*4;
					        						
				  // imgMap.data[ point], imgMap.data[ point+1], imgMap.data[ point+2], imgMap.data[ point+3],
					ctx.putImageData(imgMap, srcWidth, srcHeight);
					return
				}
				*/
			  this.prop = true;
			  var props = this.parent.props;
			  var lastic = props.lastic.getProp();
			  var sqvare_circle = props.sqvare_circle.getProp();
			  var radius = props.draw_sircle_radius.getProp();
			  var color = props.draw_sircle_color.getProp();
			  //////////////////
			 var pipette = props.pipette.getProp();			  
			  if(pipette){
				  ImageData = ctx.getImageData(0,0, srcWidth, srcHeight);
				  var canvas_point = (point[1]*srcWidth+point[0])*4; 
				  props.draw_sircle_color.setProp( "rgba("+ImageData.data[canvas_point]+","+ImageData.data[canvas_point+1]+","+ImageData.data[canvas_point+2]+","+ImageData.data[canvas_point+3]/255+")" );
				  return;
			  }
			  /////////////////
			  saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.save();
	            ctx.putImageData(saveImg, 0, 0);
				ctx.beginPath();
				if(sqvare_circle){
				   ctx.fillStyle =  color;
				   ctx.fillRect(point[0]-radius, point[1]-radius, radius*2, radius*2);
                   if(lastic)ctx.clearRect(point[0]-radius, point[1]-radius, radius*2, radius*2);				   
				  // saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
				   if(this.$props().commonProps.sprite_grid){
					   drawSpriteGrid(this.$props().commonProps.sprite_grid[0], this.$props().commonProps.sprite_grid[1]);
					   console.log(1);
				   }
				   ctx.restore();
							   
				}else{
			    ctx.arc(point[0], point[1], radius, 0, 2*Math.PI, false);
								if(lastic){
					ctx.clip();
					ctx.clearRect(0, 0, srcWidth , srcHeight);
				}else{
				  ctx.fillStyle =  color;			
				  ctx.fill();
				 // ctx.lineWidth = 1;
				  //ctx.strokeStyle =  color;
				 // ctx.stroke();						
				}				
				//saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
				if(this.$props().commonProps.sprite_grid)drawSpriteGrid(this.$props().commonProps.sprite_grid[0], this.$props().commonProps.sprite_grid[1]);
				ctx.restore();
                			
					
				}
			
			}
		}	  
	  }	  
  }

  HM.description.draw_circle_panel  = draw_circle_panel;
  HM.containerInit(div , HM.description, "draw_circle_panel");
  HM.eventProps["emiter-operation-with"].emit(); //вызываем чтобы отключить слушателей canvas событий при старте модуля
  onloadModules.addDrawcCirclePanel  = true;


	
})()