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
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;

var LAYER_OBJECT_ENEMIES = 2;
var LAYER_OBJECT_TRIGGERS = 3;

var MAP = {tw:60, th:15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

// game state constants
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;

// player speed constants
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

// player movement variables
var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

// player directions
var LEFT = 0;
var RIGHT = 1;

// player animation constants
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_SHOOT_LEFT = 6;
var ANIM_SHOOT_RIGHT = 7;
var ANIM_MAX = 8;

// frames per second variables
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// sound effects and music
var musicBackground;
var sfxFire;

// Built from classes
var player = new Player();
var keyboard = new Keyboard();

// current level stuff
var currentLevel = level1;
var levelId = 1;


// Object arrays
var bullets = [];
var enemies = [];

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
		for(var y = 0; y < currentLevel.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < currentLevel.layers[layerIdx].width; x++) {
				if(currentLevel.layers[layerIdx].data[idx] != 0) {
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
	idx = 0;
	for(var y = 0; y < currentLevel.layers[LAYER_OBJECT_ENEMIES].height; y++) {
		for(var x = 0; x < currentLevel.layers[LAYER_OBJECT_ENEMIES].width; x++) {
			if(currentLevel.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
				var px = tileToPixel(x);
				var py = tileToPixel(y);
				var e = new Enemy(px, py);
				enemies.push(e);
			}
			idx++;
		}
	}
	// initialize trigger layer in collision map
	cells[LAYER_OBJECT_TRIGGERS] = [];
	idx = 0;
	for(var y = 0; y < currentLevel.layers[LAYER_OBJECT_TRIGGERS].height; y++) {
		cells[LAYER_OBJECT_TRIGGERS][y] = [];
		for(var x = 0; x < currentLevel.layers[LAYER_OBJECT_TRIGGERS].width; x++) {
			if(currentLevel.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0) {
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
			}
			else if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1) {
				// if we haven't set this cell's value, then set it to 0 now
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
			}
			idx++;
		}
	}

	
	// sound objects using howl library
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
					Reset Game
***********************************************/
function resetGame() {
	var gameState = STATE_SPLASH;
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
