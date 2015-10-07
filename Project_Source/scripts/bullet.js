/***********************************************
				Bullet Object
***********************************************/

var Bullet = function() {
	this.image = document.createElement("img");
	this.position = new Vec2();
	this.width = 0;
	this.height = 0;
	this.image.src = "art/bullet.png";
	this.deathtimer = 1;
	this.alive = true;
	this.direction = player.direction;
	if(this.direction == RIGHT) {this.position.set(player.position.x + 70, player.position.y);}
	else {this.position.set(player.position.x - 30, player.position.y);}
};

Bullet.prototype.update = function(deltaTime) {
	
	if(this.direction == RIGHT) {this.position.x += BULLET_SPEED * (deltaTime * 100);}
	else {this.position.x -= BULLET_SPEED * (deltaTime * 100);}
	this.deathtimer -= deltaTime;
	if (this.deathtimer <= 0) {this.alive = false;}
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	if (cellAtTileCoord(LAYER_PLATFORMS, tx, ty)) {
		this.alive = false;
	}
}

Bullet.prototype.draw = function() {
	context.save();
	context.translate(this.position.x, this.position.y);
	context.rotate(this.rotation);
	context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}