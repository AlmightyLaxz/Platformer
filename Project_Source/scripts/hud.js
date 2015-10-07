/***********************************************
					HUD Drawing
***********************************************/

hudBackground = [];
hudBackground.image = document.createElement("img");
hudBackground.image.src = "art/hud_background.png";

function drawHUD() {
	context.drawImage(hudBackground.image, 0, 0);
	context.fillStyle = "#000";
	context.font="20px Arial";
	context.fillText("Lives: " + player.lives, 10, 30, 100);
	context.fillText("Score: " + player.score, 120, 30, 100);
}