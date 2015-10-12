/***********************************************
				Bullet Object
***********************************************/

var Bullet = function(x, y, moveRight)
{
	this.sprite = new Sprite("art/bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vec2();
	this.position.set(x, y);
	
	this.velocity = new Vec2();
	
	this.moveRight = moveRight;
	if(this.moveRight == true)
		this.velocity.set(MAXDX *2, 0);
	else
		this.velocity.set(-MAXDX *2, 0);
	
	this.alive = true;
}

Bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	if	(cellAtTileCoord(LAYER_PLATFORMS, tx, ty) == true)
	{
		this.alive = false;
	}
}

Bullet.prototype.draw = function()
{
	var screenX = this.position.x - worldOffsetX;
	this.sprite.draw(context, screenX, this.position.y);
}
