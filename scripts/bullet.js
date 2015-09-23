/***********************************************
				Bullet Object
***********************************************/

var Bullet = function() {
	this.image = document.createElement("img");
	this.x = player.position.x + 140;
	this.y = player.position.y + 100;
	this.width = 159;
	this.height = 163;
	this.image.src = "art/bullet.png";
	this.deathtimer = 1;
	this.alive = true;
};

Bullet.prototype.update = function(deltaTime) {
	if( typeof(this.rotation) == "undefined" )
	this.rotation = 0;
	
	this.x += BULLET_SPEED * (deltaTime * 100);
	this.deathtimer -= deltaTime;
	if (this.deathtimer <= 0) {this.alive = false;}
}

Bullet.prototype.draw = function() {
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.rotation);
	context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}