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
var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

var MAP = {tw:60, th:15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;

var splashTimer = 2;

var debugCollisions = false;

var PLAYER_SPEED = 1;
var BULLET_SPEED = 6;

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

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_MAX = 6;

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var musicBackground;
var sfxFire;

// Built from classes
var player = new Player();
var keyboard = new Keyboard();

var shootTimer = 0;

var bullets = [];
var enemies = [];
var enemy = new Enemy();
enemies.push(enemy);

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
	
	// add enemies
	/*idx = 0;
	for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
		for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
			if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
				var px = tileToPixel(x);
				var py = tileToPixel(y);
				var e = new Enemy(px, py);
				enemies.push(e);
			}
			idx++;
		}
	}*/
	
	musicBackground = new Howl(
	{
		urls: ["sound/background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5
	} );
		musicBackground.play();
		sfxFire = new Howl(
	{
		urls: ["sound/fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function() {
		isSfxPlaying = false;
	}
	} );

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
	
	switch(gameState) {
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
	drawFPS(deltaTime)
}

initialize();

/***********************************************
					Debug
***********************************************/
function debugCollisionsMode() {
	// draw the player collisions
	context.fillStyle = "#FF0";
	context.fillRect(player.position.x, player.position.y, TILE, TILE);

	// draw the collision map
	context.fillStyle = "#f00";
	for (var i = 0; i < cells.length; ++i) {
		if (i != 1) continue;
		var layer = cells[i];
		for (var y = 0; y < layer.length; ++y) {
			var row = layer[y];
			for (var x = 0; x < row.length; ++x) {
				var cell = row[x];
				if (cell) {
					context.fillRect(x * TILE - 1, y * TILE - 1, TILE - 2, TILE - 2);
				}
			}
		}
	}
	
	context.fillStyle = "#7FFF00";
	for (var i = 0; i < bullets.length; ++i) {
		context.fillRect(bullets[i].position.x, bullets[i].position.y, 10, 10);
	}
}

/***********************************************
					Reset Game
***********************************************/
function resetGame() {
	var gameState = STATE_SPLASH;
	var splashTimer = 2;
	var debugCollisions = false;
}

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
