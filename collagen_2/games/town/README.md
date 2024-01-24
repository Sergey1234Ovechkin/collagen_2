

Для работы игры требуются модули forever(глобальная инсталяция) и socket.js 


Установить модули на node.js командами:
 
 npm install forever -g
 
 npm install socket.js
 
Основной скрипт игры - publick/game_script.js
Проект со спрайтами и расположением обьектов tiles - publick/sprites.json

Запуск игры -  forever start server.js



Для того чтобы вставить спрайты своих персонажей в игру, заменить файл sprites.json на совой проект  

- открыть файл index.html, отредактировать разметку


		<div data-chose_personage="container" class="form-group " style="display: none; padding: 10px; background-color: white; position: fixed;  top: 5px; left: 5px; z-index:5">
			<p>Выберите персонажа:</p>
			<div class="form-check">
				<input data-name="men_wolf" name="personage_1" class="form-check-input" type="radio"  id="flexRadioDefault1">
				<label class="form-check-label" for="flexRadioDefault1">
					men_wolf
				</label>
			</div>
			<div class="form-check">
				<input data-name="women_1" name="personage_2"  class="form-check-input" type="radio"  id="flexRadioDefault2">
				<label class="form-check-label" for="flexRadioDefault2">
					women_1
				</label>
			</div>	
								 
			<!--- добавляем в разметку нового персонажа data-name="new_personage" name="personage_3" --> 
			<div class="form-check">
				<input  data-name="new_personage" name="personage_3" class="form-check-input" type="radio" name="personage_3" id="flexRadioDefault2">
				<label class="form-check-label" for="flexRadioDefault2">
				new personage
				</label>
			</div>	
		</div>



Затем открыть файл  public/game_script.js


		///указать количетво персонажей
		var personages = ["personage_1", "personage_2", /*"personage_3",  и т.д*/ ];





Для того чтобы выложить игру на glitch, зайти в глитч, создать новый проект "glitch-hello-node"

Удалить все файлы кроме .env .gitignore, лишние папки(src), с папки public удалить все файлы

Скопировать все файлы в проект и папку publick 

Нажать кнопку prewiew -> prewiew in new window

