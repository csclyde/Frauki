X_VEL_DIV = 5;
Y_VEL_DIV = 10;

CameraController = function() {

	this.camX = 0;
	this.camY = 0;

	this.shakeX = 0;
	this.shakeY = 0;
	this.shakeMagnitudeX = 0;
	this.shakeMagnitudeY = 0;

	this.prevXVel = 0;
	this.prevYVel = 0;

	this.retweenY = false;

	events.subscribe('player_crouch', this.CrouchCamera, this);
	events.subscribe('control_up', this.RaiseCamera, this);
	events.subscribe('camera_shake', this.ScreenShake, this);

	this.panning = false;

	game.camera.width = 480 * 1.5;
	game.camera.height = 270 * 1.5;

}

//camera is controlled in player centric space
CameraController.prototype.Update = function() {
	
	var xOffset = frauki.states.direction === 'left' ? -15 : 15;
	var yOffset = frauki.body.velocity.y > 0 ? 20 : -20;

	yOffset += (frauki.states.crouching ? 35 : 0);

	if(frauki.states.upPressed) {
		if(!game.physics.arcade.overlap(frauki, Frogland.door1Group) && !game.physics.arcade.overlap(frauki, Frogland.door2Group) && !speechController.FraukiInSpeechZone()) {
			yOffset -= 25;
		}
	}

	var idealX = (frauki.body.velocity.x / X_VEL_DIV) + xOffset * pixel.scale;
	var dist = idealX - this.camX;


	this.camX += dist * 3 * game.time.physicsElapsed;

	var idealY = (frauki.body.velocity.y / Y_VEL_DIV) + yOffset * pixel.scale;
	var dist = idealY - this.camY;

	this.camY += dist * 3 * game.time.physicsElapsed;

	//do the screen shake
	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now * 3) * this.shakeMagnitudeX;
	} else {
		this.shakeX = 0;
	}

	if(this.shakeMagnitudeY > 0) {
		this.shakeY = Math.sin(game.time.now * 3) * this.shakeMagnitudeY;
	} else {
		this.shakeY = 0;
	}

	//this.camX += this.shakeX;
	//this.camY += this.shakeY;

	this.camX = Math.abs(dist) < 0.2 ? Math.round(this.camX) : this.camX;
	this.camY = Math.abs(dist) < 0.2 ? Math.round(this.camY) : this.camY;

	var newCamX = (this.camX + frauki.body.center.x + this.shakeX);
	var newCamY = (this.camY + frauki.body.y + this.shakeY + (frauki.body.height - 50));
	
	//game.camera.focusOnXY(newCamX, newCamY);

	//game.camera.focusOnXY(frauki.body.center.x, frauki.body.center.y);
	game.camera.x = (game.camera.x + ((frauki.body.center.x - game.camera.x) * 0.2)) - 75;
	game.camera.y = (game.camera.y + ((frauki.body.center.y - game.camera.y) * 0.1)) - 20;


	this.prevXVel = frauki.body.velocity.x;
	this.prevYVel = frauki.body.velocity.y;
}

CameraController.prototype.CrouchCamera = function(params) {
	this.retweenY = true;
};

CameraController.prototype.RaiseCamera = function(params) {
	this.retweenY = true;
};

CameraController.prototype.ScreenShake = function(params) {

	if(Main.restarting === true) {
		return;
	}

	this.shakeMagnitudeX = params.magnitudeX * pixel.scale + (game.rnd.between(1, 2) == 1 ? -1 : 1);
	this.shakeMagnitudeY = params.magnitudeY * pixel.scale + (game.rnd.between(1, 2) == 1 ? -1 : 1);
	
	this.shakeXTween = game.add.tween(this).to({shakeMagnitudeX: 0}, params.duration, Phaser.Easing.Linear.None, true);
	this.shakeYTween = game.add.tween(this).to({shakeMagnitudeY: 0}, params.duration, Phaser.Easing.Linear.None, true);

	//a sine function that is multiplied by the magnitude. The magnitude has a tween set to 0 based on the duration
}
