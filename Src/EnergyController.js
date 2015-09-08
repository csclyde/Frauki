EnergyController = function() {

	var that  = this;

	this.energy = 15;
	this.neutralPoint = 15;
	this.charge = 0;
	this.activeCharge = 0;
	this.tickTimer = 0;
	this.gracePeriod = 0;

	this.timers = new TimerUtil();

	this.charging = false;

	this.energyUsageTimestamp = 0;

	events.subscribe('player_power_slash', function() { that.charge = 0; });

};

EnergyController.prototype.Create = function() {

	this.barBackground = game.add.image(7, 7, 'UI', 'EnergyBar0001');
	this.barBackground.fixedToCamera = true;

	this.energyBar = game.add.image(9, 9, 'UI', 'EnergyBar0002');
	this.energyBar.fixedToCamera = true;
	this.energyBar.anchor.x = 0;

	this.chargeBar = game.add.image(9, 20, 'UI', 'EnergyBar0006');
	this.chargeBar.fixedToCamera = true;
	this.chargeBar.anchor.x = 0;

	this.energyBarWhite = game.add.image(9, 9, 'UI', 'EnergyBar0003');
	this.energyBarWhite.fixedToCamera = true;
	this.energyBarWhite.anchor.x = 0;
	this.energyBarWhite.visible = false;

	this.energyBarRed = game.add.image(9, 9, 'UI', 'EnergyBar0003');
	this.energyBarRed.fixedToCamera = true;
	this.energyBarRed.anchor.x = 0;
	this.energyBarRed.visible = false;

	this.barContainer = game.add.image(7, 7, 'UI', 'EnergyBar0000');
	this.barContainer.fixedToCamera = true;

	this.restingPointMarker = game.add.image(this.energyBar.x + (this.energyBar.width / 2) - 2, 5, 'UI', 'EnergyBar0005');
	this.restingPointMarker.fixedToCamera = true;
};

EnergyController.prototype.Update = function() {

	var energyDiff = this.energy - this.neutralPoint;
	var step = 0.20;

	if(game.time.now - this.energyUsageTimestamp > 2000) {
		step += 0.1;
	} else {
		step += ((game.time.now - this.energyUsageTimestamp) / 2000) * 0.1;
	}

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod && !frauki.Attacking() && frauki.state !== frauki.Rolling) {
		if(Math.abs(energyDiff) < step) {
			this.energy = this.neutralPoint;
		} else {
			if(this.energy > this.neutralPoint) {
				this.energy -= step / 100;
			} else {
				if(this.energy < 0) {
					this.energy += step * 0.8;
				} else {
					this.energy += step;
				}
			}
		}

		this.tickTimer = game.time.now + 20;
	}

	//clamp the enrgy and neutral point;
	if(this.energy > 30)
		this.energy = 30;

	if(this.charge > 30)
		this.charge = 30;


	if(this.charge < 0) {
		this.charge = 0;
	}

	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint <= 0)
		Main.Restart();


	this.energyBar.scale.x = this.energy / 30;
	this.energyBarWhite.scale.x = this.energy / 30;
	this.energyBarRed.scale.x = this.energy / 30;
	this.chargeBar.scale.x = this.charge / 30;

	if(this.energyBar.scale.x < 0)
		this.energyBar.scale.x = 0;

	this.restingPointMarker.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + (81 * (this.neutralPoint / 30));
	this.restingPointMarker.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.energyBar.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.energyBar.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.chargeBar.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.chargeBar.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 13;

	this.energyBarWhite.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.energyBarWhite.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.energyBarRed.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.energyBarRed.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.barContainer.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale);
	this.barContainer.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale);

	this.barBackground.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.barBackground.cameraOffset.y = Math.round(pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

};

EnergyController.prototype.UseEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt / 1;
		this.gracePeriod = game.time.now + 600;
		this.energyUsageTimestamp = game.time.now;
		return true;
	} else {
		events.publish('play_sound', {name: 'no_energy'});
		return false;
	}
	
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt;
		this.gracePeriod = game.time.now + 400;
		this.energyUsageTimestamp = game.time.now;
		return true;
	}
};

EnergyController.prototype.GetEnergy = function() {
	return this.energy > 0 ? (Math.round(this.energy * 10) / 10) : 0;
};

EnergyController.prototype.AddPower = function(amt) {
	this.neutralPoint += amt;
};

EnergyController.prototype.RemovePower = function(amt) {

	if(this.energy > this.neutralPoint) {
		if(this.energy - this.neutralPoint > amt) {
			this.energy -= amt;
		} else {
			amt -= (this.energy - this.neutralPoint);
			this.neutralPoint -= amt;
			this.energy = this.neutralPoint;
		}
	} else {
		this.neutralPoint -= amt;

		if(this.energy > this.neutralPoint) {
			this.energy = this.neutralPoint;
		}
	}

	this.energyBar.visible = false;
	this.energyBarRed.visible = true;

	game.time.events.add(300, function() { this.energyBar.visible = true; this.energyBarRed.visible = false; }, this)
};

EnergyController.prototype.GetEnergyPercentage = function() {
	var percentageCurve = [0.5, 1, 2];

	return game.math.catmullRomInterpolation(percentageCurve, this.energy / 30);
};

EnergyController.prototype.AddCharge = function(amt) {
	this.charge += amt;
};

EnergyController.prototype.RemoveCharge = function(amt) {
	this.charge -= amt;
};

EnergyController.prototype.GetDifficultyModifier = function() {
	var percentageCurve = [-0.5, 0, 1];

	return game.math.catmullRomInterpolation(percentageCurve, this.neutralPoint / 30);
};
