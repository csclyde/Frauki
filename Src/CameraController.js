X_VEL_DIV = 12;
Y_VEL_DIV = 30;

CameraController = function(player, map) {
	this.player = player;
	this.map = map;

	this.camX = 0;
	this.camY = 0;

	this.shakeX = 0;
	this.shakeY = 0;
	this.shakeMagnitudeX = 0;
	this.shakeMagnitudeY = 0;

	this.repulsiveTiles = [];

	this.prevXVel = 0;
	this.prevYVel = 0;

	this.retweenY = false;

	events.subscribe('player_crouch', this.CrouchCamera, this);
}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	

	var xOffset = this.player.states.direction === 'left' ? -30 : 30;
	var yOffset = this.player.body.velocity.y > 0 ? 20 : 0;

	yOffset += (this.player.states.crouching ? 50 : 0);
	//yOffset -= (this.player.states.upPressed ? 70 : 0);

	if(this.prevXVel !== this.player.body.velocity.x)
		game.add.tween(this).to({camX:Math.floor((this.player.body.velocity.x / X_VEL_DIV) + xOffset)}, 500, Phaser.Easing.Sinusoidal.Out, true);

	if(this.prevYVel !== this.player.body.velocity.y || this.retweenY) {
		game.add.tween(this).to({camY:Math.floor((this.player.body.velocity.y / Y_VEL_DIV) + yOffset)}, 400, Phaser.Easing.Sinusoidal.Out, true);
		this.retweenY = false;
	}

	//do the screen shake
	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now) * this.shakeMagnitudeX;
	} else {
		this.shakeX = 0;
	}

	//conditional is to compensate for change is body size
	if(this.player.state === this.player.Crouching)
		game.camera.focusOnXY(this.camX + this.player.body.x + this.shakeX, this.camY + this.player.body.y - 20 + this.shakeY);
	else
		game.camera.focusOnXY(this.camX + this.player.body.x + this.shakeX, this.camY + this.player.body.y + this.shakeY);

	this.prevXVel = this.player.body.velocity.x;
	this.prevYVel = this.player.body.velocity.y;
}

CameraController.prototype.SetRepulsiveTiles = function(tileArray) {
	this.repulsiveTiles = tileArray;
}

CameraController.prototype.CrouchCamera = function(params) {
	this.retweenY = true;
}

CameraController.prototype.ScreenShake = function(magnitudeX, magnitudeY, duration) {
	this.shakeMagnitudeX = magnitudeX;
	this.shakeMagnitudeY = magnitudeY;
	
	game.add.tween(this).to({shakeMagnitudeX: 0}, duration, Phaser.Easing.Linear.None, true);
	game.add.tween(this).to({shakeMagnitudeY: 0}, duration, Phaser.Easing.Linear.None, true);

	//a sine function that is multiplied by the magnitude. The magnitude has a tween set to 0 based on the duration
}