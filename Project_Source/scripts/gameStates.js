/***********************************************
				Game State Handling
***********************************************/

// Splash Screen
var splash = [];
// Game Over Screen
var gameover = [];

function runSplash(deltaTime) {
	splash.image = document.createElement("img");
	splash.image.src = "art/platformer-splash.png";
	context.save();
	context.drawImage(splash.image, 0, 0);
	context.restore();
	if (keyboard.isKeyDown(keyboard.KEY_SPACE)) {gameState = STATE_GAME;}
}

// Function for running game
function runGame(deltaTime) {
	drawMap();
	player.update(deltaTime);
	player.draw();
	for (var x=0; x<enemies.length; x++) {
		enemies[x].update(deltaTime);
		enemies[x].draw();
		
		if(intersects(player.position.x, player.position.y, TILE, TILE, enemies[x].position.x, enemies[x].position.y, TILE, TILE) == true) {
				player.alive = false;
		}
	}

	
	for(var i=0; i<bullets.length; i++) {
		bullets[i].update(deltaTime);
		if (bullets[i].position.x - worldOffsetX < 0 || bullets[i].position.x - worldOffsetX > SCREEN_WIDTH) {
			bullets[i].alive = false;
		}
		for(var j=0; j<enemies.length; j++) {
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE, enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true) {
				// kill both the bullet and the enemy
				enemies.splice(j, 1);
				bullets[i].alive = false;
				// increment the player score
				player.score += 1;
				break;
			}
		}
		if(bullets[i].alive == false) {
			bullets.splice(i, 1);
			break;
		}
	}

	for(var i=0; i<bullets.length; i++) {
		bullets[i].draw();
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
	gameover.image = document.createElement("img");
	gameover.image.src = "art/platformer-gameover.png";
	context.save();
	context.drawImage(gameover.image, 0, 0);
	context.restore();
	context.fillStyle = "#000";
	context.font="32px Arial";
	context.fillText("Final Score: " + player.score, 220, 300, 1000);
}