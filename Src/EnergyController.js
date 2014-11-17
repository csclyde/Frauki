EnergyController = function() {

	this.energy = 15;
	this.neutralPoint = 15;
	this.tickTimer = 0;
	this.gracePeriod = 0;
	
};

EnergyController.prototype.Create = function() {
	this.barContainer = game.add.image(7, 7, 'UI', 'EnergyBar0000');
	this.barContainer.fixedToCamera = true;

	this.energyBar = game.add.image(9, 9, 'UI', 'EnergyBar0001');
	this.energyBar.fixedToCamera = true;
	this.energyBar.anchor.x = 0;

	this.restingPointMarker = game.add.image(this.energyBar.x + (this.energyBar.width / 2) - 2, 5, 'UI', 'EnergyBar0002');
	console.log(this.restingPointMarker.x);
	this.restingPointMarker.fixedToCamera = true;
};

EnergyController.prototype.UpdateEnergy = function() {
	//move energy towards the neutral point. the step should increase in magnitude with distance from
	//the neutral point. The energy wants to rest at the neutral point. the farther it is from there, the
	//more perturbed it is. 

	var energyDiff = this.energy - this.neutralPoint;
	var step = 1;//-1 * energyDiff / 10;

	/*if(step < 0.005 && step > -0.005) this.energy = this.neutralPoint;
	else if(step < 0.2 && step > 0) step = 0.2;
	else if(step > -0.2 && step < 0) step = -0.2;*/

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod) {
		if(Math.abs(energyDiff) < step) {
			this.energy = this.neutralPoint;
		} else {
			if(this.energy > this.neutralPoint) {
				this.energy -= step / 10;
			} else {
				this.energy += step;
			}
		}
		
		this.tickTimer = game.time.now + 200;
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

	if(this.neutralPoint <= 0)
		Frogland.Restart();

	this.energyBar.scale.x = this.energy / 30;
	this.restingPointMarker.cameraOffset.x = 10 + (90 * (this.neutralPoint / 30));
};

EnergyController.prototype.AddEnergy = function(amt) {
	amt = amt || 2;

	this.energy += amt;
	this.neutralPoint += (amt / 5);
	//this.gracePeriod = game.time.now + 500;
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	amt = amt || 7;

	//this.energy -= (amt / 5);
	this.neutralPoint -= (amt / 5);
	//this.gracePeriod = game.time.now + 500;
};

EnergyController.prototype.UseEnergy = function(amt) {
	if(this.energy > 0) {
		this.energy -= amt;
		this.gracePeriod = game.time.now + 300;
		return true;
	}
	
	return false;
};

EnergyController.prototype.GetEnergy = function() {
	return this.energy > 0 ? (Math.round(this.energy * 10) / 10) : 0;
};

EnergyController.prototype.GetNeutral = function() {
	return Math.round(this.neutralPoint * 10) / 10;
}

EnergyController.prototype.DelayEntropy = function() {
	this.tickTimer = game.time.now + 500;
};
