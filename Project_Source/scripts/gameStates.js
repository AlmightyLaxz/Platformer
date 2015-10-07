/***********************************************
				Game State Handling
***********************************************/

// Splash Screen
var splash = [];

function runSplash(deltaTime) {
	splash.image = document.createElement("img");
	splash.image.src = "art/bullet.png";
	context.save();
	context.drawImage(splash.image, 0, 0);
	context.restore();
	if (splashTimer > 0) {splashTimer -= deltaTime;}
	else {gameState = STATE_GAME; splashTimer = 2;}
}

// Function for running game
function runGame(deltaTime) {
	player.update(deltaTime);
	if(debugCollisions == false) {
		player.draw();
		drawMap();
		enemy.draw();
	}
	
	for (var x=0; x<bullets.length; x++) {
		if (bullets[x].alive == true) {
			bullets[x].update(deltaTime);
			bullets[x].draw();
		}
		else {
			bullets.splice(x, 1);
		}
	}
	
	for (var x=0; x<enemies.length; x++) {
		enemies[x].update(deltaTime);
		enemies[x].draw();
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_M)) {
		debugCollisions = true;
	}
	
	if (keyboard.isKeyUp(keyboard.KEY_M)) {
		debugCollisions = false;
	}
	
	if (debugCollisions == true) {
		debugCollisionsMode();
	}
	
	// player death handling
	if (player.alive == false) {
		player.lives--;
		if (player.lives < 1) {gameState = STATE_GAMEOVER;}
		else {player.position.set(9*TILE, 0*TILE); player.alive = true;}
	}
	
	// falling off the map == death
	if (player.position.y > 800) {player.alive = false;}
	
	drawHUD();
}

// Game over function
function runGameOver(deltaTime) {
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	resetGame();
}