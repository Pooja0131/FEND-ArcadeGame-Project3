//Global Variables
var SCORE = 0;
var STARTX = [105, 210, 310, 410];
var STARTY = [100, 185, 270, 435];

/*Function to get random integer 
between two given numbers*/
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

/*Function to randomly select
from array elements*/
function selectRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
};

//Function to check collision
var collisionCheck = function(object, player){
	return(object.x < player.x + 40 && object.x + 40 > player.x && object.y < player.y + 40 && object.y + 40 > player.y)
};

//Function to update player's score on screen
var scoreUpdate = function(SCORE){
	var Score = document.getElementById('score');
    // remove first child if exists
    Score.removeChild(Score.childNodes[0]);
    // create textNode and append it to Score
    var scoreText = document.createTextNode(SCORE);
    Score.appendChild(scoreText);
};


//Enemy
var Enemy = function(x, y) {
    this.x = x;
	this.y = y;
	this.sprite = 'images/enemy-bug.png';
	this.speed = getRandomInt(50, 150);
};

/*Updates enemy's position, checks for collion and
updates score accordingly*/ 
Enemy.prototype.update = function(dt) {
    /* You should multiply any movement by the dt parameter
     which will ensure the game runs at the same speed for
     all computers.*/
	if(this.x > 505){
		this.x = -100;
	}
	else{
		this.x += 190 * dt;
	}
	if(collisionCheck(this, player)){
		SCORE -= 10;
		scoreUpdate(SCORE);
		player.reset();
	}
};

//Draws enemy on screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Player 
var Player = function(x, y){
	this.sprite = 'images/char-boy.png';
	this.x = x;
	this.y = y;
	this.speed = 100;
	this.direction = null;
};

//Draws player on screen
Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*Updates the player's position. 
Checks if player has reached the water and 
updates score accordingly.
Prevents player from going off canvas.*/
Player.prototype.update = function(){
	if (this.y < 0) {
		this.reset();
	}
	var x = 101;
	var y = 83;
		
	if(this.direction === 'left'){
		this.x = this.x - x;
	}
	if(this.direction === 'right'){
		this.x = this.x + x;
	}
	if(this.direction === 'up'){
		this.y = this.y - y;
	}
	if(this.direction === 'down'){
		this.y = this.y + y;
	}
	this.direction = null;
	//player reached water
    if (this.y <= 30) {   
        SCORE += 10;
		this.reset();
		scoreUpdate(SCORE);
	}
	//player cannot move off canvas
	if(this.x <= -10){   
		this.x = 0;
	}
	if(this.x >= 500){     
		this.x = 400;
	}
	if(this.y >= 450){     
		this.y = 400;
	}
};

//Resets player's position.
Player.prototype.reset = function(){
	this.x = 200;
	this.y = 400;
};

//Move the player according to keyboard(direction) input.
Player.prototype.handleInput = function (direction) {
    if(direction) {
        this.direction = direction; 
    }
};


//Gem 
var Gem = function(x, y){
	this.x = selectRandom(STARTX);
	this.y = selectRandom(STARTY);
	
	this.spriteArray = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
	this.sprite = this.spriteArray[Math.floor(Math.random() * this.spriteArray.length)];	
	   
	this.width = 90;
	this.height = 110;
};

//Draws gem on screen
Gem.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/*Checks if player collected the gem and 
updates score, gems's position accordingly.*/
Gem.prototype.update = function(){
	var timeInterval = 0;
    if(collisionCheck(this, player)){
		SCORE += 20;
		scoreUpdate(SCORE);
		this.x = selectRandom(STARTX);
		this.y = selectRandom(STARTY);
	}
};


//Object instances
var enemy1 = new Enemy(-450, 232);
var enemy2 = new Enemy(-200, 150);
var enemy3 = new Enemy(-100, 70);
var enemy4 = new Enemy(-600, 150);
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var player = new Player(200, 400);

var gem = new Gem();

/*This listens for key presses and sends the keys to your
Player.handleInput() method.*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
