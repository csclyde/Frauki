EnergyController = function() {

	this.energy = 15;
	this.neutralPoint = 15;
	this.tickTimer = 0;
	this.gracePeriod = 0;

	this.health = 100;
	this.power = 0;
	
};

EnergyController.prototype.Create = function() {
	this.barContainer = game.add.image(7, 27, 'UI', 'EnergyBar0000');
	this.barContainer.fixedToCamera = true;

	this.energyBar = game.add.image(9, 29, 'UI', 'EnergyBar0001');
	this.energyBar.fixedToCamera = true;
	this.energyBar.anchor.x = 0;

	this.healthBarContainer = game.add.image(7, 7, 'UI', 'EnergyBar0000');
	this.healthBarContainer.fixedToCamera = true;

	this.healthBar = game.add.image(9, 9, 'UI', 'EnergyBar0003');
	this.healthBar.fixedToCamera = true;
	this.healthBar.anchor.x = 0;

	/*this.powerContainer = game.add.image(7, 47, 'UI', 'EnergyBar0000');
	this.powerContainer.fixedToCamera = true;

	this.powerBar = game.add.image(9, 49, 'UI', 'EnergyBar0001');
	this.powerBar.fixedToCamera = true;
	this.powerBar.anchor.x = 0;*/

	this.restingPointMarker = game.add.image(this.energyBar.x + (this.energyBar.width / 2) - 2, 25, 'UI', 'EnergyBar0002');
	this.restingPointMarker.fixedToCamera = true;
};

EnergyController.prototype.UpdateEnergy = function() {
	//move energy towards the neutral point. the step should increase in magnitude with distance from
	//the neutral point. The energy wants to rest at the neutral point. the farther it is from there, the
	//more perturbed it is. 

	var energyDiff = this.energy - this.neutralPoint;
	var step = 0.25;

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod && !frauki.Attacking()) {
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
/*	if(this.energy < 0)
		this.energy = 0;*/


	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint < 0)
		this.neutralPoint = 0;

	if(this.health > 100)
		this.health = 100;
	if(this.health < 0)
		this.health = 0;

	if(this.power < 0)
		this.power = 0;

	if(this.health <= 0)
		Main.Restart();

	this.energyBar.scale.x = this.energy / 30;
	this.healthBar.scale.x = this.health / 100;
	//this.powerBar.scale.x = this.power / 100;

	if(this.energyBar.scale.x < 0)
		this.energyBar.scale.x = 0;

	if(this.healthBar.scale.x < 0)
		this.healthBar.scale.x = 0;

	// if(this.powerBar.scale.x < 0)
	// 	this.powerBar.scale.x = 0;


	this.restingPointMarker.cameraOffset.x = 10 + (90 * (this.neutralPoint / 30));
};

EnergyController.prototype.AddEnergy = function(amt) {
	amt = amt || 2;

	this.energy += amt;
	//this.neutralPoint += (amt / 2);
	//this.gracePeriod = game.time.now + 500;
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	return;
	
	amt = amt || 7;

	//this.energy -= (amt / 5);
	//this.neutralPoint -= (amt / 3);
	//this.gracePeriod = game.time.now + 500;
};

EnergyController.prototype.AddHealth = function(amt) {
	this.health += amt;

	effectsController.MakeHearts(amt);
};

EnergyController.prototype.RemoveHealth = function(amt) {
	this.health -= amt * 2;
};

EnergyController.prototype.AddPower = function(amt) {
	this.power += 0; //amt;
};

EnergyController.prototype.RemovePower = function(amt) {
	this.power -= amt;
};

EnergyController.prototype.GetPowerPercentage = function() {
	return this.power / 100;
};

EnergyController.prototype.UseEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt;
		this.gracePeriod = game.time.now + 600;
		return true;
	} else {
		events.publish('play_sound', {name: 'no_energy'});
		return false;
	}
	
};

EnergyController.prototype.GetEnergy = function() {
	return this.energy > 0 ? (Math.round(this.energy * 10) / 10) : 0;
};

