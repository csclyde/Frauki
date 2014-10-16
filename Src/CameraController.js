X_VEL_DIV = 15;
Y_VEL_DIV = 30;

CameraController = function(player, map) {
	frauki = player;
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
	events.subscribe('control_up', this.RaiseCamera, this);
	events.subscribe('camera_shake', this.ScreenShake, this);

	this.daemon = game.add.sprite(0, 0, null);

	this.moveTimer = 0;

	//game.camera.follow(this.daemon);
}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	

	var xOffset = frauki.states.direction === 'left' ? -15 : 15;
	var yOffset = frauki.body.velocity.y > 0 ? 20 : 0;

	yOffset += (frauki.states.crouching ? 50 : 0);
	yOffset -= (frauki.states.upPressed ? 50 : 0);

	if(this.prevXVel !== frauki.body.velocity.x)
		game.add.tween(this).to({camX:Math.floor((frauki.body.velocity.x / X_VEL_DIV) + xOffset)}, 500, Phaser.Easing.Sinusoidal.Out, true);

	if(this.prevYVel !== frauki.body.velocity.y || this.retweenY) {
		game.add.tween(this).to({camY:Math.floor((frauki.body.velocity.y / Y_VEL_DIV) + yOffset)}, 400, Phaser.Easing.Sinusoidal.Out, true);
		this.retweenY = false;
	}

	//do the screen shake
	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now * 3) * this.shakeMagnitudeX;
	} else {
		this.shakeX = 0;
	}

	//this.daemon.x = this.camX + frauki.body.x + this.shakeX;
	//this.daemon.y = this.camY + frauki.body.y + this.shakeY;
	if(game.time.now > this.moveTimer) {
		game.camera.focusOnXY(this.camX + frauki.body.x + this.shakeX, this.camY + frauki.body.y + this.shakeY);
		this.moveTimer = game.time.now + 12;
	}

	this.prevXVel = frauki.body.velocity.x;
	this.prevYVel = frauki.body.velocity.y;
}

CameraController.prototype.SetRepulsiveTiles = function(tileArray) {
	this.repulsiveTiles = tileArray;
}

CameraController.prototype.CrouchCamera = function(params) {
	this.retweenY = true;
}

CameraController.prototype.RaiseCamera = function(params) {
	this.retweenY = true;
}

CameraController.prototype.ScreenShake = function(params) {
	this.shakeMagnitudeX = params.magnitudeX;
	this.shakeMagnitudeY = params.magnitudeY;
	
	game.add.tween(this).to({shakeMagnitudeX: 0}, params.duration, Phaser.Easing.Linear.None, true);
	game.add.tween(this).to({shakeMagnitudeY: 0}, params.duration, Phaser.Easing.Linear.None, true);

	//a sine function that is multiplied by the magnitude. The magnitude has a tween set to 0 based on the duration
}
