X_VEL_DIV = 5;
Y_VEL_DIV = 10;

CameraController = function() {

	this.camX = 0;
	this.camVelX = 0;
	this.camY = 0;
	this.camVelY = 0;

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

	this.target = frauki;

	events.subscribe('focus_on', function(params) {
		console.log(this.target);
		this.target = params.target;
	}, this);

};

//camera is controlled in player centric space
CameraController.prototype.Update = function() {
	
	var xOffset = frauki.states.direction === 'left' ? -10 : 10;
	var yOffset = 0;//frauki.body.velocity.y > 0 ? 20 : -20;

	yOffset += (frauki.states.crouching ? 50 : 0);

	if(frauki.state === frauki.Rolling) {
		yOffset += 5;
	}

	if(frauki.states.upPressed) {
		if(!inputController.inDoorway && !speechController.FraukiInSpeechZone()) {
			yOffset -= 50;
		}
	}

	this.target = this.target || frauki;

	var idealX = xOffset + this.target.body.center.x;
	var idealY = yOffset + this.target.body.center.y;

	this.camVelX = (idealX - this.camX) * 0.08;
	this.camVelY = (idealY - this.camY) * 0.08;

	//console.log(this.camVelY)

	this.camX += this.camVelX * Phaser.Math.smoothstep(Math.abs(this.camVelX), -0.01, 3.33);
	this.camY += this.camVelY * Phaser.Math.smoothstep(Math.abs(this.camVelY), -0.01, 8.0);

	game.camera.focusOnXY(Math.floor(this.camX), Math.floor(this.camY));

	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now * 60) * this.shakeMagnitudeX;
	} else {
		this.shakeX = 0;
	}

	if(this.shakeMagnitudeY > 0) {
		this.shakeY = Math.sin(game.time.now * 60) * this.shakeMagnitudeY;
	} else {
		this.shakeY = 0;
	}

	this.camX += this.shakeX;
	this.camY += this.shakeY;
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

	this.shakeMagnitudeX = params.magnitudeX;// * (game.rnd.between(0, 1) < 0.5 ? -1 : 1);
	this.shakeMagnitudeY = params.magnitudeY;// * (game.rnd.between(0, 1) < 0.5 ? -1 : 1);
	
	this.shakeXTween = game.add.tween(this).to({shakeMagnitudeX: 0}, params.duration, Phaser.Easing.Linear.None, true);
	this.shakeYTween = game.add.tween(this).to({shakeMagnitudeY: 0}, params.duration, Phaser.Easing.Linear.None, true);

	//a sine function that is multiplied by the magnitude. The magnitude has a tween set to 0 based on the duration
}
