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
	else {gameState = STATE_GAME;}
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
	
	if (player.alive == false) {
		gameState = STATE_GAMEOVER;
	}
	if (player.position.y > 800) {player.alive = false;}
}

// Game over function
function runGameOver(deltaTime) {
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	resetGame();
}