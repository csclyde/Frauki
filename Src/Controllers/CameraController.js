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

};

//camera is controlled in player centric space
CameraController.prototype.Update = function() {
	
	var xOffset = frauki.states.direction === 'left' ? -10 : 10;
	var yOffset = 0;//frauki.body.velocity.y > 0 ? 20 : -20;

	yOffset += (frauki.states.crouching ? 25 : 0);

	if(frauki.states.upPressed) {
		if(!game.physics.arcade.overlap(frauki, Frogland.door1Group) && !game.physics.arcade.overlap(frauki, Frogland.door2Group) && !speechController.FraukiInSpeechZone()) {
			yOffset -= 25;
		}
	}

	var idealX = xOffset + frauki.body.center.x;

	var idealY = yOffset + frauki.body.center.y;

	//do the screen shake

	//this.camX += this.shakeX;
	//this.camY += this.shakeY;

	this.camX += (idealX - this.camX) * 0.2;
	this.camY += (idealY - this.camY) * 0.1;

	game.camera.focusOnXY(this.camX, this.camY);

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
};

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
