EnergyController = function() {

	this.energy = 15;
	this.neutralPoint = 15;
};

EnergyController.prototype.UpdateEnergy = function() {
	//move energy towards the neutral point

	//clamp the enrgy and neutral point;
	if(this.energy > 30)
		this.energy = 30;
	if(this.energy < 0)
		this.energy = 0;

	if(this.neutralPoint > 30)
		this.neutralPoint = 30;
	if(this.neutralPoint < 0)
		this.neutralPoint = 0;
};

EnergyController.prototype.AddEnergy = function() {
	this.energy += 1;
	//add energy and modify the neutral point
};

EnergyController.prototype.RemoveEnergy = function() {
	this.energy -= 2;

};

EnergyController.prototype.GetEnergy = function() {
	return this.energy;
};