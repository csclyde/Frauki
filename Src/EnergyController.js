EnergyController = function() {

	this.energy = 15;
	this.neutralPoint = 15;
	this.tickTimer = 0;
	this.gracePeriod = 0;
};

EnergyController.prototype.UpdateEnergy = function() {
	//move energy towards the neutral point. the step should increase in magnitude with distance from
	//the neutral point. The energy wants to rest at the neutral point. the farther it is from there, the
	//more perturbed it is. 

	var energyDiff = this.energy - this.neutralPoint;
	var step = 0.2;//-1 * energyDiff / 10;

	/*if(step < 0.005 && step > -0.005) this.energy = this.neutralPoint;
	else if(step < 0.2 && step > 0) step = 0.2;
	else if(step > -0.2 && step < 0) step = -0.2;*/

	//if the timer is up, tick the energy and reset the timer
	if(game.time.now > this.tickTimer && game.time.now > this.gracePeriod) {
		if(Math.abs(energyDiff) < step) {
			this.energy = this.neutralPoint;
		} else {
			if(this.energy > this.neutralPoint) {
				this.energy -= step;
			} else {
				this.energy += step;
			}
		}
		
		this.tickTimer = game.time.now + 200;
	}

	//clamp the enrgy and neutral point;
	if(this.energy > 30)
		this.energy = 30;
	if(this.energy < 0)
		this.energy = 0;

	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint < 0)
		this.neutralPoint = 0;

	if(this.neutralPoint <= 0)
		Frogland.Restart();
};

EnergyController.prototype.AddEnergy = function(amt) {
	amt = amt || 2;

	this.energy += amt;
	this.neutralPoint += (amt / 5);
};

EnergyController.prototype.RemoveEnergy = function(amt) {
	amt = amt || 7;

	this.energy -= amt;
	this.neutralPoint -= (amt / 5);
};

EnergyController.prototype.UseEnergy = function(amt) {
	if(this.energy >= amt) {
		this.energy -= amt;
		return true;
	}
	
	return false;
};

EnergyController.prototype.GetEnergy = function() {
	return Math.round(this.energy * 10) / 10;
};

EnergyController.prototype.GetNeutral = function() {
	return Math.round(this.neutralPoint * 10) / 10;
}

EnergyController.prototype.DelayEntropy = function() {
	this.tickTimer = game.time.now + 500;
};
