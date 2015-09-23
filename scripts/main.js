/***********************************************
				Platformer Game
				September 2015
***********************************************/

/***********************************************
					Variables
***********************************************/

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

// Map related constants
var LAYER_COUNT = 2;
//var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 0;
var LAYER_LADDERS = 1;
var MAP = {tw:60, th:15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_SPLASH;

var PLAYER_SPEED = 1;
var BULLET_SPEED = 4;

 // abitrary choice for 1m
var METER = TILE;
 // very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
 // max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
 // max vertical speed (15 tiles per second)
var MAXDY = METER * 150;
 // horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 4;
 // horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 10;
 // (a large) instantaneous jump impulse
var JUMP = METER * 1500;

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// Built from classes
var player = new Player();
var keyboard = new Keyboard();

var shootTimer = 0;

var bullets = [];
var enemies = [];
var enemy = new Enemy();
enemies.push(enemy)

/***********************************************
				Delta Time Function
***********************************************/
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// Returns the time in seconds since the function was last called
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
	// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var cells = []; // the array that holds our simplified collision data
function initialize() {
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++) {
				if(level1.layers[layerIdx].data[idx] != 0) {
					// for each tile we find in the layer data, we need to create 4 collisions
					// (because our collision squares are 35x35 but the tile in the
					// level are 70x70)
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

/***********************************************
				Game State Handling
***********************************************/
function runSplash() {
	
}
function runGame() {
	
}
function runGameOver() {
	
}

/***********************************************
				Main Function
				Run at 60 FPS
***********************************************/

function main()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	player.draw();
	drawMap();
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	for (var x=0; x<bullets.length; x++) {
		if (bullets[x].alive == true) {
			bullets[x].update(deltaTime);
			bullets[x].draw();
		}
		else {
			bullets.splice(x, 1)
		}
	}
	
	for (var x=0; x<enemies.length; x++) {
		enemies[x].update(deltaTime);
		enemies[x].draw();
	}
	
	switch(gameState) {
		case STATE_SPLASH:
			runSplash();
			break;
		case STATE_GAME:
			runGame();
			break;
		case STATE_GAMEOVER:
			runGameOver();
			break;
	}
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

initialize();

/***********************************************
					Framework
***********************************************/
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(main);
