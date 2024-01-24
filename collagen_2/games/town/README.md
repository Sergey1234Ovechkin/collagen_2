

Для работы игры требуются модули forever(глобальная инсталяция) и socket.js 


Установить модули на node.js командами:
 
 npm install forever -g
 
 npm install socket.js
 
Основной скрипт игры - game_script.js

Запуск игры -  forever start server.js



Для того чтобы вставить спрайты своих персонаже в игру - открыть файл public/game_script.js

	///тип спрайта персонажа (название)
	var typeP1 = "men_wolf"; /// изменить названия персонажей на свои названия
	var typeP2 = "women_1";
	var typeP3 = "new_personage"; //можно добавить нового персонажа

	///в конце скрипта добавить в функцию код для выбора нового персонажа
	///форма выбора типа персонажа
	StateMap.chose_personage = { 	
		container: "chose_personage",
		props: [["personage_1", "mousedown", "[name='personage_1']"], 
                       ["personage_2", "mousedown", "[name='personage_2']"],
		       
	               ///добавляем код нового персонажа 
	               ["personage_3", "mousedown", "[name='personage_3']"],	
		         ],
		methods: {
			personage_1: function(){
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites[typeP1], [250, 300]);
				pesonageType = typeP1;
				createSocket();
            },
			personage_2: function(){
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites[typeP2], [250, 300]);
				pesonageType = typeP2;
                createSocket();				
            },
			
			///добавляем код нового персонажа  - personage_3 (изменяем только typeP3)
			personage_3: function(){ 
				this.parent.htmlLink.style.display = "none";
				modules.personage =  addTileCommon(personageId, this.$props().sprites[typeP3], [250, 300]);
				pesonageType = typeP3;
                createSocket();				
            }		
		}			
		
 }


При добавлении нового персонажа также добавить в файл index.html код с именем персонажа - personage_3, по анологии с остальным текстом


							<div data-chose_personage="container" class="form-group " style="display: none; padding: 10px; background-color: white; position: fixed;  top: 5px; left: 5px; z-index:5">
								<p>Выберите персонажа:</p>
								<div class="form-check">
									<input  class="form-check-input" type="radio" name="personage_1" id="flexRadioDefault1">
									<label class="form-check-label" for="flexRadioDefault1">
										personage_1
									</label>
								</div>
								<div class="form-check">
									<input class="form-check-input" type="radio" name="personage_2" id="flexRadioDefault2">
									<label class="form-check-label" for="flexRadioDefault2">
										personage_2
									</label>
							     </div>	
								 
								 <div class="form-check">
									<input class="form-check-input" type="radio" name="personage_3" id="flexRadioDefault2">
									<label class="form-check-label" for="flexRadioDefault2">
										new personage
									</label>
							     </div>	
							</div>



Для того чтобы выложить игру на glitch, зайти в глитч, создать новый проект "glitch-hello-node"

Удалить все файлы кроме .env .gitignore, лишние папки(src), с папки public удалить все файлы

Скопировать все файлы в проект и папку publick 

Нажать кнопку prewiew -> prewiew in new window

