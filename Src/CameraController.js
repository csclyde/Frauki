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

}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	
	var xOffset = frauki.states.direction === 'left' ? -5 : 5;
	var yOffset = frauki.body.velocity.y > 0 ? 0 : 0;

	yOffset += (frauki.states.crouching ? 35 : 0);

	if(frauki.states.upPressed) {
		if(!game.physics.arcade.overlap(frauki, Frogland.door1Group) && !game.physics.arcade.overlap(frauki, Frogland.door2Group)) {
			yOffset -= 35;
		}
	}


	var idealX = (frauki.body.velocity.x / X_VEL_DIV) + xOffset;
	var dist = idealX - this.camX;

	this.camX += dist * 3 * game.time.physicsElapsed;

	var idealY = (frauki.body.velocity.y / Y_VEL_DIV) + yOffset;
	var dist = idealY - this.camY;

	this.camY += dist * 5 * game.time.physicsElapsed;

	//do the screen shake
	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now * 3) * this.shakeMagnitudeX + Math.random() * 10;
	} else {
		this.shakeX = 0;
	}

	this.camX = Math.round(this.camX);
	this.camY = Math.round(this.camY);

	var newCamX = (this.camX + frauki.body.center.x + this.shakeX);
	var newCamY = (this.camY + frauki.body.y + this.shakeY + (frauki.body.height - 50));
	
	game.camera.focusOnXY(newCamX, newCamY);

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
