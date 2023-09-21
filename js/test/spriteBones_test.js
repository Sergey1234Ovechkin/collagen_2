
<!--- сегментные спрайты ---->							
<div data-sprite_bones_panel="array"  class="form-group" name="sprite_bones_panel" style="margin: 0px; padding: 0px; margin-top: 3px;">
                <p name="form_show" class="clicker"  >Сегментные спрайты <span>+</span></p>
					<div class="form-row d-none">
						<ul class="list-group" style="border:  1px solid black; margin-top: 4px; margin-bottom: 10px; max-height: 300px; overflow: auto;">
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


sprite_bones_panel: {
	  
	  selector: ".sprites",
	  arrayProps: [
		["start_module", "class", ""],
		["add_sprite_group", 'click', "[name='add_sprite_group']"],
		["canvas_click", "emiter-mousedown-canvas", ""],
		["canvas_click_done", "emiter-mouseup-canvas", ""],
		["canvas_move", "emiter-mousemove-canvas", ""],
        ["form_show", "click", "[name='form_show']"],["form_style", "class", "div.d-none"],				
		["operation_with", "emiter-operation-with", ""],
		["keydown", "emiter-keydown", ""],
		["form_show_group", 'click', "[name='form_show_group']"], ["form_show_group_class", 'class', "[name='form_show_group_class']"],
	  ],
	  arrayMethods: {
			add_sprite_group: function(){ //создать сегментный спрайт
			    var sprite = this.parent.props.start_module.prop;
				var id; 
                if(sprite.id){id = sprite.id;}else{
					id = "group_"+Math.floor(Math.random()*10000);
					sprite.id = id;
				}
				if(this.$props()["sprites_group"] != undefined && this.$props().sprites_group[id]){					
					alert("спрайт с таким именем уже загружен");
					return;
				}				
			    for(var i=0; i < this.parent.data.length; i++){					
					this.parent.data[i].props.class.removeProp("active");					
				}				
				var container = this.parent.add({id: id, class: "active"}, 0);	
                container.props.id.prop = id;
				if(this.$props()["sprites_group"] == undefined)this.$props()["sprites_group"] = {}; //добавляем массив спрайтов в общие перременные 
				this.$props("sprites_group")[id] = sprite;
			},
		    start_module: function(){ //rest btn
                  this.prop = new BoneSprite;			 		  		  
		    }	,
			form_show_group: function(){ //отобразит, скрыть список спрайтов
				var props = this.parent.props;
				if(this.prop == null){				
					this.prop = true;
					this.props("form_show_group_class").removeProp("d-none");				
				}else{
					this.prop = null;
					this.props("form_show_group_class").setProp("d-none");
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
				}				
			},
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
			  var distance = 1;
			  var move = false;
			  //if(distance < 1)distance = 3;
			  var k = this.$$("emiter-keydown").prop;
			  var sprite = this.parent.props.start_module.prop;
			  if(sprite == null)return;
			 // console.log(this.$$("emiter-keydown").prop);
			 if(k == "ArrowUp"){					
				sprite.move(0, distance*-1);
                move = true;				
			 }else if(k == "ArrowDown"){
				sprite.move(0, distance);
				move = true;
			 }else if(k == "ArrowRight"){			 
				 sprite.move(distance, 0);
                 move = true;				 
			 }else if(k == "ArrowLeft"){
				sprite.move( distance*-1, 0);
                move = true;				
			 }else{
				 return;
			 }
              if(move){			 
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.parent.data.length -1; i >= 0; i--){
					 var id = this.parent.data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.parent.data[i].props["class"].prop);
			    }
				sprite.render(this.$props("sprites"), "active");
				this.rootLink.stateMethods.drawGrid();
              }				
		  },		  		  
		  canvas_click: function(){
		  }	,
		  canvas_move: function(){
		  },
		  canvas_click_done: function(){
		  
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
				ctx.putImageData(saveImg, 0, 0);
				for(var i = this.component().data.length-1; i>=0 ; i--){
					 var id = this.component().data[i].props["id"].getProp();
					 this.$props("sprites_group")[id].render(this.$props("sprites"), this.component().data[i].props["class"].prop);
			    }
				this.rootLink.stateMethods.drawGrid();
				
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
  },	