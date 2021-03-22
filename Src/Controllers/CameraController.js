CameraController = function() {
	this.menuTarget = { x: (279 * 16) + 8, y: 110 * 16 };
	this.target = this.menuTarget;


	this.shipBaseTarget = { x: (184 * 16) + 8, y: 186 * 16 };
	this.shipTopTarget = { x: (184 * 16) + 8, y: 45 * 16 };
	
	this.camX = this.menuTarget.x;
	this.camVelX = 0;
	this.camY = this.menuTarget.y;
	this.camVelY = 0;

	this.shakeX = 0;
	this.shakeY = 0;
	this.shakeMagnitudeX = 0;
	this.shakeMagnitudeY = 0;

	events.subscribe('camera_shake', this.ScreenShake, this);
	events.subscribe('pan_camera', this.PanCamera, this);
	events.subscribe('set_camera', this.SetCamera, this);

};

//camera is controlled in player centric space
CameraController.prototype.Update = function() {	
	var xOffset = 0, yOffset = 0;

	this.target = this.target || frauki.body.center;

	if(this.target === frauki.body.center) {
		xOffset = frauki.states.direction === 'left' ? -10 : 10;
		yOffset = 0; //frauki.body.velocity.y > 0 ? 20 : -20;

		yOffset += (frauki.states.crouching ? 50 : 0);

		if(frauki.state === frauki.Rolling) {
			yOffset += 5;
		}

		if(frauki.states.upPressed) {
			if(!inputController.inDoorway && !speechController.FraukiInSpeechZone()) {
				yOffset -= 50;
			}
		}
	}


	var idealX = xOffset + this.target.x;
	var idealY = yOffset + this.target.y;

	this.camVelX = (idealX - this.camX) * 0.08;
	this.camVelY = (idealY - this.camY) * 0.08;

	if(frauki.state === frauki.Teleporting) {
		this.camVelX *= 2;
		this.camVelY *= 2;
	}

	var camXIncrement = this.camVelX * Phaser.Math.smoothstep(Math.abs(this.camVelX), -0.01, 3.33);
	var camYIncrement = this.camVelY * Phaser.Math.smoothstep(Math.abs(this.camVelY), -0.01, 8.0);

	if(Math.abs(camXIncrement) < 0.1) {
		camXIncrement = 0;
	}

	if(Math.abs(camYIncrement) < 0.1) {
		camYIncrement = 0;
	}

	this.camX += camXIncrement;
	this.camY += camYIncrement;


	if(this.shakeMagnitudeX > 0) {
		this.shakeX = Math.sin(game.time.now * 80) * this.shakeMagnitudeX;
	} else {
		this.shakeX = 0;
	}

	if(this.shakeMagnitudeY > 0) {
		this.shakeY = Math.sin(game.time.now * 80) * this.shakeMagnitudeY;
	} else {
		this.shakeY = 0;
	}

	this.camX += this.shakeX;
	this.camY += this.shakeY;

	game.camera.focusOnXY(Math.floor(this.camX), Math.floor(this.camY));
};

CameraController.prototype.Reset = function() {
	this.shakeMagnitudeX = 0;
    this.shakeMagnitudeY = 0;
    if(this.shakeXTween) this.shakeXTween.stop();
    if(this.shakeYTween) this.shakeYTween.stop();
};

CameraController.prototype.ScreenShake = function(params) {
	if(GameState.restarting === true) {
		return;
	}

	this.shakeMagnitudeX = params.magnitudeX;
	this.shakeMagnitudeY = params.magnitudeY;
	
	this.shakeXTween = game.add.tween(this).to({shakeMagnitudeX: 0}, params.duration, Phaser.Easing.Linear.None, true);
	this.shakeYTween = game.add.tween(this).to({shakeMagnitudeY: 0}, params.duration, Phaser.Easing.Linear.None, true);
};

CameraController.prototype.PanCamera = function(params) {
	var transitionTarget = { x: this.target.x, y: this.target.y };
	this.target = transitionTarget;

	var panTween = game.add.tween(transitionTarget).to({x: params.to.x, y: params.to.y}, params.duration, Phaser.Easing.Cubic.InOut, true);
	panTween.onComplete.add(function() {
		cameraController.target = params.to;
	});
};

CameraController.prototype.SetCamera = function(params) {
	cameraController.target = params.to;
	this.camX = params.to.x;
	this.camY = params.to.y;
	this.camVelX = 0;
	this.camVelX = 0;
};

CameraController.prototype.IsObjectOnScreen = function(obj, padding) {
	if(obj.body.right > game.camera.x + padding && 
	   obj.body.bottom > game.camera.y + padding && 
	   obj.body.x < game.camera.x + game.camera.width - padding && 
	   obj.body.y < game.camera.y + game.camera.height - padding) {
		   return true;
	   } else {
		   return false;
	   }
};
