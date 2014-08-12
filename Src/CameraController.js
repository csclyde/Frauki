X_VEL_DIV = 15;
Y_VEL_DIV = 30;

CameraController = function(player, map) {
	this.player = player;
	this.map = map;

	this.camX = player.body.x;
	this.camY = player.body.y;

	this.repulsiveTiles = [];

	this.prevXVel = 0;
	this.prevYVel = 0;

	this.retweenY = false;

	events.subscribe('player_crouch', this.CrouchCamera, this);
}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	

	var xOffset = this.player.states.direction === 'left' ? -15 : 15;
	var yOffset = this.player.body.velocity.y > 0 ? 20 : 0;

	yOffset += (this.player.states.crouching ? 30 : 0);
	yOffset -= (this.player.states.upPressed ? 70 : 0);

	if(this.prevXVel !== this.player.body.velocity.x)
		game.add.tween(this).to({camX:Math.floor((this.player.body.velocity.x / X_VEL_DIV) + xOffset)}, 700, Phaser.Easing.Sinusoidal.Out, true);

	if(this.prevYVel !== this.player.body.velocity.y || this.retweenY) {
		game.add.tween(this).to({camY:Math.floor((this.player.body.velocity.y / Y_VEL_DIV) + yOffset)}, 400, Phaser.Easing.Sinusoidal.Out, true);
		this.retweenY = false;
	}

	//conditional is to compensate for change is body size
	if(this.player.state === this.player.Crouching)
		game.camera.focusOnXY(this.camX + this.player.body.x, this.camY + this.player.body.y - 20);
	else
		game.camera.focusOnXY(this.camX + this.player.body.x, this.camY + this.player.body.y);

	this.prevXVel = this.player.body.velocity.x;
	this.prevYVel = this.player.body.velocity.y;
}

CameraController.prototype.SetRepulsiveTiles = function(tileArray) {
	this.repulsiveTiles = tileArray;
}

CameraController.prototype.CrouchCamera = function(params) {
	this.retweenY = true;
}
