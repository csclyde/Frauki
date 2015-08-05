EnergyController = function() {

	this.energy = 15;
	this.neutralPoint = 15;
	this.tickTimer = 0;
	this.gracePeriod = 0;

	this.energyUsageTimestamp = 0;
};

EnergyController.prototype.Create = function() {
	this.barContainer = game.add.image(7, 7, 'UI', 'EnergyBar0000');
	this.barContainer.fixedToCamera = true;

	this.energyBar = game.add.image(9, 9, 'UI', 'EnergyBar0001');
	this.energyBar.fixedToCamera = true;
	this.energyBar.anchor.x = 0;

	this.energyBarWhite = game.add.image(9, 9, 'UI', 'EnergyBar0003');
	this.energyBarWhite.fixedToCamera = true;
	this.energyBarWhite.anchor.x = 0;
	this.energyBarWhite.visible = false;

	this.energyBarRed = game.add.image(9, 9, 'UI', 'EnergyBar0004');
	this.energyBarRed.fixedToCamera = true;
	this.energyBarRed.anchor.x = 0;
	this.energyBarRed.visible = false;

	this.restingPointMarker = game.add.image(this.energyBar.x + (this.energyBar.width / 2) - 2, 5, 'UI', 'EnergyBar0002');
	this.restingPointMarker.fixedToCamera = true;
};

EnergyController.prototype.UpdateEnergy = function() {

	var energyDiff = this.energy - this.neutralPoint;
	var step = 0.15;

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
				this.energy -= step / 10;
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

	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint <= 0)
		Main.Restart();

	this.energyBar.scale.x = this.energy / 30;
	this.energyBarWhite.scale.x = this.energy / 30;
	this.energyBarRed.scale.x = this.energy / 30;

	if(this.energyBar.scale.x < 0)
		this.energyBar.scale.x = 0;

	this.restingPointMarker.cameraOffset.x = (pixel.width * 0.27 + cameraController.camX / pixel.scale) + (90 * (this.neutralPoint / 30));
	this.restingPointMarker.cameraOffset.y = (pixel.height * 0.3 + cameraController.camY / pixel.scale) - 2;

	this.energyBar.cameraOffset.x = (pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.energyBar.cameraOffset.y = (pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.energyBarWhite.cameraOffset.x = (pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.energyBarWhite.cameraOffset.y = (pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.energyBarRed.cameraOffset.x = (pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;
	this.energyBarRed.cameraOffset.y = (pixel.height * 0.3 + cameraController.camY / pixel.scale) + 2;

	this.barContainer.cameraOffset.x = pixel.width * 0.27 + cameraController.camX / pixel.scale;
	this.barContainer.cameraOffset.y = pixel.height * 0.3 + cameraController.camY / pixel.scale;
};

EnergyController.prototype.UseEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt / 1.2;
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
	this.neutralPoint -= amt * 2;

	this.energyBar.visible = false;
	this.energyBarRed.visible = true;

	game.time.events.add(300, function() { this.energyBar.visible = true; this.energyBarRed.visible = false; }, this)
};

EnergyController.prototype.GetEnergyPercentage = function() {
	var percentageCurve = [0.5, 1, 2];

	return game.math.catmullRomInterpolation(percentageCurve, this.energy / 30);
};