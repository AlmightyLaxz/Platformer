var Vec2 = function() {
	this.x = 0;
	this.y = 0;
}

Vec2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

Vec2.prototype.add = function(x, y) {
	this.x += x;
	this.y += y;
}

Vec2.prototype.subtract = function(x, y) {
	this.x -= x;
	this.y -= y;
}

Vec2.prototype.multiplyScalar(num) {
	this.x = this.x * num;
	this.y = this.y * num;
}

Vec2.prototype.normalize() {
	
}

var position = new Vec2();